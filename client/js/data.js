const {Spec, Host} = require('swarm')

const Pin = require('../../common/models/pin')

const app = window.app = {}

// stuff to initialize hostID
const randStr = () => Spec.int2base((Math.random() * 10000) | 0)
const getHash = () => window.location.hash || '#0';
const getHostID = () => {
  const id = window.localStorage.getItem('localuser') || 'A' + randStr()
  window.localStorage.setItem('localuser', app.id)
  return id + getHash().replace('#', '~')
}

// 1. create local Host
const host = new Host(getHostID())

// 2. connect to your server
host.connect('ws://localhost:8001', {delay: 50})

// data structure
const data = app.data = {}

// getters/setters
function setModel(model, id, value) {
  data[model] || (data[model] = {})
  data[model][id] = value
}
function getModel(model, id) {
  return data[model][id]
}

// 3.b. This object is global (we supply a certain id) so we
// may need to wait for its state to arrive from the server
var ashID = 'ash'
var ash = new Pin(ashID)

// data init
setModel('pins', ashID, ash)

module.exports = data


// 4.b. ...wait for the state to arrive
ash.on('init', function () {
    // ...so we may touch it finally.
    ash.set({name: 'Ash', x: 3, y: 4})
});

// 5. let's subscribe to the object's change events
ash.on(function (spec, val, source) {
    // this will be triggered by every state change, be it
    // local or remote
    console.log('event: ', spec.op(), val)
    // outputs:
    // set {x:3, y:4}
});
