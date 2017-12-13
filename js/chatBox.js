(function() {

  Vue.component('chat-box', {
    template: '#chat-box-template',
    data: function() {
      return {
        history: [],
        debug: false,
      }
    },
    computed: {
      debugOutput: function() {
        return JSON.stringify(this.$data, null, '  ');
      }
    },
    props: ["name"],
    created: function() {
      // override callback to receive updates
      chatApi.onHistoryUpdate = this.setHistory.bind(this);
      chatApi.refresh();

      var _this = this;
      Vue.nextTick(function() {
        _this.$els.chatInput.focus();
        _this.scrollToBottom();
      })
    },
    watch: {
      history: this.scrollToBottom
    },

    methods: {
      setHistory: function(history) {
        this.history = history;
      },
      setMessage: function(e) {
        message = e.target.value;
      },
      sendMessage: function() {
        var _this = this;

        if (this.message === ':debug') {
          this.debug = this.debug !== true;
          this.message = '';
          return
        }

        if (this.message === ':reset' || this.message === ':clear') {
          chatApi.reset();
          this.message = '';
          return
        }

        if (this.message !== '') {
          chatApi.sendChat({
            name: this.name,
            message: this.message
          });

          this.message = '';
          Vue.nextTick(_this.scrollToBottom)
        }
      },
      scrollToBottom: function() {
        var pane = this.$els.history;
        pane.scrollTop = pane.scrollHeight;
      },
    },
  });

})();
