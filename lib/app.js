const diff = require('./diff')
const filterObject = require('./filterObject')
const _ = require('lodash')

module.exports = function (librato) {
  function configureServices(config, existingServices) {
    const allServices = _.flatten(config.map((alertConfig) => {
      return alertConfig.services || []
    }))
    const result = diff(existingServices, allServices, servicesComparator)
    const created = result.created
    const updated = result.updated
    const deleted = result.deleted

    var serviceActions = _.concat(librato.createServices(created), librato.updateServices(updated), librato.deleteServices(deleted))

    return Promise.all(serviceActions)
  }

  function configureAlerts(config, existingAlerts) {
    const result = diff(existingAlerts, config)
    const created = normalize(result.created)
    const updated = normalize(result.updated)
    const deleted = result.deleted

    var alertActions = _.concat(librato.createAlerts(created), librato.updateAlerts(updated), librato.deleteAlerts(deleted))

    return Promise.all(alertActions)
  }

  return {
    createOrUpdate (config) {
      if (!config) {
        return Promise.resolve('modified 0 alerts')
      }
      config = _.cloneDeep(config)

      return this.fetchAllServices()
        .then(_.partial(configureServices, config))
        .then((services) => {
          config = withServiceIds(config, services)
          return this.fetchAllAlerts()
        })
        .then(_.partial(configureAlerts, config))
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
}

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

function withServiceIds (alerts, services) {
  services = services.filter((item) => item && item.body).map((item) => {
    return JSON.parse(item.body)
  })
  alerts.forEach((alert) => {
    if (alert.services) {
      alert.services.forEach((service) => {
        if (!service.id) {
          service.id = _.find(services, _.partial(servicesComparator, service)).id
        }
      })
    }
  })
  return alerts
}

function servicesComparator(a, b) {
  return a.title === b.title && a.type === b.type
}
