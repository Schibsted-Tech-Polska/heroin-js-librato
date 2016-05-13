function toCreateRequestOptions (url, body) {
  return {
    url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }
}

function toUpdateRequestOptions (url, body) {
  return {
    url: `${url}/${body.id}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }
}

function toDeleteRequestOptions (url, body) {
  return {
    url: `${url}/${body.id}`,
    method: 'DELETE'
  }
}

module.exports = function (username, token, httpClient) {
  const changeAlertsEndpoint = `https://${username}:${token}@metrics-api.librato.com/v1/alerts`
  const retrieveAlertsEndpoint = `https://${username}:${token}@metrics-api.librato.com/v1/alerts?version=2`
  const servicesEndpoint = `https://${username}:${token}@metrics-api.librato.com/v1/services`

  function createAlerts (alerts) {
    return alerts
      .map(toCreateRequestOptions.bind({}, changeAlertsEndpoint))
      .map((options) => httpClient(options))
  }

  function updateAlerts (alerts) {
    return alerts
      .map(toUpdateRequestOptions.bind({}, changeAlertsEndpoint))
      .map((options) => httpClient(options))
  }

  function deleteAlerts (alerts) {
    return alerts
      .map(toDeleteRequestOptions.bind({}, changeAlertsEndpoint))
      .map((options) => httpClient(options))
  }

  function fetchAllAlerts () {
    return httpClient(retrieveAlertsEndpoint)
  }

  function createServices (services) {
    return services
      .map(toCreateRequestOptions.bind({}, servicesEndpoint))
      .map((options) => httpClient(options))
  }

  function updateServices (services) {
    return services
      .map(toUpdateRequestOptions.bind({}, servicesEndpoint))
      .map((options) => httpClient(options))
  }

  function deleteServices (services) {
    return services
      .map(toDeleteRequestOptions.bind({}, servicesEndpoint))
      .map((options) => httpClient(options))
  }

  function fetchAllServices () {
    return httpClient(servicesEndpoint)
  }

  return {
    createAlerts, updateAlerts, deleteAlerts, fetchAllAlerts,
    createServices, updateServices, deleteServices, fetchAllServices
  }
}
