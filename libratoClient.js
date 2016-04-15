const request = require('good-guy-http')({cache: false})

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
  const changeEndpoint = `https://${username}:${password}@metrics-api.librato.com/v1/alerts`

  function createAlerts(created) {
    return created
      .map(toCreateRequestOptions.bind({}, changeEndpoint))
      .map((options) => request(options))
  }

  function updateAlerts(updated) {
    return updated
      .map(toUpdateRequestOptions.bind({}, changeEndpoint))
      .map((options) => request(options))
  }

  function deleteAlerts(updated) {
    return updated
      .map(toDeleteRequestOptions.bind({}, changeEndpoint))
      .map((options) => request(options))
  }

  function retrieveAll() {
    const retrieveEndpoint = `https://${username}:${password}@metrics-api.librato.com/v1/alerts?version=2`
    return request(retrieveEndpoint).then((result) => {
      return JSON.parse(result.body).alerts
    })
  }

  function deleteAll() {
    return retrieveAll().
      then((alerts) => {
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


  return {
    createAlerts, updateAlerts, deleteAlerts, retrieveAll, deleteAll
  }
}
