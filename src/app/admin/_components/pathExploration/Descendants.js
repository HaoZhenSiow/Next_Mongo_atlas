import Descendant from "./Descendant"

const Descendants = function ({lvl, next, ancestorPosX, ancestorPosY, ancestorLength, ancestorHeight}) {
  if (next === null) return

  const sortedKeys = getKey(next)
  
  return sortedKeys.map(key => {
    return <Descendant 
      key={lvl + key}
      keyName={key}
      lvl={lvl}
      length={next[key].length}
      precedingSiblingsLength={getPrecedingSiblingsLength(key)}
      ancestorPosX={ancestorPosX}
      ancestorPosY={ancestorPosY}
      ancestorLength={ancestorLength}
      ancestorHeight={ancestorHeight}
      genNext={next[key].next}/>
  })

  function getPrecedingSiblingsLength(key) {
    const idx = sortedKeys.indexOf(key),
          prevKeys = structuredClone(sortedKeys)

    prevKeys.splice(idx)
    
    return prevKeys.reduce((prev, key) => prev + next[key].length, 0)
  }
}

export default Descendants

function getKey(next) {
  const keys = Object.keys(next)

  return keys.sort((a, b) => {
    const x = next[a].length,
          y = next[b].length

    return y - x
  })
}