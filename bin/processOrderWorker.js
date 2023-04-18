// This RPC server will announce itself as `process_order`
// in our Grape Bittorrent network
// When it receives requests, it applies the business logic for new orders being submitted to the orderbook,
// when an order is matched or added to the orderbook, then the orderbook is stored in the DHT using `link.put`,
// and then the update is broadcast to all instances of the orderbook in the Grenache network by publishing to the `orderbook_updated` event
// using `PeerRPCClient.map` with the `link.put` DHT hash as the payload

'use strict'

const createServer = require('../lib/createServer')

const { link, service } = createServer(
    'http://127.0.0.1:30001', // grape
    1448, // port
)

setInterval(function () {
  link.announce('process_order', service.port, {})
}, 1000)

const orderbook = require('../lib/orderbook')
const createClient = require('../lib/createClient')
const client = createClient('http://127.0.0.1:30001')

service.on('request', (rid, key, payload, handler) => {
  console.log(rid, key, payload)

  orderbook.submitOrder(payload)

  // Store orderbook in DHT
  link.put({ v: JSON.stringify(orderbook.getOrderbook()) }, (err, hash) => {
    if (err) {
      handler.reply(err, null)
    } else {
      console.log('data saved to the DHT', err, hash)
      handler.reply(null, { msg: `Order processed. Response from port: ${service.port}` })
      // Broadcast to all instances of the orderbook in the Grenache network
      client.map('orderbook_updated', hash, { timeout: 2000 }, (err, data) => {
        if (err) {
          console.error(err)
        } else {
          console.log(data)
        }
      })
    }
  })
})