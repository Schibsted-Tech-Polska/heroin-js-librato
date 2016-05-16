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
const existingAlertsConfigWithoutServices = [ {
  name: 'myapp.test.alert1',
  id: 123
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
const alertsWithNewServices = [ {
  name: 'myapp.test.alert1',
  id: 123,
  services: newServicesConfig
} ]
const alertsWithUpdatedServices = [ {
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
  var originalCall = fakeLibratoClient.createServices
  fakeLibratoClient.createServices = function (config) {
    t.equal(config.length, 1, 'one service created')
    return originalCall(config)
  }
  fakeLibratoClient.updateServices = function (config) {
    t.deepEqual(config, [], 'no services updated')
    return []
  }

  app(fakeLibratoClient).createOrUpdate(alertsWithNewServices).catch(t.fail)
})

test('should update a corresponding notification service when it does exist', (t) => {
  t.plan(2)

  var fakeLibratoClient = require('./fakeLibratoClient')(existingAlertsConfig, existingServicesConfig)

  fakeLibratoClient.createServices = function (config) {
    t.deepEqual(config, [], 'no services created')
    return []
  }
  fakeLibratoClient.updateServices = function (config) {
    t.equal(config.length, 1, 'one service updated')
    return []
  }

  app(fakeLibratoClient).createOrUpdate(alertsWithUpdatedServices).catch(t.fail)
})

test('should delete a notification service that is detached', (t) => {
  t.plan(1)

  var fakeLibratoClient = require('./fakeLibratoClient')(existingAlertsConfig, existingServicesConfig)

  fakeLibratoClient.deleteServices = function (config) {
    t.equal(config.length, 1)
  }

  app(fakeLibratoClient).createOrUpdate(alertsWithNewServices).catch(t.fail)
})

test('should pass service ids when updating alerts', (t) => {
  t.plan(1)

  var fakeLibratoClient = require('./fakeLibratoClient')(existingAlertsConfig, existingServicesConfig)
  fakeLibratoClient.updateAlerts = function (alerts) {
    t.deepEqual(alerts[0].services, [ 567 ])
    return alerts.map((alert) => Promise.resolve())
  }

  app(fakeLibratoClient).createOrUpdate(alertsWithUpdatedServices).catch(t.fail)
})

test('should pass service ids when updating alerts', (t) => {
  t.plan(1)

  var fakeLibratoClient = require('./fakeLibratoClient')(existingAlertsConfig, existingServicesConfig)
  fakeLibratoClient.updateAlerts = function (alerts) {
    t.deepEqual(alerts[0].services, [ 1000 ])
    return alerts.map((alert) => Promise.resolve())
  }

  app(fakeLibratoClient).createOrUpdate(alertsWithNewServices).catch(t.fail)
})

test('should pass service ids when updating alerts with no previous services', (t) => {
  t.plan(1)

  var fakeLibratoClient = require('./fakeLibratoClient')(existingAlertsConfigWithoutServices, [])
  fakeLibratoClient.updateAlerts = function (alerts) {
    t.deepEqual(alerts[0].services, [ 1000 ])
    return alerts.map((alert) => Promise.resolve())
  }

  app(fakeLibratoClient).createOrUpdate(alertsWithNewServices).catch(t.fail)
})
