import map from "./map"
import chatApi from "./chatApi"
import chatBox from "./chatBox"
import login from "./login"

Vue.component('st-dashboard', {
  template: '#dashboard-template',
  props: ['name'],
});

Vue.component('st-main', {
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
  }
});

new Vue({el: '#main'});
