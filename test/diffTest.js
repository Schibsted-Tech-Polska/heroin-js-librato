const test = require('tape')
const diff = require('../diff')

test('should return created item', (t) => {
  t.plan(1)
  const existing = []
  const created = [{name: 'created', foo: 'bar'}]

  t.deepEqual(diff(existing, created), {
    created: [{name: 'created', foo: 'bar'}],
    updated: [],
    deleted: []
  })
})

test('should return updated item', (t) => {
  t.plan(1)
  const existing = [{name: 'existing', foo: 'bar'}]
  const updated = [{name: 'existing', foo: 'baz'}]

  t.deepEqual(diff(existing, updated), {
    created: [],
    updated: [{name: 'existing', foo: 'baz'}],
    deleted: []
  })
})

test('should return deleted item', (t) => {
  t.plan(1)
  const existing = [{name: 'existing', foo: 'bar'}]
  const updated = []

  t.deepEqual(diff(existing, updated), {
    created: [],
    updated: [],
    deleted: [{name: 'existing', foo: 'bar'}]
  })
})

