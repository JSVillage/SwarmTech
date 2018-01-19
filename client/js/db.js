const Swarm = require('swarm')
const {Spec, Host} = Swarm
//Swarm.env.debug = true
//Swarm.env.trace = true

const Pin = require('../../common/models/pin')

const app = window.app = {}

// stuff to initialize hostID
const randStr = () => Spec.int2base((Math.random() * 10000) | 0)
const getHash = () => window.location.hash || '#0';
const getHostID = () => {
  const id = window.localStorage.getItem('localuser') || 'A' + randStr()
  window.localStorage.setItem('localuser', id)
  return id + getHash().replace('#', '~')
}

// 1. create local Host
const hostID = getHostID()
console.log('HostID: ', hostID)
var host
try {
  host = new Host(hostID)
} catch (e) {
  host = Swarm.env.localhost
}

// 2. connect to your server
host.connect('ws://localhost:8001', {delay: 50})

// data structure
const db = app.db = {
  data: {},

  models: {Pin},

  // getters/setters
  setModel: function setModel(model, id, value) {
    // is it already in there?
    var obj = db.data[model] && db.data[model][id]

    // if not, store it
    if (!obj) {
      const Model = db.models[model]
      obj = new Model(id)
      db.data[model] || (db.data[model] = {})
      db.data[model][id] = obj
    }

    // set the new value
    obj.set(value)
  },
  getModel: function getModel(model, id) {
    return db.data[model] && db.data[model][id]
  }
}

module.exports = db
