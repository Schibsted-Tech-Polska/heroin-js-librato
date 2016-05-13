'use strict'
const _ = require('lodash')
const isSubset = require('is-subset')

function diff (existingItems, newItems, comparator) {
  let itemComparator = comparator || ((a, b) => a.name === b.name)

  return {
    created: created(existingItems, newItems, itemComparator),
    updated: updated(existingItems, newItems, itemComparator),
    deleted: deleted(existingItems, newItems, itemComparator)
  }
}

function updated (existingItems, newItems, comparator) {
  return newItems.reduce((acc, curr) => {
    var found = existingItems.find((item) => comparator(item, curr))
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

function deleted (existingItems, newItems, comparator) {
  return created(newItems, existingItems, comparator)
}

function created (existingItems, newItems, comparator) {
  return newItems.reduce((acc, curr) => {
    var found = existingItems.find((item) => comparator(item, curr))
    if (!found) {
      acc.push(curr)
    }

    return acc
  }, [])
}

module.exports = diff
