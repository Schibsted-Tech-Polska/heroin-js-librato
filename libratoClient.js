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

module.exports = function (username, password, httpClient) {

  const changeEndpoint = `https://${username}:${password}@metrics-api.librato.com/v1/alerts`
  const retrieveEndpoint = `https://${username}:${password}@metrics-api.librato.com/v1/alerts?version=2`

  function alertEndpoint(id) {
    return `https://${username}:${password}@metrics-api.librato.com/v1/alerts/${id}`
  }

  function createAlerts(created) {
    return created
      .map(toCreateRequestOptions.bind({}, changeEndpoint))
      .map((options) => httpClient(options))
  }

  function updateAlerts(updated) {
    return updated
      .map(toUpdateRequestOptions.bind({}, changeEndpoint))
      .map((options) => httpClient(options))
  }

  function deleteAlerts(updated) {
    return updated
      .map(toDeleteRequestOptions.bind({}, changeEndpoint))
      .map((options) => httpClient(options))
  }

  function fetchAllAlerts() {
    return httpClient(retrieveEndpoint)
  }

  return {
    createAlerts, updateAlerts, deleteAlerts, fetchAllAlerts
  }
}
