(function() {

  Vue.component('map', {
    template: '#map-template',
    data: function() {
      return {}
    },
    ready: function() {
      console.log('in mounted method')
      map = L.map( 'map', {
        center: [33.572162, -112.087966], // Phoenix, AZ
        minZoom: 13,
        zoom: 13
      })

      L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: ['a', 'b', 'c']
      }).addTo(map)
      console.log('map:', map)
    }

  });

})();
