const test = require('tape')

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
const existingAlertsConfig = [ {
  name: 'myapp.test.alert1',
  id: 123,
  services: existingServicesConfig
} ]
const newServicesConfig = [ {
  type: 'slack',
  settings: {url: 'https://hooks.slack.com/services/xyz'},
  title: 'Slack notification'
} ]
const updatedServicesConfig = [ {
  type: 'campfire',
  settings: {
    room: 'Ops',
    token: '1234',
    subdomain: 'acme1'
  },
  title: 'Camfire notification'
} ]
const newAlertsConfig1 = [ {
  name: 'myapp.test.alert1',
  id: 123,
  services: newServicesConfig
} ]
const newAlertsConfig2 = [ {
  name: 'myapp.test.alert1',
  id: 123,
  services: updatedServicesConfig
} ]

function app (librato) {
  return require('../lib/app')(librato)
}

test('should create a corresponding notification service when it does not exist', (t) => {
  t.plan(2)

  var fakeLibratoClient = require('./fakeLibratoClient')(existingAlertsConfig, existingServicesConfig)
  fakeLibratoClient.createServices = function (config) {
    t.equal(config.length, 1)
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
    t.equal(config.length, 1)
    return []
  }

  app(fakeLibratoClient).createOrUpdate(newAlertsConfig2).catch(t.fail)
})

test('should delete a notification service that is detached', (t) => {
  t.plan(1)

  var fakeLibratoClient = require('./fakeLibratoClient')(existingAlertsConfig, existingServicesConfig)

  fakeLibratoClient.deleteServices = function (config) {
    t.equal(config.length, 1)
  }

  app(fakeLibratoClient).createOrUpdate(newAlertsConfig1).catch(t.fail)
})
