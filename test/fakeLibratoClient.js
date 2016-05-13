function librato (alertsConfig, servicesConfig) {
  const api = {
    fetchAllAlerts () {
      return Promise.resolve({body: JSON.stringify({alerts: alertsConfig})})
    },
    createAlerts (alerts) {
      return alerts.map((alert) => Promise.resolve())
    },
    updateAlerts (alerts) {
      return alerts.map((alert) => Promise.resolve())
    },
    deleteAlerts (alerts) {
      return []
    },
    fetchAllServices () {
      return Promise.resolve({body: JSON.stringify({services: servicesConfig})})
    },
    createServices (config) {
      return []
    },
    updateServices (config) {
      return []
    }
  }

  return api
}

module.exports = librato
