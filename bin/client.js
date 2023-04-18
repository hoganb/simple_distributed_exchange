// Clients can submit orders to their own instance of orderbook, and the order is distributed to other instances, too
// by sending a request to the `submit_order` worker with the order payload

// Clients can subscribe to the `orderbook_updated` event and get the updated orderbook from DHT using `link.get` with the supplied DHT `hash` value

'use strict'

const orderbook = require('../lib/orderbook')
const createClient = require('../lib/createClient')
const client = createClient('http://127.0.0.1:30001')

setTimeout(() => {
  // New order
  const order = {
    id: `${Date.now()}`,
    clientId: 'clientA',
    type: 'Buy', // Buy / Sell
    amount: 5, // amount of cryptocurrency being bought / sold
    price: 2, // price per unit of cryptocurrency
    date: Date.now(), // unix milliseconds
  };

  // Clients submit orders to their own instance of orderbook
  orderbook.submitOrder(order)

  // The order is distributed to other instances
  orderbook.distributeOrder(order, client)
}, 2000)

const createServer = require('../lib/createServer')
const { link, service } = createServer(
    'http://127.0.0.1:30001', // grape
    1024 + Math.floor(Math.random() * 1000), // port
)

setInterval(function () {
  link.announce('orderbook_updated', service.port, {})
}, 1000)

service.on('request', (rid, key, payload, handler) => {
  console.log(rid, key, payload)
  handler.reply(null, { msg: `Message received. Response from port: ${service.port}` })

  // Get orderbook from DHT by hash
  link.get(payload, (err, res) => {
    console.log('data requested to the DHT', err, res)
    if (res) {
      const updatedOrderbook = JSON.parse(res.v);
      console.log(updatedOrderbook)
      orderbook.setOrderbook(updatedOrderbook)
    }
  })
})