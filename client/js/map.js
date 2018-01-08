import pin24url from '../images/pin24.png'
import pin48url from '../images/pin48.png'

const {pins} = require('./data')

Vue.component('st-map', {
  template: '#map-template',
  data() {
    return {
      markers: {}
    }
  },
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

    const addPin = (pinID) => {
      const pinData = pins[pinID]

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

    pins['ash'].on('.init', () => {
      console.log('adding pin')
      addPin('ash')
    })
  }

});
