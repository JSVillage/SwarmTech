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
          this.$emit('name-set', this.name)
        }
      },
    },
    created: function() {
      Vue.nextTick(() => this.$refs.loginInput.focus())
    },
  });

})();
