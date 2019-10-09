const BtpPlugin = require('ilp-plugin-btp')
const SPSP = require('ilp-protocol-spsp')

async function sendPayment() {

    const plugin = new BtpPlugin({
        server: 'btp+ws://:randomsecret@localhost:9000'
    })
    await plugin.connect()

    const sentAmount = await SPSP.pay(plugin, {
        pointer: 'http://localhost:3000/alice',
        sourceAmount: 1000,
        streamOpts: { timeout: 10000 }
    })

    console.log(`Sent ${sentAmount.totalSent}`)
}

sendPayment().catch(error => {
    console.log('error', error)
})
