const _ = require('lodash')
const sample_events = require('../common/data/events')

function rndBounded(min, max) {
  return Math.random() * (max - min) + min;
}

function destroyOldEvents(db, done) {
  db.getModelSet('Event').ready((err, events) => {
    events.list().map(e => events.removeObject('/'+e._type+'#'+e._id))
    done()
  })
}

function rndLatlng() {
  return {
    lat: rndBounded(33.46, 33.7),
    lng: rndBounded(-111.88, -112.25),
  }
}

function createNewEvents(db, done) {
  db.getModelSet('Event').ready((err, events) => {

    // create 10 random events
    const num_events = 10
    for (var i=0; i<num_events; i++) {
      db.setModel('Event', null, _.merge(
        rndLatlng(), sample_events.random()
      ))
    }
    done()
  })
}

module.exports = (db, done) => {
  done || (done = () => null)
  destroyOldEvents(db, (err) => err ? done(err)
    : createNewEvents(db, done))
}
