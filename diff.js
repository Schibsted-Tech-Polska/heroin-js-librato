const _ = require('lodash')

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
    if (found && !_.isEqual(found, curr)) {
      acc.push(curr)
    }

    return acc
  }, [])
}

function deleted (existingItems, newItems) {
  return []
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