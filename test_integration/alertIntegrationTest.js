const test = require('tape')
const configurator = require('../index')(process.env.USERNAME, process.env.PASSWORD)

test('should create a new alert', (t) => {
  t.plan(1)

  configurator({
    alerts: [{
      'name': 'myapp.status5xx.high',
      'rearm_seconds': 108000,
      'conditions': [{
        'type': 'above',
        'metric_name': 'router.status.5xx',
        'summary_function': 'sum',
        'threshold': 40,
        'duration': 600
      }],
      'version': 2
    }]
  }).then((result) => t.equal(result, 'created'))
})
