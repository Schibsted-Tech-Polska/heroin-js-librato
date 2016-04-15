const test = require('tape')
const httpClient = (options) => options
const libratoClient = require('../lib/libratoClient')('username', 'password', httpClient)

var body = {
  name: 'production.web.frontend.response_time',
  id: '1234'
}

test('should construct correct create alert request', (t) => {
  t.plan(1)

  t.deepEqual(libratoClient.createAlerts([ body ]), [ {
    body: JSON.stringify(body),
    headers: {'Content-Type': 'application/json'},
    method: 'POST',
    url: 'https://username:password@metrics-api.librato.com/v1/alerts'
  } ])
})

test('should construct correct update alert request', (t) => {
  t.plan(1)

  t.deepEqual(libratoClient.updateAlerts([ body ]), [ {
    body: JSON.stringify(body),
    headers: {'Content-Type': 'application/json'},
    method: 'PUT',
    url: 'https://username:password@metrics-api.librato.com/v1/alerts/1234'
  } ])
})

test('should construct correct delete alert request', (t) => {
  t.plan(1)

  t.deepEqual(libratoClient.deleteAlerts([ body ]), [ {
    method: 'DELETE',
    url: 'https://username:password@metrics-api.librato.com/v1/alerts/1234'
  } ])
})

test('should construct correct fetch all alerts request', (t) => {
  t.plan(1)

  t.deepEqual(libratoClient.fetchAllAlerts(), 'https://username:password@metrics-api.librato.com/v1/alerts?version=2')
})
