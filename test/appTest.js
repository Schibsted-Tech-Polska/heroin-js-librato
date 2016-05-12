const test = require('tape')
const alertsConfig = [ {
  name: 'myapp.test.alert1',
  services: [ {
    type: 'slack',
    settings: {url: 'https://hooks.slack.com/services/xyz'},
    title: 'Slack notification'
  } ]
} ]
const updatedAlertsConfig = [
  {
    name: 'myapp.test.alert1',
    newField: 'update trigger',
    services: [ {
      type: 'slack',
      settings: {url: 'https://hooks.slack.com/services/xyz'},
      title: 'Slack notification'
    } ]
  },
  {
    name: 'myapp.test.alert2'
  }
]
const librato = {
  fetchAllAlerts () {
    return Promise.resolve({body: JSON.stringify({alerts: alertsConfig})})
  },
  createAlerts (alerts) {
    return alerts.map((alert) => Promise.resolve())
  },
  updateAlerts (alerts) {
    return alerts.map((alert) => Promise.resolve())
  },
  deleteAlerts (alerts) {
    return []
  }

}
const app = require('../lib/app')(librato)

test('should ignore alert update when no changes', (t) => {
  t.plan(1)

  app.createOrUpdate(alertsConfig).then(function (message) {
    t.equal(message, 'modified 0 alerts')
  }).catch(t.fail)
})

test('should trigger 2 modifications when one alerts created and one updated', (t) => {
  t.plan(1)

  app.createOrUpdate(updatedAlertsConfig).then(function (message) {
    t.equal(message, 'modified 2 alerts')
  }).catch(t.fail)
})
