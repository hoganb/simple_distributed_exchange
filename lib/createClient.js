const { PeerRPCClient }  = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')

/**
 * Creates an RPC client to a given `grape` in a Grenache network
 * @param {string} grape - The host:ip config
 * @returns The peer RPC client
 */
const createClient = (grape) => {
    const link = new Link({ grape })
    link.start()
      
    const peer = new PeerRPCClient(link, {})
    peer.init()

    return peer
}

module.exports = createClient
  