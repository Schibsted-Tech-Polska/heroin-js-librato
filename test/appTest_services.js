const test = require('tape')

const existingAlertsConfig = [ {
  name: 'myapp.test.alert1',
  id: 123
} ]
const existingServicesConfig = [ {
  id: 567,
  type: 'campfire',
  settings: {
    room: 'Ops',
    token: '1234',
    subdomain: 'acme'
  },
  title: 'Camfire notification'
} ]
const newServicesConfig = [ {
  type: 'slack',
  settings: {url: 'https://hooks.slack.com/services/xyz'},
  title: 'Slack notification'
} ]
const newAlertsConfig1 = [ {
  name: 'myapp.test.alert1',
  id: 123,
  services: newServicesConfig
} ]
const newAlertsConfig2 = [ {
  name: 'myapp.test.alert1',
  id: 123,
  services: existingServicesConfig
} ]

function app (librato) {
  return require('../lib/app')(librato)
}

test('should create a corresponding notification service when it does not exist', (t) => {
  t.plan(2)

  var fakeLibratoClient = require('./fakeLibratoClient')(existingAlertsConfig, existingServicesConfig)
  fakeLibratoClient.createServices = function (config) {
    t.ok(config, 'create services invoked')
    return []
  }
  fakeLibratoClient.updateServices = function (config) {
    t.deepEqual(config, [])
    return []
  }

  app(fakeLibratoClient).createOrUpdate(newAlertsConfig1).catch(t.fail)
})

test('should update a corresponding notification service when it does exist', (t) => {
  t.plan(2)

  var fakeLibratoClient = require('./fakeLibratoClient')(existingAlertsConfig, existingServicesConfig)

  fakeLibratoClient.createServices = function (config) {
    t.deepEqual(config, [])
    return []
  }
  fakeLibratoClient.updateServices = function (config) {
    t.ok(config, 'update services invoked')
    return []
  }

  app(fakeLibratoClient).createOrUpdate(newAlertsConfig2).catch(t.fail)
})
