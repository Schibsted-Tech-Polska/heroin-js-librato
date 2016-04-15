const app = require('./lib/app')
const request = require('good-guy-http')({cache: false})

module.exports = function (username, password) {
  const librato = require('./lib/libratoClient')(username, password, request)
  return app(librato)
}
