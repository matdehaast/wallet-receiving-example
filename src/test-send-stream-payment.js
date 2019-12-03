const BtpPlugin = require('ilp-plugin-btp')
const SPSP = require('ilp-protocol-spsp')
const ILDCP = require('ilp-protocol-ildcp')

const AMOUNT_TO_SEND = 100

async function sendPayment() {

    const plugin = new BtpPlugin({
        server: 'btp+ws://:randomsecret@localhost:9000'
    })
    await plugin.connect()

    const details = await ILDCP.fetch(plugin.sendData.bind(plugin))

    console.log(`Sending ${(AMOUNT_TO_SEND)*Math.pow(10, -details.assetScale).toFixed(2)} ${details.assetCode}`)
    const sentAmount = await SPSP.pay(plugin, {
        pointer: 'http://localhost:3000/alice',
        sourceAmount: AMOUNT_TO_SEND,
        streamOpts: { timeout: 10000 }
    })

    console.log(`Sent ${(sentAmount.totalSent)*Math.pow(10, -details.assetScale).toFixed(2)} ${details.assetCode}`)
}

sendPayment().catch(error => {
    console.log('error', error)
})
