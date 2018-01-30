const http = require('http')
const ws_lib = require('ws')

const Swarm = require('swarm')
Swarm.env.trace = true
Swarm.env.debug = true
Swarm.env.error = console.error
Swarm.env.warning = console.error

const loadModels = require('../common/loadModels')
const models = [require('../common/models/pin')]
loadModels(models)

// use file storage
const fileStorage = new Swarm.FileStorage('storage')

// create the server-side Swarm Host
const swarmHost = Swarm.env.localhost = new Swarm.Host('swarm~central', 0, fileStorage)

// create and start the HTTP server
const httpServer = http.createServer()
httpServer.listen(8001, function (err) {
  if (err) return console.warn('Can\'t start server. Error: ', err, err.stack)
  console.log('Swarm server started at port 8001')
})

// start WebSocket server
const wsServer = new ws_lib.Server({ server: httpServer })

// accept incoming WebSockets connections
wsServer.on('connection', function (ws) {
  console.log('new incoming WebSocket connection')
  swarmHost.accept(new Swarm.EinarosWSStream(ws), {delay: 50})
})
