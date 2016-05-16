const diff = require('./diff')
const filterObject = require('./filterObject')
const _ = require('lodash')

function normalize (alerts) {
  return alerts.map((alert) => {
    if (alert.services) {
      alert.services = alert.services.map((service) => {
        return service.id
      })
    }
    return alert
  })
}

module.exports = function (librato) {
  var api = {
    createOrUpdate (config) {
      if (!config) {
        return Promise.resolve('modified 0 alerts')
      }
      return this.fetchAllServices()
        .then((existingServices) => {
          config = _.cloneDeep(config)
          const allServices = _.flatten(config.map((alertConfig) => {
            return alertConfig.services || []
          }))
          const result = diff(existingServices, allServices, (a, b) => {
            return a.title === b.title && a.type === b.type
          })
          const created = result.created
          const updated = result.updated
          const deleted = result.deleted

          var serviceActions = librato.createServices(created).concat(librato.updateServices(updated), librato.deleteServices(deleted))
          return Promise.all(serviceActions)
        })
        .then((results) => {
          return this.fetchAllAlerts()
        })
        .then((existingAlerts) => {
          const result = diff(existingAlerts, config)
          const created = normalize(result.created)
          const updated = normalize(result.updated)
          const deleted = result.deleted

          var alertActions = librato.createAlerts(created).concat(librato.updateAlerts(updated), librato.deleteAlerts(deleted))

          return Promise.all(alertActions)
        })
        .then((result) => {
          return `modified ${result.length} alerts`
        })
        .catch((err) => {
          return Promise.reject(err)
        }
      )
    },
    fetchAllAlerts () {
      return librato.fetchAllAlerts().then((result) => {
        return JSON.parse(result.body).alerts
      })
    },
    fetchAllServices () {
      return librato.fetchAllServices().then((result) => {
        return JSON.parse(result.body).services
      })
    },
    export () {
      return this.fetchAllAlerts()
        .then((result) => filterObject(result, [ 'id', 'created_at', 'updated_at' ]))
    },
    deleteAllAlerts () {
      return this.fetchAllAlerts()
        .then((alerts) => Promise.all(librato.deleteAlerts(alerts)))
    }
  }

  return api
}
