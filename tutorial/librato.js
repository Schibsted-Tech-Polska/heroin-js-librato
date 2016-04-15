const libratoConfigurator = require('../index')(process.env.USERNAME, process.env.PASSWORD);

//libratoConfigurator.export().then((result) => console.log(result))

//libratoConfigurator.deleteAllAlerts().then((result) => console.log(result));

libratoConfigurator.createOrUpdate({
  "alerts": [
    {
      "name": "myapp.test.alert4",
      "description": null,
      "conditions": [
        {
          "type": "above",
          "metric_name": "router.status.5xx",
          "source": null,
          "threshold": 1000,
          "duration": 2000
        }
      ],
      "services": [],
      "attributes": null,
      "active": true,
      "version": 2,
      "rearm_seconds": 120,
      "rearm_per_signal": false
    },
    {
      "name": "myapp.test.alert3",
      "description": null,
      "conditions": [
        {
          "type": "above",
          "metric_name": "router.status.5xx",
          "source": null,
          "threshold": 2000,
          "duration": 2000
        }
      ],
      "services": [],
      "attributes": {},
      "active": true,
      "version": 2,
      "rearm_seconds": 120,
      "rearm_per_signal": false
    }
  ]
})
  .then((result) => console.log(result))
  .catch((err) => console.error(err));
