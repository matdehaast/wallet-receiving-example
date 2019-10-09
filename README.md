
This repo is a quick introduction for digital wallets looking to enabled their users to receive
ILP payments through Interledger


It consists of the following:
* Quickstart ILP Connector (`src/connector.js`)
* SPSP and STREAM Server for receiving the payments (`src/spsp-stream.js`)
* Test Payment Script (`src/test-send-stream-payment.js`)

### Connector
The connector is your gateway to the Interledger network through either an uplink provider (ie Strata) or direct peering relationship 
with business entities on the network (ie Coil) and your internal ILP infrastructure.

The provided connector configuration provides you with three accounts:
* Uplink
* SPSP+Stream - Account for your spsp and STREAM server to connect to
* temp - Temp account that is used to connect to to test sending payments.

### SPSP + Stream
SPSP and Stream work in conjunction to allow you to receive ILP payments on behalf of your users. SPSP hosts your Payment Pointers
and STREAM deals with accepting incoming money.

Wallets are expected to add business logic within the component to deal with crediting the correct users wallet with
incoming payments. Places where business logic is expected is marked with `TODO`

### Test Payment Script
The test script is designed to be a quick an easy way to test payments to ensure your business logic is correct.


## Run

In different terminals run in this order
1. `node src/connector.js`
2. `node src/spsp-stream.js`


You will now have a basic infrastructure running. You can test if it is working by running
1. `node src/test-send-stream-payment.js`

You should see a successful payment go through 



