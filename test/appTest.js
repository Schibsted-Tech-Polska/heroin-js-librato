const test = require('tape')
const alertsConfig = [ {
  name: 'myapp.test.alert',
  services: [ {
    type: 'slack',
    settings: {url: 'https://hooks.slack.com/services/xyz'},
    title: 'Slack notification'
  } ]
} ]
const librato = {
  fetchAllAlerts () {
    return Promise.resolve({body: JSON.stringify({alerts: alertsConfig})})
  },
  createAlerts () {
    return []
  },
  updateAlerts () {
    return []
  },
  deleteAlerts () {
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
