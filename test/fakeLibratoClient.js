'use strict'
var _ = require('lodash')

function empty (array) {
  return array.map(() => Promise.resolve())
}

function librato (alerts, services) {
  let alertsConfig = _.cloneDeep(alerts)
  let servicesConfig = _.cloneDeep(services)

  const api = {
    fetchAllAlerts () {
      return Promise.resolve({body: JSON.stringify({alerts: alertsConfig})})
    },
    createAlerts (alerts) {
      return empty(alerts)
    },
    updateAlerts (alerts) {
      return empty(alerts)
    },
    deleteAlerts (alerts) {
      return empty(alerts)
    },
    fetchAllServices () {
      return Promise.resolve({body: JSON.stringify({services: servicesConfig})})
    },
    createServices (services) {
      let startId = 1000
      return services.map((service) => {
        service.id = startId
        startId++
        return Promise.resolve(service)
      })
    },
    updateServices (services) {
      return empty(services)
    },
    deleteServices (services) {
      return empty(services)
    }
  }

  return api
}

module.exports = librato
