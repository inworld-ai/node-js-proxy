const ClientService = require('../services/client')

async function clientLoader(service: any) {

  const clientService = new ClientService({ service });

  service.services.client = clientService;

  console.log('✔️ Client Service loaded');

  return clientService;

}

export default clientLoader;
