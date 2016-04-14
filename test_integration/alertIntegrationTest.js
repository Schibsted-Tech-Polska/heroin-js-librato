const test = require('tape')
const configurator = require('../index')(process.env.USERNAME, process.env.PASSWORD)

function alertConfig (name, threshold) {
  return {
    'name': name,
    'version': 2,
    'rearm_seconds': 120,
    'conditions': [{
      'type': 'above',
      'metric_name': 'router.status.5xx',
      'threshold': threshold || 1000,
      'duration': 2000
    }]
  }
}

test('should delete all alerts', (t) => {
  t.plan(1)

  configurator.deleteAll()
    .then((results) => {
      return configurator.retrieveAll()
    })
    .then((result) => {
      t.equal(result.length, 0)
    })
    .catch((err) => {
      console.error(err)
      throw err
    })
})

test('should create a new alert', (t) => {
  t.plan(1)

  configurator.createOrUpdate({
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
  }).then((result) => t.equal(result, 'modified 1 alerts'))
    .catch((err) => {
      console.error(err)
      t.fail(err)
    })
})

test('should batch create alerts', (t) => {
  t.plan(1)

  configurator.createOrUpdate({
    alerts: [
      alertConfig('myapp.test.alert1'),
      alertConfig('myapp.test.alert2')
    ]
  }).then((result) => t.equal(result, 'modified 3 alerts'))
    .catch((err) => {
      console.error(err)
      t.fail(err)
    })
})

/*
 test('should batch update alerts', (t) => {
 t.plan(1)

 configurator.createOrUpdate({
 alerts: [
 alertConfig('myapp.test.alert3'),
 alertConfig('myapp.test.alert4'),
 alertConfig('myapp.test.alert5'),
 ]
 }).then(() => configurator.createOrUpdate({
 alerts: [
 alertConfig('myapp.test.alert3', 2000),
 alertConfig('myapp.test.alert4')
 ]
 })).then((result) => t.equal(result, 'updated 1 alerts'))
 .catch((err) => {
 console.error(err)
 t.fail(err)
 })
 })
 */

test('should export all alerts', (t) => {
  t.plan(1)

  configurator.retrieveAll().then((result) => {
    // console.log(result)
    t.ok(result, 'list of alerts not empty')
  })
})
