const test = require('tape')
const slackConfig = {
  type: 'slack',
  settings: {url: 'https://hooks.slack.com/services/xyz'},
  title: 'Slack notification'
}
const alertsConfig = [ {
  name: 'myapp.test.alert1',
  id: 123,
  services: [ slackConfig ]
} ]
const servicesConfig = [ {
  id: 567,
  type: 'campfire',
  settings: {
    room: 'Ops',
    token: '1234',
    subdomain: 'acme'
  },
  title: 'Camfire notification'
} ]

function app (librato) {
  return require('../lib/app')(librato)
}

test('should create a corresponding notification service when it does not exist', (t) => {
  t.plan(1)

  var fakeLibratoClient = require('./fakeLibratoClient')(alertsConfig, servicesConfig)
  fakeLibratoClient.createServices = function (config) {
    t.ok(config)
    return []
  }

  app(fakeLibratoClient).createOrUpdate(alertsConfig).catch(t.fail)
})
