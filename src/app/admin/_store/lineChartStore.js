import { str } from '../_lib/utils'
import { createContextStore, action, persist, computed } from 'easy-peasy'
import myCustomStorage from './myCustomStorage'

const LineChartStore = createContextStore(persist({
  viewBoxWidth: 1000,
  viewBoxHeight: 200,
  rawData: [],
  selectedField: 'Sessions',
  period: 'Last 7 days',
  startDate: new Date(),
  endDate: new Date(),
  Xinterval: 'day',
  page: 'All Pages',
  device: 'All Devices',
  browser: 'All Browsers',
  traffic: 'all sources',
  device2: 'All Devices',
  browser2: 'All Browsers',
  traffic2: 'all sources',
  pages: computed(listPages),
  browsers: computed(listBrowsers),
  trafficSources: computed(listTrafficSources),
  dataDisplayingMap: computed(setDataDisplayingMap1),
  dataDisplayingMap2: computed(setDataDisplayingMap2),
  dataDisplayingType: computed(setDataType),
  medium: computed(defineMedium),
  dateArr: computed(createDateArr),
  dataPointDates: computed(getDataPointDates),
  dataAreas: computed(computeDataAreas),
  total: computed(computeTotal1),
  total2: computed(computeTotal2),
  polyline: computed(computePolyline1),
  polyline2: computed(computePolyline2),
  setSelectedField: action((state, payload) => {
    state.selectedField = payload
  }),
  setRawData: action((state, payload) => {
    state.rawData = payload
  }),
  setPage: action((state, payload) => {
    state.page = payload
  }),
  setDevice: action((state, payload) => {
    state.device = payload
  }),
  setBrowser: action((state, payload) => {
    state.browser = payload
  }),
  setTraffic: action((state, payload) => {
    state.traffic = payload
  }),
  setDevice2: action((state, payload) => {
    state.device2 = payload
  }),
  setBrowser2: action((state, payload) => {
    state.browser2 = payload
  }),
  setTraffic2: action((state, payload) => {
    state.traffic2 = payload
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
  setXinterval: action((state, payload) => {
    state.Xinterval = payload
  })
}, {
  name: 'LineChartStore',
  allow: ['viewBoxWidth', 'viewBoxHeight', 'rawData', 'selectedField', 'period', 'startDate', 'endDate', 'Xinterval', 'page', 'device', 'browser', 'traffic'],
  storage: myCustomStorage('lineChartStore')
}))

export default LineChartStore;

export function useLineChartStore() {
  const states = LineChartStore.useStoreState(state => state),
        actions = LineChartStore.useStoreActions(actions => actions)
  return { ...states, ...actions }
}

function createDateArr({ period }) {
  const dateArr = []
  let diff,
      endDate = new Date()
  
  if (period === 'Last 28 days') {
    diff = 27;
  } else if (period === 'Last 90 days') {
    diff = 89;
  } else if (period === 'Last 12 months') {
    diff = 364;
  } else if (period.startDate) {
    endDate = period.endDate;
    diff = (endDate - period.startDate) / (1000 * 60 * 60 * 24)
  } else {
    diff = 6;
  }

  for (let i = diff; i >= 0; i--) {
    const fullDate = (new Date(endDate - i * 24 * 60 * 60 * 1000)),
          day = String(fullDate.getDate()).padStart(2, '0'),
          month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(fullDate)
    let showDateLabel = false
 
    if (diff < 7) {
      showDateLabel = true;
    } else if (diff < 14) {
      showDateLabel = i % 2 === 0;
    } else if (diff < 59) {
      showDateLabel = i % 7 === 0;
    } else {
      showDateLabel = fullDate.getDate() === 1;
    }
    
    dateArr.push({ fullDate, day, month, showDateLabel })
  }

  return dateArr
}

function setDataType({ selectedField }) {
  const number = ['Sessions', 'Engaged Sessions', 'Engaged Sessions Per User', 'Total Users', 'New Users', 'Returning Users', 'Conversions']

  const percentage = ['Bounce Rate', 'Engagement Rate', 'Session Conversion Rate']

  return number.includes(selectedField) ? 'number' : percentage.includes(selectedField) ? 'percentage' : 'number'
}

function getDataPointDates({ dateArr, Xinterval }) {
  let visibleDates = dateArr

  switch (Xinterval) {
    case 'week':
      visibleDates = visibleDates.filter((date) => (new Date(date.fullDate)).getDay() === 0)
      break
    case 'month':
      visibleDates = visibleDates.filter((date) => (new Date(date.fullDate)).getDate() === 1)
      break
  }
  visibleDates = visibleDates.map(date => str(date.fullDate))

  return visibleDates
}

function setDataDisplayingMap1({ rawData, selectedField, device, browser, traffic, dateArr, Xinterval }) {
  return setDataDisplayingMap(rawData, selectedField, device, browser, traffic, dateArr, Xinterval)
}

function setDataDisplayingMap2({ rawData, selectedField, device2, browser2, traffic2, dateArr, Xinterval }) {
  return setDataDisplayingMap(rawData, selectedField, device2, browser2, traffic2, dateArr, Xinterval)
}

function setDataDisplayingMap(rawData, selectedField, device, browser, traffic, dateArr, Xinterval) {
  const filteredDateStrArr = dateArr.map(({ fullDate }) => str(fullDate)),
        filteredData = rawData.filter(({ createdAt }) => filteredDateStrArr.includes(str(createdAt))),
        filteredDataByDevice = device !== 'All Devices' ? filteredData.filter(session => session.device === device) : filteredData,
        filteredDataByBrowser = browser !== 'All Browsers' ? filteredDataByDevice.filter(session => session.browser === browser) : filteredDataByDevice,
        filteredDataByTraffic = traffic !== 'all sources' ? filteredDataByBrowser.filter(({ referrer }) => referrer === traffic) : filteredDataByBrowser,
        filteredDataInGroup = groupByXinterval(filteredDataByTraffic, filteredDateStrArr, Xinterval)

  let newMap = new Map()

  switch (selectedField) {
    case 'Engaged Sessions':
      filteredDataInGroup.forEach((array, dateStr) => {
        const newArr = array.filter(session => {
          const duration = Date.parse(session.updatedAt) - Date.parse(session.createdAt)
          return duration >= 15 * 1000
        })
        newMap.set(dateStr, newArr)
      })
      return CountInGroup(newMap)

    case 'Engagement Rate':
      filteredDataInGroup.forEach((array, dateStr) => {
        const newArr = array.filter(session => {
          const duration = Date.parse(session.updatedAt) - Date.parse(session.createdAt)
          return duration >= 15 * 1000
        })

        const sessions = array.length,
              engaged = newArr.length
        
        newMap.set(dateStr, parseFloat((engaged/sessions*100).toFixed(2)))
      })

      return newMap
    
    case 'Bounce Rate':

      filteredDataInGroup.forEach((array, dateStr) => {
        const newArr = array.filter(session => {
          const duration = Date.parse(session.updatedAt) - Date.parse(session.createdAt)
          return duration >= 15 * 1000
        })

        const sessions = array.length,
              bounce = sessions - newArr.length
        
        newMap.set(dateStr, parseFloat((bounce/sessions*100).toFixed(2)))
      })

      return newMap

    case 'Total Users':
      filteredDataInGroup.forEach((array, dateStr) => {
        const uids = [],
              ips = []

        const users = array.reduce((prev, session) => {
          
          if (uids.includes(session.uid)) {
            return prev
          }
          if (ips.includes(session.ip)) {
            return prev
          }
          session.uid && uids.push(session.uid)
          session.ip && ips.push(session.ip)

          return prev + 1
        }, 0)

        newMap.set(dateStr, users)
      })
      
      return newMap

    case 'New Users':
      filteredDataInGroup.forEach((array, dateStr) => {
        const newArr = array.filter(session => {
          return session.newUser
        })
        
        newMap.set(dateStr, newArr.length)
      })

      return newMap

    case 'Returning Users':
      filteredDataInGroup.forEach((array, dateStr) => {
        const uids = [],
              ips = []

        const users = array.reduce((prev, session) => {
          
          if (uids.includes(session.uid)) {
            return prev
          }
          if (ips.includes(session.ip)) {
            return prev
          }
          session.uid && uids.push(session.uid)
          session.ip && ips.push(session.ip)

          return prev + 1
        }, 0)

        const newArr = array.filter(session => {
          return session.newUser
        })
        
        newMap.set(dateStr, users - newArr.length)
      })

      return newMap

    case 'Conversions':
      filteredDataInGroup.forEach((array, dateStr) => {
        const conversions = array.filter(session => {
          return session.events.some(event => {
            return event.type === 'conversion'
          })
        })

        newMap.set(dateStr, conversions.length)
      })

      return newMap

    case 'Session Conversion Rate':
      filteredDataInGroup.forEach((array, dateStr) => {
        const sessions = array.length
        const conversions = array.filter(session => {
          return session.events.some(event => {
            return event.type === 'conversion'
          })
        })
        newMap.set(dateStr, parseFloat((conversions.length/sessions*100).toFixed(2)))
      })

      return newMap

    default:
      return CountInGroup(filteredDataInGroup)
  }
}

function CountInGroup(map) {

  const resultMap = new Map()

  map.forEach((array, dateStr) => {
    resultMap.set(dateStr, array.length)
  })
 
  return resultMap;
}

function groupByXinterval(dataArr, dateStrArr, Xinterval) {
  const groupedData = new Map()

  dataArr.forEach(data => {
    let sessionDate = new Date(data.createdAt)

    switch (Xinterval) {
      case 'week':
        sessionDate = sessionDate.setDate(sessionDate.getDate() - sessionDate.getDay())
        break
      case 'month':
        sessionDate = new Date(sessionDate.getFullYear(), sessionDate.getMonth(), 1)
        break
    }

    const dateStr = str(sessionDate)

    if (!groupedData.has(dateStr) && dateStrArr.includes(dateStr)) {
      groupedData.set(dateStr, [data]);
    } else if (dateStrArr.includes(dateStr)) {
      const dataGroup = groupedData.get(dateStr)
      dataGroup.push(data)
      groupedData.set(dateStr, dataGroup)
    }
    
  })

  return groupedData
}

function computeDataAreas({ dataPointDates }) {
  return dataPointDates.length > 1 ? dataPointDates.length - 1 : 1
}

function computeTotal1({ dataDisplayingMap, dataDisplayingType, dateArr }) {
  return computeTotal(dataDisplayingMap, dataDisplayingType, dateArr)
}

function computeTotal2({ dataDisplayingMap2, dataDisplayingType, dateArr }) {
  return computeTotal(dataDisplayingMap2, dataDisplayingType, dateArr)
}

function computeTotal(dataDisplayingMap, dataDisplayingType, dateArr) {
  let total = 0

  dataDisplayingMap.forEach(val => {
    total += val
  })
// console.log(dataDisplayingMap, dataDisplayingType)
  if (dataDisplayingType === 'percentage') {
    
    total = Math.round((total / dateArr.length) * 100) / 100 + '%'
  }

  return total
}

function computePolyline1({ viewBoxWidth, viewBoxHeight, dataDisplayingMap, dateArr, dataPointDates, medium }) {
  return computePolyline(viewBoxWidth, viewBoxHeight, dataDisplayingMap, dateArr, dataPointDates, medium)
}

function computePolyline2({ viewBoxWidth, viewBoxHeight, dataDisplayingMap2, dateArr, dataPointDates, medium }) {
  return computePolyline(viewBoxWidth, viewBoxHeight, dataDisplayingMap2, dateArr, dataPointDates, medium)
}

function computePolyline(viewBoxWidth, viewBoxHeight, dataDisplayingMap, dateArr, dataPointDates, medium) {
  let polyline = ''

  dateArr.forEach((date, index) => {
    const posX = index / (dateArr.length - 1) * 0.95 * viewBoxWidth,
          high = medium.value * 2 * medium.unitVal,
          dateStr = str(date.fullDate),
          dataVal = dataDisplayingMap.get(dateStr) ? dataDisplayingMap.get(dateStr) : 0,
          dataPos = (Math.abs(dataVal-high) / high) * 80

    if (dataPointDates.includes(dateStr)) {
      polyline += ` ${posX},${dataPos/100 * viewBoxHeight} `
    }
  })

  return polyline
}

function defineMedium({ dataDisplayingMap, dataDisplayingMap2, dataDisplayingType }) {
  const valArr1 = Array.from(dataDisplayingMap.values()),
        valArr2 = Array.from(dataDisplayingMap2.values()),
        highest1 = Math.max(...valArr1),
        highest2 = Math.max(...valArr2),
        valArr = highest1 > highest2 ? valArr1 : valArr2,
        highest = highest1 > highest2 ? highest1 : highest2,
        newHighest = highest % 2 ? highest + 1 : highest,
        sum = valArr.reduce((acc, value) => acc + value, 0),
        average = sum / valArr.length,
        digit = Math.trunc(average).toString().length - 1 || 1,
        nearest = 10 ** digit

  let medium = average > 9 ? Math.round(average / nearest) * nearest : 10

  if (medium * 2 < newHighest) {
    medium = Math.ceil((newHighest/2) / nearest) * nearest
  }

  let value  = dataDisplayingType === 'percentage' ? 50 : medium,
      unit = '',
      unitVal = 1

  switch (true) {
    case (value/2 >= 1000000):
      unit = 'M'
      unitVal = 1000000
      value /= unitVal
      break
    case (value/2 >= 1000):
      unit = 'K'
      unitVal = 1000
      value /= unitVal
      break
  }
  return { value, unit, unitVal, sum }
}

function listPages({ rawData }) {
  const events = rawData.flatMap(session => (session.events)),
        pageViews = events.filter(event => event.type === 'pageView'),
        pages = new Set(pageViews.map(pageView => (pageView.event)))
  return [...pages].sort()
}

function listBrowsers({ rawData }) {
  const filter = new Set(rawData.map(session => (session.browser)))
  return [...filter]
}

function listTrafficSources({ rawData }) {
  const filter = new Set(rawData.map(session => (session.referrer)))
  return [...filter]
}