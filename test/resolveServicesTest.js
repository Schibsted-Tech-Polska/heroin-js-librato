const test = require('tape')
const librato = {
  retrieveAllServices () {
    return Promise.resolve({
      'query': {
        'found': 2,
        'length': 2,
        'offset': 0,
        'total': 2
      },
      'services': [
        {
          'id': '145',
          'type': 'campfire',
          'settings': {
            'room': 'Ops',
            'token': '1234567890ABCDEF',
            'subdomain': 'acme'
          },
          'title': 'Notify Ops Room'
        },
        {
          'id': '156',
          'type': 'mail',
          'settings': {
            'addresses': 'george@example.com,fred@example.com'
          },
          'title': 'Email ops team'
        },
        {
          id: '1234',
          type: 'slack',
          settings: {url: 'https://hooks.slack.com/services/xyz'},
          title: 'Slack notification'
        }
      ]
    })
  }
}
const services = require('../lib/services')(librato)

test('should resolve services ids from config', (t) => {
  t.plan(1)

  const servicesConfig = [ {
    type: 'slack',
    settings: {url: 'https://hooks.slack.com/services/xyz'},
    title: 'Slack notification'
  } ]
  const resolvedIds = [ '1234' ]

  services.resolveIds(servicesConfig).then(function (ids) {
    t.deepEqual(ids, resolvedIds)
  })
})
