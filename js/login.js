(function() {

  Vue.component('login', {
    template: '#login-template',
    data: function() {
      return {
        name: '',
      }
    },
    methods: {
      setSessionName: function() {
        if (this.name) {
          this.$dispatch('name-set', this.name)
        }
      },
    },
    created: function() {
      var _this = this;
      Vue.nextTick(function() {
        _this.$els.loginInput.focus();
      });
    },
  });

})();
