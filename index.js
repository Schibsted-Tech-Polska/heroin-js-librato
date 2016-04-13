const request = require('good-guy-http')()

module.exports = function (username, password) {
  return {
    create (username, password) {
      return (config) => {
        const url = `https://${username}:${password}@metrics-api.librato.com/v1/alerts`
        return request({
          url: url,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(config.alerts[0])
        })
          .then(() => Promise.resolve('created'), (err) => Promise.reject(err))
      }
    },
    export () {
      const url = `https://${username}:${password}@metrics-api.librato.com/v1/alerts?version=2`
      return request(url).then((result) => JSON.parse(result.body).alerts)
    }
  }
}
