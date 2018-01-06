import pin24url from '../images/pin24.png'
import pin48url from '../images/pin48.png'

(function() {
  Vue.component('st-map', {
    template: '#map-template',
    data() {
      return {}
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

      L.marker([33.572162, -112.087966], {icon: pinIcon})
        .bindTooltip('Brandon')
        .addTo(map)
    }

  });

  const {pins} = require('./data')
})();
