const util = require('util')
const libratoConfigurator = require('../index').client(process.env.USERNAME, process.env.PASSWORD)

libratoConfigurator.export().then((result) => console.log(util.inspect(result, { depth: 5 })))

// libratoConfigurator.deleteAllAlerts().then((result) => console.log(result))
libratoConfigurator.createOrUpdate(
  [
    {
      'name': 'myapp.test.alert4',
      'description': null,
      'conditions': [
        {
          'type': 'above',
          'metric_name': 'router.status.5xx',
          'source': null,
          'threshold': 1000,
          'duration': 2000
        }
      ],
      services: [{
        type: 'slack',
        settings: {url: 'https://hooks.slack.com/services/xyz'},
        title: 'Slack notification'
      }],
      'active': true,
      'version': 2,
      'rearm_seconds': 120,
      'rearm_per_signal': false
    },
    {
      'name': 'myapp.test.alert3',
      'description': null,
      'conditions': [
        {
          'type': 'above',
          'metric_name': 'router.status.5xx',
          'source': null,
          'threshold': 2000,
          'duration': 2000
        }
      ],
      'services': [],
      'active': true,
      'version': 2,
      'rearm_seconds': 120,
      'rearm_per_signal': false
    }
  ]
)
  .then((result) => console.log(result))
  .catch((err) => console.error(err))
