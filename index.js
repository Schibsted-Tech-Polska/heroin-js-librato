const request = require('good-guy-http')({cache: false})
const diff = require('./diff')

function toCreateRequestOptions(url, body) {
  return {
    url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }
}

function toUpdateRequestOptions(url, body) {
  return {
    url: `${url}/${body.id}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }
}

function toDeleteRequestOptions(url, body) {
  return {
    url: `${url}/${body.id}`,
    method: 'DELETE'
  }
}

module.exports = function (username, password) {
  const url = `https://${username}:${password}@metrics-api.librato.com/v1/alerts`

  function createAlerts(created) {
    return created
      .map(toCreateRequestOptions.bind({}, url))
      .map((options) => request(options))
  }

  function updateAlerts(updated) {
    return updated
      .map(toUpdateRequestOptions.bind({}, url))
      .map((options) => request(options))
  }

  function deleteAlerts(updated) {
    return updated
      .map(toDeleteRequestOptions.bind({}, url))
      .map((options) => request(options))
  }

  return {
    createOrUpdate (config) {
      return this.retrieveAll().then((existingAlerts) => {
        const result = diff(existingAlerts, config.alerts)
        const created = result.created
        const updated = result.updated
        const deleted = result.deleted

        var actions = createAlerts(created).concat(updateAlerts(updated), deleteAlerts(deleted));

        return Promise.all(actions)
          .then(
          (result) => {
            return Promise.resolve(`modified ${result.length} alerts`)
          },
          (err) => {
            return Promise.reject(err)
          }
        )
      })
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
