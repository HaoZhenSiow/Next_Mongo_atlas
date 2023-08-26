import { generateFakeData, generateFakePercentageData } from "./fakeData"
import { str } from './utils'

export {
  dataCleaning,
}

function dataCleaning(rawData) {
  const sessionDataMap = getSessionsFromRawData(rawData),
        engagedSessionDataMap = getEngagedSessionsFromRawData(rawData),
        bounceRateDataMap = getBounceRateDataMap(sessionDataMap, engagedSessionDataMap),
        engagementRate = getEngagementRateDataMap(sessionDataMap, engagedSessionDataMap)
        // totalUsers = getTotalUsers(rawData)
  
  return {
    Sessions: {
      dataMap: sessionDataMap,
      dataType: 'number'
    },
    BounceRate: {
      dataMap: bounceRateDataMap,
      dataType: 'rate'
    },
    EngagedSessions: {
      dataMap: engagedSessionDataMap,
      dataType: 'number'
    },
    EngagedSessionsPerUser: {
      dataMap: generateFakeData('2023-08-21', 365),
      dataType: 'number'
    },
    EngagementRate: {
      dataMap: engagementRate,
      dataType: 'rate'
    },
    TotalUsers: {
      dataMap: generateFakeData('2023-08-21', 365),
      dataType: 'number'
    },
    NewUsers: {
      dataMap: generateFakeData('2023-08-21', 365),
      dataType: 'number'
    },
    ReturningUsers: {
      dataMap: generateFakeData('2023-08-21', 365),
      dataType: 'number'
    },
    Conversions: {
      dataMap: generateFakeData('2023-08-21', 365),
      dataType: 'number'
    },
    SessionConversionRate: {
      dataMap: generateFakePercentageData('2023-08-21', 365),
      dataType: 'rate'
    },
    UserConversionRate: {
      dataMap: generateFakePercentageData('2023-08-21', 365),
      dataType: 'rate'
    },
  }
}

function getSessionsFromRawData(rawData) {
  return groupAndCount(rawData, 'createdAt')
}

function getEngagedSessionsFromRawData(rawData) {
  const resultMap = new Map()

  for (const obj of rawData) {
    const duration = Date.parse(obj.updatedAt) - Date.parse(obj.createdAt)
    const createdDate = str(obj.createdAt)

    if (duration >= 15 * 1000 && resultMap.has(createdDate)) {
      resultMap.set(createdDate, resultMap.get(createdDate) + 1)
    } else if (duration >= 15 * 1000) {
      resultMap.set(createdDate, 1)
    }
  }

  return resultMap
}

function getBounceRateDataMap(sessionsByDate, engagedSessionsByDate) {
  const resultMap = new Map()

  for (let obj of sessionsByDate) {
    const [ date, sessions ] = obj,
          engagedSessions = engagedSessionsByDate.get(date)
  
    resultMap.set(date, parseFloat(((sessions - engagedSessions)/sessions*100).toFixed(2)))
  }

  return resultMap
}

function getEngagementRateDataMap(sessionsByDate, engagedSessionsByDate) {
  const resultMap = new Map()

  for (let obj of sessionsByDate) {
    const [ date, sessions ] = obj,
          engagedSessions = engagedSessionsByDate.get(date)
    
    resultMap.set(date, parseFloat((engagedSessions/sessions*100).toFixed(2)))
  }

  return resultMap
}

function groupAndCount(array, property) {

  const resultMap = new Map();

  if (array.length < 1) {
    return resultMap;
  }

  for (const obj of array) {
    const value = str(obj[property]);

    if (resultMap.has(value)) {
      resultMap.set(value, resultMap.get(value) + 1);
    } else {
      resultMap.set(value, 1);
    }
  }

  return resultMap;
}