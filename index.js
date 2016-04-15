const diff = require('./diff')
var request = require('good-guy-http')({cache: false})

module.exports = function (username, password, options) {
  const librato = require('./libratoClient')(username, password, request)

  return {
    createOrUpdate (config) {
      return this.retrieveAll().then((existingAlerts) => {
        const result = diff(existingAlerts, config.alerts)
        const created = result.created
        const updated = result.updated
        const deleted = result.deleted

        var actions = librato.createAlerts(created).concat(librato.updateAlerts(updated), librato.deleteAlerts(deleted));

        return Promise.all(actions)
          .then(
          (result) => {
            return `modified ${result.length} alerts`
          }
        ).catch((err) => {
            return Promise.reject(err)
          }
        )
      })
    },
    retrieveAll () {
      return librato.retrieveAll()
    },
    deleteAll () {
      return librato.deleteAll()
    }
  }
}
