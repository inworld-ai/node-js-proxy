const clientLoader = require('./client')

async function initLoaders( service: any ) {

  await clientLoader({ service })

}

export default initLoaders
