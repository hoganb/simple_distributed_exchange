// Init orderbook

// Each client has its own instance of the orderbook.
// The orderbook contains a list of orders (buy and sell).

// Each order would have the following fields:
//  - id: Unique identifier
//  - clientId: Unique identifier of who placed the order
//  - date: Unix timestamp when the order took place
//  - type: Buy or sell
//  - amount: amount of cryptocurrency being bought / sold
//  - Price: price per unit of cryptocurrency

let orderbook = []

const submitOrder = (order) => {
    // TODO: Orderbook business logic for matching and executing orders
    orderbook.push(order);
}

const distributeOrder = (order, client) => {
    client.request('submit_order', order, { timeout: 10000 }, (err, data) => {
        if (err) {
            console.error(err)
        } else {
            console.log(data)
        }
    })
}

const getOrderbook = () => {
    return orderbook
}

const setOrderbook = (value) => {
    orderbook = value;
}

module.exports = { submitOrder, distributeOrder, getOrderbook, setOrderbook }