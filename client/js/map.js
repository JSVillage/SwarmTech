import _ from 'lodash'
import L from 'leaflet'

window._ = _

// yay for lack of dynamic imports
// life is so much fun
import '../images/accesdenied.png'
import '../images/avalanche1.png'
import '../images/blast.png'
import '../images/cowabduction.png'
import '../images/earthquake-3.png'
import '../images/fire.png'
import '../images/linedown.png'
import '../images/pirates.png'
import '../images/planecrash.png'
import '../images/radiation.png'
import '../images/rescue-blue.png'
import '../images/rescue-green.png'
import '../images/shooting.png'
import '../images/star-green.png'
import '../images/theft.png'
import '../images/tornado-2.png'
import '../images/treedown.png'
import '../images/tsunami.png'
import '../images/zombie-outbreak1.png'

const {setModel, getModel, listModel, getModelSet} = require('./db')
const rndcolor = require('color-generator')

function rndBounded(min, max) {
  return Math.random() * (max - min) + min;
}

function createFontIcon(faClass, color) {
  return L.divIcon({
    className: '',  // empty class (ignore default styles)
    html: '<i class="fa '+faClass+'" aria-hidden="true" style="color: '+color+'; font-size: 2em; text-shadow: 1px 1px 3px black"></i>',
  })
}

function createImgIcon(url) {
  return L.icon({
    iconUrl: require('../images/'+url),
    iconSize: [32, 37],
  })
}

const eventTooltip = (e) => e.resolved ? e.tooltip + ' resolved by ' + e.resolvedBy : e.tooltip

Vue.component('st-map', {
  template: '#map-template',
  data() {
    return {
      pins: {},
      events: {},
    }
  },
  props: ['name'],
  mounted() {

    // pick a random color and starting point in Phoenix AZ for this client
    const spawn = {
      name: this.name,
      lat: rndBounded(33.46, 33.7),
      lng: rndBounded(-111.88, -112.25),
      color: rndcolor(0.99, 0.99).hexString(),
    }

    // create a map to represent current state of the world
    const map = window.map = L.map( 'map', {
      center: [spawn.lat, spawn.lng],
      minZoom: 4,
      zoom: 11
    })

    L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: ['a', 'b', 'c'],
    }).addTo(map)

    // create a pin to represent current client
    const ourPin = setModel('Pin', this.name, spawn)

    // helper method to add pins to the map
    const addPin = (pinData) => {
      const icon = createFontIcon('fa-map-marker', pinData.color)

      // add the pin to the map
      const marker = L.marker([pinData.lat, pinData.lng], {icon})
        .bindTooltip(pinData.name)
        .addTo(map)
      this.pins[pinData._id] = marker

      // watch for changes, update map
      pinData.on((spec, val, source) => {
        if (_.includes(['set', 'init'], spec.op())) {
          const id = spec.id()
          const pin_position = [source.lat, source.lng]
          this.pins[id].setLatLng(pin_position)
        }
      })
    }

    const addEvent = (eventData) => {
      const icon = createImgIcon(eventData.icon)


      // add the event to the map
      const marker = L.marker([eventData.lat, eventData.lng], {icon})
        .bindTooltip(eventTooltip(eventData))
        .addTo(map)
      this.events[eventData._id] = marker

      // whenever an event is resolved, update the map
      eventData.on((spec, val, source) => {
        if (_.includes(['set', 'init'], spec.op()) && source.resolved) {
          const id = source._id
          const icon = createImgIcon(source.icon)
          this.events[id]
            .setIcon(icon)
            .bindTooltip(eventTooltip(source))
        }
      })
    }

    // for each Event record stored by the server, add an event on the map
    listModel('Event', (err, events) =>
      events
      .map(e => getModel('Event', e))
      .map(e => e.ready(() => addEvent(e)))
    )

    // for each Pin record stored by the server, add a pin on the map
    listModel('Pin', (err, pins) =>
      pins
      .map(p => getModel('Pin', p))
      .map(p => p.ready(() => addPin(p)))
    )

    // whenever our user pans the map, move our pin so other users can see
    let update_pin = (evt) => ourPin.set(map.getCenter())
    update_pin = _.throttle(update_pin, 200, {leading: true, trailing: true})
    map.on('move', update_pin)

    // if our pin is within 400 meters of an event, mark the event as resolved
    const RESOLVE_DISTANCE = 400
    let resolve_events = (spec, val, source) => {
      if (_.includes(['set', 'init'], spec.op())) {
        const id = spec.id()
        const pin_position = L.latLng(source.lat, source.lng)

        getModelSet('Event').ready((err, events) => {
          // resolve events less than 500 meters away
          const resolved = _(events._objects)
            .filter(e => !e.resolved)
            .filter(e => map.distance(pin_position, L.latLng(e.lat, e.lng)) < RESOLVE_DISTANCE)
            .map(e => {e.set({resolved: true, icon: 'star-green.png', resolvedBy: this.name}); return e})
            .value()
          if (resolved.length > 0) console.log('resolved events:', resolved)
        })
      }
    }
    resolve_events = _.debounce(resolve_events, 200, {leading: true, trailing: true})
    ourPin.on(resolve_events)

  }
});
