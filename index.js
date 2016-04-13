const request = require('good-guy-http')()

module.exports = function (username, password) {
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
}
