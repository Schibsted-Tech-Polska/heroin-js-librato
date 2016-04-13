const request = require('good-guy-http')({cache: false})

module.exports = function (username, password) {
  return {
    create (config) {
      const url = `https://${username}:${password}@metrics-api.librato.com/v1/alerts`
      return request({
        url,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config.alerts[0])
      })
        .then(() => Promise.resolve('created'), (err) => Promise.reject(err))
    },
    retrieveAll () {
      const url = `https://${username}:${password}@metrics-api.librato.com/v1/alerts?version=2`
      return request(url).then((result) => {
        return JSON.parse(result.body).alerts
      })
    },
    deleteAll () {
      return this.retrieveAll().then((alerts) => {
        const alertIds = alerts.map((alert) => alert.id)
        const deleteRequests = alertIds
          .map((id) => `https://${username}:${password}@metrics-api.librato.com/v1/alerts/${id}`)
          .map((url) => {
            return request({
              url,
              method: 'DELETE'
            })
          })
        return Promise.all(deleteRequests)
      })
    }
  }
}
