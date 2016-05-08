const app = require('./lib/app')
const request = require('good-guy-http')({cache: false})

function client (username, token) {
  const librato = require('./lib/libratoClient')(username, token, request)
  return app(librato)
}

var plugin = {
  librato: {
    alerts: {
      configure: function (config, configVars) {
        var librato = client(configVars.LIBRATO_USER, configVars.LIBRATO_TOKEN)
        return librato.createOrUpdate(config)
      },
      export: function (configVars) {
        var librato = client(configVars.LIBRATO_USER, configVars.LIBRATO_TOKEN)
        return librato.export()
      }
    }
  }
}

exports.client = client
exports.plugin = plugin
