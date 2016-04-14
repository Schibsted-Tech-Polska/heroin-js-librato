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

test('should ignore unlisted keys for update', (t) => {
  t.plan(1)
  const existing = [{name: 'existing', foo: 'bar', id: 'ignore me'}]
  const updated = [{name: 'existing', foo: 'bar'}]

  t.deepEqual(diff(existing, updated), {
    created: [],
    updated: [],
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

test('should return modification in comprehensive diff', (t) => {
  t.plan(1)
  const existing = [{name: 'existing', foo: 'bar'}, {name: 'update', foo: 'baz'}, {name: 'delete', foo: 'bay'}]
  const updated = [{name: 'existing', foo: 'bar'}, {name: 'update', foo: 'bar', fizz: 'buzz'}, {name: 'created', foo: 'bay'}]

  t.deepEqual(diff(existing, updated), {
    created: [{name: 'created', foo: 'bay'}],
    updated: [{name: 'update', foo: 'bar', fizz: 'buzz'}],
    deleted: [{name: 'delete', foo: 'bay'}]
  })
})

