import pin24url from '../images/pin24.png'
import pin48url from '../images/pin48.png'

const {setModel, getModel} = require('./db')

Vue.component('st-map', {
  template: '#map-template',
  data() {
    return {
      markers: {}
    }
  },
  props: ['name'],
  mounted() {
    const map = L.map( 'map', {
      center: [33.572162, -112.087966], // Phoenix, AZ
      minZoom: 4,
      zoom: 13
    })

    L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: ['a', 'b', 'c']
    }).addTo(map)

    const pinIcon = L.icon({
      iconUrl: pin24url,
      iconRetinaUrl: pin48url,
      iconSize: [29, 24],
      iconAnchor: [9, 21],
      popupAnchor: [0, -14]
    })

    setModel('Pin', this.name, {name: this.name, x: 33.572162, y: -112.087966})

    const addPin = (pinID) => {
      const pinData = getModel('Pin', pinID)

      // add the pin to the map
      const marker = L.marker([pinData.x, pinData.y], {icon: pinIcon})
        .bindTooltip(pinData.name)
        .addTo(map)
      this.markers[pinID] = marker

      // watch for changes, update map
      pinData.on((spec, val, source) => {
        if (spec.op() === 'set') {
          const id = spec.id()
          this.markers[id].setLatLng([val.x, val.y])
        }
      })
    }

    addPin(this.name)
  }

});
