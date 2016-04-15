function filterObjectSingle (obj, key) {
  for (var i in obj) {
    if (!obj.hasOwnProperty(i)) continue
    if (typeof obj[ i ] === 'object') {
      filterObjectSingle(obj[ i ], key)
    } else if (i === key) {
      delete obj[ key ]
    }
  }
  return obj
}

function filterObject (obj, keys) {
  if (typeof keys === 'string') return filterObjectSingle(obj, keys)
  keys.forEach((key) => filterObjectSingle(obj, key))
  return obj
}

module.exports = filterObject
