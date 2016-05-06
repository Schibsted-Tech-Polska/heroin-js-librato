const app = require('./lib/app')
const request = require('good-guy-http')({cache: false})

function client(username, password) {
  const librato = require('./lib/libratoClient')(username, password, request)
  return app(librato)
}

var plugin = {
  librato: {
    alerts: {
      configure: function (config, configVars) {
        var librato = client(configVars.LIBRATO_TOKEN, configVars.LIBRATO_PASSWORD)
        return librato.createOrUpdate(config)
      },
      export: function (configVars) {
        var librato = client(configVars.LIBRATO_TOKEN, configVars.LIBRATO_PASSWORD)
        return librato.export()
      }
    }
  }
}

exports.client = client
exports.plugin = plugin
