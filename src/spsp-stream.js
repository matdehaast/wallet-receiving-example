const BtpPlugin = require('ilp-plugin-btp')
const { Server } = require('ilp-protocol-stream')
const Koa = require('koa')
const crypto = require('crypto')
const createLogger = require('pino')

const logger = createLogger()

async function startServer () {

  const plugin = new BtpPlugin({
    server: 'btp+ws://:shh_its_a_secret@localhost:7769'
  })

  logger.info(`Connecting to connector..`)
  await plugin.connect()
  logger.info(`Connected to Connector`)

  const streamServer = new Server({
    plugin: plugin,
    serverSecret: crypto.randomBytes(32)
  })

  streamServer.on('connection', (connection) => {

    // Determine who this connection belongs to by correlating with connectionTag
    const connectionTag = connection.connectionTag

    // TODO get User/Account for the connectionTag
    // const account = mapService.getAccountIdFromConnectionTag(connectionTag)
    logger.info('Got connection for connectioTag ' + connectionTag)

    connection.on('stream', (stream) => {

      //Set how much you want to allow for this STREAM.
      stream.setReceiveMax(10000000000000)

      stream.on('money', amount => {
        logger.info('Received packet for amount ' + amount)

        // TODO Add business logic to credit users account for the amount received
        // accountsService.credit(account, amount)
      })

    })
  })

  await streamServer.listen()
  logger.info('STREAM receiver listening..')

  async function handleSPSP (ctx, next) {
    if (ctx.get('Accept').indexOf('application/spsp4+json') !== -1) {

      //Determine the payment pointer used and find the account its correlated with
      const url = ctx.url
      // const accountId = extractAccountIdFromPaymentPointerUrl(url)

      //Assign a connectionTag
      const connectionTag = 'randomUUID'

      // TODO map the Payment Pointer/User/Account to the connectionTag
      // mapService.correlate(accountId, connectionTag)

      const details = streamServer.generateAddressAndSecret(connectionTag)

      ctx.body = {
        destination_account: details.destinationAccount,
        shared_secret: details.sharedSecret.toString('base64')
      }
      ctx.set('Content-Type', 'application/spsp4+json')
      ctx.set('Access-Control-Allow-Origin', '*')
    } else {
      ctx.res.statusCode = 200
    }
  }

  const httpServer = new Koa()
  httpServer
    .use(handleSPSP)
    .listen(3000)
  logger.info(`SPSP server listening on port 3000..`)
}


startServer().catch(error => {
  logger.error('Error with server', {error})
})
