import { createContextStore, action, persist, computed } from 'easy-peasy'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)
import myCustomStorage from '../myCustomStorage'

const PagesStatisticStore = createContextStore(persist({
  rawData: [],
  period: 'Last 7 days',
  startDate: new Date(),
  endDate: new Date(),
  stats: computed(computeStats),
  setRawData: action((state, payload) => {
    state.rawData = payload
  }),
  setPeriod: action((state, payload) => {
    state.period = payload
  }),
  setStartDate: action((state, payload) => {
    state.startDate = payload
  }),
  setEndDate: action((state, payload) => {
    state.endDate = payload
  }),
}, {
  allow: ['period', 'startDate', 'endDate'],
  storage: myCustomStorage('PagesStatisticStore')
}))

export default PagesStatisticStore;

export function usePagesStatisticStore() {
  const states = PagesStatisticStore.useStoreState(state => state),
        actions = PagesStatisticStore.useStoreActions(actions => actions)
  return { ...states, ...actions }
}

function computeStats({ rawData, period }) {
  const eventsByPage = {},
        conversionsByPage = {},
        sessions = filterByPeriod(rawData, period),
        pageViews = getPageViews(sessions),
        conversions = getConversions(sessions)

  conversions.forEach(conversion => {
    conversionsByPage[conversion.page] ? conversionsByPage[conversion.page] += 1 : conversionsByPage[conversion.page] = 1
  })
  pageViews.forEach(pageView => {
    eventsByPage[pageView.event] ? eventsByPage[pageView.event].push(pageView) : eventsByPage[pageView.event] = [pageView]
  })
  return { eventsByPage, conversionsByPage }
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

function getPageViews(sessions) {
  return sessions.flatMap(session => {
    const events = filterEventsByTypes(session.events, 'pageView')
    return addUidIpToEvents(session, events)
  })
}

function getConversions(sessions) {
  return sessions.flatMap(session => {
    return filterEventsByTypes(session.events, 'conversion')
  })
}

function filterEventsByTypes(events, type) {
  return events.filter(event => {
    return event.type === type
  })
}

function addUidIpToEvents(session, events) {
  return events.map(pageView => ({
    ...pageView,
    uid: session.uid || null,
    ip: session.ip || null
  }))
}