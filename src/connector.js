const Connector = require('ilp-connector')

const connector = Connector.createApp({
  spread: 0,
  backend: 'one-to-one',
  initialConnectTimeout: 60000,
  adminApi: true,
  adminApiPort: 7701,
  accounts: {
    uplink: {
      relation: 'parent',
      sendRoutes: false,
      receiveRoutes: false,
      plugin: 'ilp-plugin-btp',
      assetCode: 'XRP',
      assetScale: 9,
      options: {
        server: "btp+wss://GsY5wdYWgOvykG2KMlBZVQqdH57aYcAwNFVJ86PXLmU:e42e32b920f92da77f85c9e9b6837e7b@us1.rafikilabs.com/btp"
      }
    },
    spspStreamServer: {
      relation: 'child',
      sendRoutes: false,
      receiveRoutes: false,
      plugin: 'ilp-plugin-btp',
      assetCode: 'XRP',
      assetScale: 9,
      options: {
        listener: {
          port: 7769,
          secret: 'shh_its_a_secret'
        }
      }
    },
    tempLocalServer: {
      relation: 'child',
      sendRoutes: false,
      receiveRoutes: false,
      plugin: 'ilp-plugin-mini-accounts',
      assetCode: 'XRP',
      assetScale: 9,
      options: {
        port: 9000
      }
    },
  }
})

connector.listen()
  .catch(err => {
    const errInfo = (err && typeof err === 'object' && err.stack) ? err.stack : err
    console.error(errInfo)
  })
