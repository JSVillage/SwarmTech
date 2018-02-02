import map from "./map"
import chatApi from "./chatApi"
import chatBox from "./chatBox"
import login from "./login"

Vue.component('st-dashboard', {
  template: '#dashboard-template',
  props: ['name'],
  data: function() {
    return {
      showTemplate: true,
      windowHeight:0,
      windowWidth:0,
      toggleView: true
    }
  },
  methods:{
    getWindowWidth(event) {
      this.windowWidth = document.documentElement.clientWidth
    },
    getWindowHeight(event){
      this.windowHeight = document.documentElement.clientHeight
    },
    toggleButton(){
      if(this.toggleView == true){
        this.toggleView = false
      } else {
        this.toggleView = true
      }
    }
  },
  mounted() {
    this.$nextTick(function() {
      // window event listener
      window.addEventListener('resize', this.getWindowWidth)
      window.addEventListener('resize', this.getWindowHeight)
      this.getWindowHeight()
      this.getWindowWidth()
    })
  }
})

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
