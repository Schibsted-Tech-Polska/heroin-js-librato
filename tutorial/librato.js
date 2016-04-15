const libratoConfigurator = require('../index')(process.env.USERNAME, process.env.PASSWORD);

libratoConfigurator.fetchAllAlerts().then((result) => console.log(JSON.stringify(result, null, 2)))
