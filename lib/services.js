'use strict'
var _ = require('lodash')
// var diff = require('./diff')

module.exports = function (librato) {
  return {
    resolveIds (servicesConfig) {
      return librato.retrieveAllServices().then((existingServicesConfig) => {
        let existingServices = existingServicesConfig.services
        // let existingServicesWithoutIds = existingServices.map((service) => _.omit(service, 'id'))
        // diff(existingServicesWithoutIds, servicesConfig)

        return servicesConfig.map((service) => {
          var existingService = _.find(existingServices, (item) => {
            return item.type === service.type && item.title === service.title
          })
          return existingService.id
        })
      })
    }
  }
}
