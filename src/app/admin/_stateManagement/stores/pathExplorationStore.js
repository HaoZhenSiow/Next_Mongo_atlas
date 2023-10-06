import { createContextStore, action, persist, computed } from 'easy-peasy'
import objectPath from 'object-path'
import session from '../storageEngines/session'
import dayjs from 'dayjs'
import sortBy from 'sort-by'

const PathExplorationStore = createContextStore(persist({
  rawData: [],
  period: 'Last 7 days',
  startDate: new Date(),
  endDate: new Date(),
  sessionType: 'all',
  userType: 'all',
  deviceType: 'all',
  trafficSource: 'all',
  trafficSources: computed(listTrafficSources),
  dataDisplayingObj: computed(setDataDisplayingObj),
  setState: action((state, { stateName, val }) => {
    state[stateName] = val
  })
}, {
  allow: ['period', 'sessionType', 'userType', 'deviceType', 'trafficSource'],
  storage: session('PathExplorationStore')
}))

export default PathExplorationStore


export function usePathExplorationStore() {
  const states = PathExplorationStore.useStoreState(state => state),
        actions = PathExplorationStore.useStoreActions(actions => actions),
        setState = function(stateName, val) {
          return actions.setState({ stateName, val })
        }
  return { ...states, ...actions, setState }
}

function setDataDisplayingObj({ rawData, period, userType, deviceType, trafficSource, sessionType }) {
  if (rawData.length <= 0) return {}

  let filteredData = filterByPeriod(rawData, period)
      
  filteredData = filterByUserType(filteredData, userType)
  filteredData = deviceType !== 'all' ? filteredData.filter(session => session.device === deviceType) : filteredData
  filteredData = trafficSource !== 'all' ? filteredData.filter(({ referrer }) => referrer === trafficSource) : filteredData
  filteredData = filterBySessionType(filteredData, sessionType)

  const sessions = filteredData.map(({ events }) => {
    const eventsArr = Object.entries(events)
    return eventsArr.map(event => event[1].event)
  })
  // console.log(filteredData)
  // const behaviorPatterns = []

  const result = {
    length: sessions.length,
    path: ['start session'],
    next: () => genNext(sessions, ['start session'])
    // next: genNext(sessions, ['start session'], behaviorPatterns)
  }
  // behaviorPatterns.sort(sortBy('-count'))

  return result
}

function genNext(sessions, precedingPath) {
  if (sessions.length <= 0) return null

  const next = {},
        segmentedObj = segment(sessions),
        keys = Object.keys(segmentedObj)
  
  keys.forEach(key => {
    const currentPath = structuredClone(precedingPath)
    currentPath.push(key)

    objectPath.set(next, [key, 'length'], segmentedObj[key].length)
    objectPath.set(next, [key, 'path'], currentPath)
    if (key !== 'leaveSite') {
      objectPath.set(next, [key, 'next'], () => genNext(segmentedObj[key], currentPath))
    }
    // if (key === 'leaveSite') {
    //   behaviorPatterns.push({ path: currentPath, count: segmentedObj[key].length})
    // } else {
    //   objectPath.set(next, [key, 'next'], () => genNext(segmentedObj[key], currentPath, behaviorPatterns))
    // }
  })
  return next
}

function segment(sessions) {
  const obj = {}
  sessions.forEach(session => {
    const sessionClone = structuredClone(session)

    sessionClone.shift()

    if (!obj[session[0]]) {
      obj[session[0]] = [sessionClone]
    } else {
      const retrieve = obj[session[0]]
      retrieve.push(sessionClone)
      obj[session[0]] = retrieve
    }
  })

  return obj
}

function listTrafficSources({ rawData }) {
  const filter = new Set(rawData.map(session => (session.referrer)))
  return [...filter]
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


function filterByUserType(filteredData, userType) {
  switch (userType) {
    case 'new':
      return filteredData.filter(session => session.newUser)
    case 'returning':
      return filteredData.filter(session => !session.newUser)
    default:
      return filteredData
  }
}

function filterBySessionType(filteredData, sessionType) {
  switch (sessionType) {
    case 'engaged':
      return filteredData.filter(({ createdAt, updatedAt }) => {
        const duration = Date.parse(updatedAt) - Date.parse(createdAt)
        return duration >= 15 * 1000
      })
    case 'conversion':
      return filteredData.filter(session => {
        const events = session.events.map(event => event.type)
        return events.includes('conversion')
      })
    default:
      return filteredData
  }
}