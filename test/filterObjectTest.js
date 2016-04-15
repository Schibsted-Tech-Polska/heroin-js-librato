const test = require('tape')
const filterObject = require('../lib/filterObject')

test('should filter out nested key', (t) => {
  t.plan(1)

  t.deepEqual(filterObject({id: 'remove', nested: {id: 'remove'}}, 'id'), {nested: {}})
})

test('should filter out nested keys', (t) => {
  t.plan(1)

  t.deepEqual(filterObject({
    id: 'remove',
    created: 'remove',
    nested: {id: 'remove', created: 'remove'}
  }, [ 'id', 'created' ]), {nested: {}})
})
