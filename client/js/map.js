import _ from 'lodash'
import L from 'leaflet'

const {setModel, getModel, listModel} = require('./db')
const rndcolor = require('color-generator')

function rndBounded(min, max) {
  return Math.random() * (max - min) + min;
}

function createIcon(faClass, color) {
  return L.divIcon({
    className: '',  // empty class (ignore default styles)
    html: '<i class="fa '+faClass+'" aria-hidden="true" style="color: '+color+'; font-size: 2em; text-shadow: 1px 1px 3px black"></i>',
  })
}

Vue.component('st-map', {
  template: '#map-template',
  data() {
    return {
      markers: {}
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
    const pinData = setModel('Pin', this.name, spawn)

    // helper method to add pins to the map
    const addPin = (pinData) => {
      const icon = createIcon('fa-map-marker', pinData.color)

      // add the pin to the map
      const marker = L.marker([pinData.lat, pinData.lng], {icon})
        .bindTooltip(pinData.name)
        .addTo(map)
      this.markers[pinData._id] = marker

      // watch for changes, update map
      pinData.on((spec, val, source) => {
        if (_.includes(['set', 'init'], spec.op())) {
          const id = spec.id()
          this.markers[id].setLatLng([source.lat, source.lng])
        }
      })
    }

    // for each pin record stored by the server, add a pin on the map
    listModel('Pin', (err, pins) =>
      pins
      .map(p => getModel('Pin', p))
      .map(p => p.ready(() => addPin(p)))
    )

    // whenever the user pans the map, move their pin so other users can see
    map.on('move', (evt) => pinData.set(map.getCenter()))
  }

});
