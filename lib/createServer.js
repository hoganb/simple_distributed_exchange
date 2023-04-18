const { PeerRPCServer }  = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')

/**
 * Creates an RPC server on `port` to a given `grape` in a Grenache network
 * @param {string} grape - The host:ip config
 * @param {number} port - The port number
 * @returns The link and peer RPC server
 */
const createServer = (grape, port) => {
  const link = new Link({ grape })
  link.start()
  
  const peer = new PeerRPCServer(link, {
    timeout: 300000
  })
  peer.init()
  
  const service = peer.transport('server')
  service.listen(port)
  console.log('server created and listening on port', port)

  return { link, service }
}

module.exports = createServer
  