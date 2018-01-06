(function() {

  Vue.component('chat-box', {
    template: '#chat-box-template',
    data: function() {
      return {
        message: '',
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

      Vue.nextTick(() => {
        this.$refs.chatInput.focus();
        this.scrollToBottom();
      })
    },
    watch: {
      history() {this.scrollToBottom()}
    },

    methods: {
      setHistory: function(history) {
        this.history = history;
      },
      setMessage: function(e) {
        message = e.target.value;
      },
      sendMessage: function() {
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
          Vue.nextTick(this.scrollToBottom)
        }
      },
      scrollToBottom: function() {
        var pane = this.$refs.history;
        pane.scrollTop = pane.scrollHeight;
      },
    },
  });

})();
