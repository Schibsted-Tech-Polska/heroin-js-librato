const _ = require('lodash')
const isSubset = require('is-subset')

function diff (existingItems, newItems) {
  return {
    created: created(existingItems, newItems),
    updated: updated(existingItems, newItems),
    deleted: deleted(existingItems, newItems)
  }
}

function updated (existingItems, newItems) {
  return newItems.reduce((acc, curr) => {
    var found = existingItems.find((item) => item.name === curr.name)
    if (found) {
      if (!curr.id && found.id) {
        curr.id = found.id
      }
      found = _.pick(found, Object.keys(curr))
    }
    if (found && !isSubset(found, curr)) {
      acc.push(curr)
    }

    return acc
  }, [])
}

function deleted (existingItems, newItems) {
  return created(newItems, existingItems)
}

function created (existingItems, newItems) {
  return newItems.reduce((acc, curr) => {
    var found = existingItems.find((item) => item.name === curr.name)
    if (!found) {
      acc.push(curr)
    }

    return acc
  }, [])
}

module.exports = diff
