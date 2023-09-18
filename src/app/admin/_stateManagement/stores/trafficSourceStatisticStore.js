import { createContextStore, action, persist, computed } from 'easy-peasy'
import dayjs from 'dayjs';
import session from '../storageEngines/session'

const TrafficSourceStatisticStore = createContextStore(persist({
  rawData: [],
  selectedField: 'Sessions',
  period: 'Last 7 days',
  startDate: new Date(),
  endDate: new Date(),
  trafficSources: computed(listTrafficSources),
  dataDisplayingMap: computed(setDataDisplayingMap),
  isRate: computed(({ selectedField }) => selectedField.endsWith('Rate') ? '%' : ''),
  setState: action((state, { stateName, val }) => {
    state[stateName] = val
  })
}, {
  allow: ['selectedField', 'period'],
  storage: session('TrafficSourceStatisticStore')
}))

export default TrafficSourceStatisticStore


export function useTrafficSourceStatisticStore() {
  const states = TrafficSourceStatisticStore.useStoreState(state => state),
        actions = TrafficSourceStatisticStore.useStoreActions(actions => actions),
        setState = function(stateName, val) {
          return actions.setState({ stateName, val })
        }
  return { ...states, ...actions, setState }
}

function listTrafficSources({ rawData }) {
  const filter = new Set(rawData.map(session => (session.referrer)))
  return [...filter]
}

function setDataDisplayingMap({ rawData, period, selectedField }) {
  if (rawData.length <= 0) return

  const filteredData = filterByPeriod(rawData, period),
        segmentedData = segmentDataByTrafficSource(filteredData),
        result = computeResult(segmentedData, selectedField)

  return result
}

function filterByPeriod(rawData, period) {
  switch (period) {
    case 'Last 7 days':
      return filter(rawData, 7)
    case 'Last 28 days':
      return filter(rawData, 28)
    case 'Last 90 days':
      return filter(rawData, 90)
    case 'Last 12 months':
      return filter(rawData, 365)
    default:
      return filterBetween(rawData, period)
  }

}

function filter(rawData, days) {
  return rawData.filter(session => {
    return dayjs(session.createdAt).isAfter(dayjs().subtract(days, 'day'))
  })
}

function filterBetween(rawData, period) {
  const startDate = dayjs(period.startDate).startOf('day'),
        endDate = dayjs(period.endDate).endOf('day')
  return rawData.filter(session => {
    return dayjs(session.createdAt).isBetween(startDate, endDate)
  })
}

function segmentDataByTrafficSource(filteredData) {
  const segmentedData = new Map()

  filteredData.forEach(session => {
    const segment = segmentedData.get(session.referrer) || []
    segmentedData.set(session.referrer, [...segment, session])
  })

  return segmentedData
}

function computeResult(segmentedData, selectedField) {
  const computeMapData = callback => (new Map([...segmentedData].map(([source, sessions]) => callback(source, sessions))))

  switch (selectedField) {
    case 'Sessions':
      return computeMapData((source, sessions) => [source, sessions.length])
    case 'Bounce Rate':
      return computeMapData((source, sessions) => {
        const bounce = computeEngagement(sessions)
        return [source, percentage(bounce.length/sessions.length)]
      })
    case 'Engaged Sessions':
      return computeMapData((source, sessions) => {
        const engaged = computeEngagement(sessions, 'engaged')
        return [source, engaged.length]
      })
    case 'Engagement Rate':
      return computeMapData((source, sessions) => {
        const engaged = computeEngagement(sessions, 'engaged')
        return [source, percentage(engaged.length/sessions.length)]
      })
    case 'Total Users':
      return computeMapData((source, sessions) => [source, totalUser(sessions)])
    case 'New Users':
      return computeMapData((source, sessions) => {
        const newUsers = sessions.filter(session => session.newUser)
        return [source, newUsers.length]
      })
    case 'Returning Users':
      return computeMapData((source, sessions) => {
        const newUsers = sessions.filter(session => session.newUser)
        return [source, totalUser(sessions) - newUsers.length]
      })
    case 'Conversions':
      return computeMapData((source, sessions) => {
        const conversions = filterConverted(sessions)
        return [source, conversions.length]
      })
    case 'Session Conversion Rate':
      return computeMapData((source, sessions) => {
        const conversions = filterConverted(sessions)
        return [source, percentage(conversions.length/sessions.length)]
      })
    case 'User Conversion Rate':
      return computeMapData((source, sessions) => {
        const conversions = filterConverted(sessions),
              convertedUsers = totalUser(conversions)
        return [source, percentage(convertedUsers/totalUser(sessions))]
      })
  }
}

function percentage(expr) {
  return parseFloat(((expr)*100).toFixed(2))
}

function computeEngagement(sessions, engaged) {
  return sessions.filter(({ createdAt, updatedAt }) => {
    const duration = Date.parse(updatedAt) - Date.parse(createdAt)
    return engaged ? duration >= 15 * 1000 : duration < 15 * 1000
  })
}

function totalUser(sessions) {
  const uids = [],
        ips = []

  return sessions.reduce((prev, session) => {

  if (uids.includes(session.uid) || ips.includes(session.ip)) return prev

  session.uid && uids.push(session.uid)
  session.ip && ips.push(session.ip)

  return prev + 1
  }, 0)
}

function filterConverted(sessions) {
  return sessions.filter(session => {
    return session.events.some(event => event.type === 'conversion')
  })
}