const test = require('tape')
const httpClient = (options) => options
const libratoClient = require('../libratoClient')('username', 'password', httpClient)

var body = {
  name: 'production.web.frontend.response_time'
}

test('should construct correct create alert request', (t) => {
  t.plan(1)

  t.deepEqual(libratoClient.createAlerts([body]), [{
    body: JSON.stringify(body),
    headers: {'Content-Type': 'application/json'},
    method: 'POST',
    url: 'https://username:password@metrics-api.librato.com/v1/alerts'
  }])
})
