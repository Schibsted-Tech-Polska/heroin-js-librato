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

const updatedAlertsConfig = [
  {
    name: 'myapp.test.alert1',
    id: 123,
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

function app () {
  return require('../lib/app')(require('./fakeLibratoClient')(alertsConfig, servicesConfig))
}

test('should ignore alert update when no changes', (t) => {
  t.plan(1)

  app().createOrUpdate(alertsConfig).then(function (message) {
    t.equal(message, 'modified 0 alerts')
  }).catch(t.fail)
})

test('should trigger 2 modifications when one alerts created and one updated', (t) => {
  t.plan(1)

  app().createOrUpdate(updatedAlertsConfig).then(function (message) {
    t.equal(message, 'modified 2 alerts')
  }).catch(t.fail)
})

test('should filter out internal fields when exporting existing alerts', (t) => {
  t.plan(2)

  app().export().then(function (exported) {
    t.equal(exported[ 0 ].name, 'myapp.test.alert1')
    t.equal(exported[ 0 ].id, undefined)
  })
})

