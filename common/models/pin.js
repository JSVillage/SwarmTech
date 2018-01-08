const {Model} = require('swarm')

const Pin = Model.extend('Pin', {
  defaults: {
    name: 'Unnamed',
    x: 0,
    y: 0
  }
})

module.exports = Pin
