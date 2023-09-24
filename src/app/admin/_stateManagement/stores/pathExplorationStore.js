import { createContextStore, action, persist, computed } from 'easy-peasy'
import objectPath from 'object-path'
import session from '../storageEngines/session'
import sortBy from 'sort-by'

const PathExplorationStore = createContextStore(persist({
  rawData: [],
  dataDisplayingObj: computed(setDataDisplayingObj),
  setState: action((state, { stateName, val }) => {
    state[stateName] = val
  })
}, {
  allow: ['selectedField', 'period'],
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

function setDataDisplayingObj({rawData}) {
  if (rawData.length <= 0) return {}

  const sessions = rawData.map(({ events }) => {
    const eventsArr = Object.entries(events)
    return eventsArr.map(event => event[1].event)
  })

  const behaviorPatterns = []

  const result = {
    length: rawData.length,
    path: ['start session'],
    next: genNext(sessions, ['start session'], behaviorPatterns)
  }
  behaviorPatterns.sort(sortBy('-count'))

  return result
}

function genNext(sessions, precedingPath, behaviorPatterns) {
  if (sessions.length <= 0) return null

  const next = {},
        segmentedObj = segment(sessions),
        keys = Object.keys(segmentedObj)
  
  keys.forEach(key => {
    const currentPath = structuredClone(precedingPath)
    currentPath.push(key)

    objectPath.set(next, [key, 'length'], segmentedObj[key].length)
    objectPath.set(next, [key, 'path'], currentPath)
    if (key === 'leaveSite') {
      behaviorPatterns.push({ path: currentPath, count: segmentedObj[key].length})
    } else {
      objectPath.set(next, [key, 'next'], genNext(segmentedObj[key], currentPath, behaviorPatterns))
    }
  })
  return next
}

function segment(sessions) {
  const obj = {}
  sessions.forEach(session => {
    const original = structuredClone(session)

    session.shift()

    if (!obj[original[0]]) {
      obj[original[0]] = [session]
    } else {
      const retrieve = obj[original[0]]
      retrieve.push(session)
      obj[original[0]] = retrieve
    }
  })

  return obj
}