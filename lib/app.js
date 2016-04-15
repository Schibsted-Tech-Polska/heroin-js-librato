const diff = require('./diff')
const filterObject = require('./filterObject')

module.exports = function (librato) {
  return {
    createOrUpdate (config) {
      return this.fetchAllAlerts().then((existingAlerts) => {
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
    fetchAllAlerts () {
      return librato.fetchAllAlerts().then((result) => {
        return JSON.parse(result.body).alerts
      })
    },
    export () {
      return this.fetchAllAlerts()
        .then((result) => filterObject(result, ['id', 'created_at', 'updated_at']))
        .then((result) => JSON.stringify({alerts: result}, null, 2))
    },
    deleteAllAlerts () {
      return this.fetchAllAlerts()
        .then((alerts) => Promise.all(librato.deleteAlerts(alerts)))
    }
  }
}
