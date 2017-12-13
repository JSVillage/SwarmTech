(function() {

  Vue.component('dashboard', {
    template: '#dashboard-template',
    props: ['name'],
  });

  Vue.component('main', {
    template: '#main-template',
    data: function() {
      return {
        name: '',
      }
    },
    methods: {
      setName: function(name) {
        this.name = name;
      }
    },
    created: function() {
      // called via $dispatch by login
      this.$on('name-set', this.setName);
    },
  });

  new Vue({el: '#main'});
})();
