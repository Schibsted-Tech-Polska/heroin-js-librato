const app = require('./app')
const request = require('good-guy-http')({cache: false})

module.exports = function(username, password) {
  const librato = require('./libratoClient')(username, password, request)
  return app(librato)
}
