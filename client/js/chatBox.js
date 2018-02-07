const async = require('async')
const _ = require('lodash')
const {setModel, getModelSet} = require('./db')

Vue.component('chat-box', {
  template: '#chat-box-template',
  data() {
    return {
      chat: getModelSet('Chat'),
      history: [],
      message: '',
      debug: false,
    }
  },
  computed: {
    debugOutput() {
      return JSON.stringify(_.omit(this.$data, 'chat'), null, '  ');
    },
  },
  props: ["name"],
  created() {

    // watch for changes, update chat
    this.chat.on((spec, val, source) => {
      //console.log('chat changed with op:', spec.op())
      if (_.includes(['set', 'init', 'change'], spec.op())) {
        process.nextTick(() => {
          const chats = window.chats = this.chat.list(c => c._id)

          // wait until all the chat messages have synced
          async.parallel(chats.map(c => c.ready.bind(c)), () => {
            const history = chats.map(m => m.pojo())
            //console.log('chat changed:', history)
            this.history = history
          })
        })
      }
    })

    Vue.nextTick(() => {
      this.$refs.chatInput.focus();
      this.scrollToBottom();
    })
  },
  watch: {
    chat() {this.scrollToBottom()}
  },

  methods: {
    setMessage(e) {
      message = e.target.value;
    },
    sendChat(message) {
      setModel('Message', null, message)
    },
    sendMessage() {
      if (this.message === ':debug') {
        this.debug = this.debug !== true;
        this.message = '';
        return
      }

      if (this.message === ':reset' || this.message === ':clear') {
        // TODO: find a way to reset the chat
        console.error('Clear chat is not implemented!')
        this.message = '';
        return
      }

      if (this.message !== '') {
        this.sendChat({
          name: this.name,
          message: this.message
        });

        this.message = '';
        Vue.nextTick(this.scrollToBottom)
      }
    },
    scrollToBottom() {
      var pane = this.$refs.history;
      pane.scrollTop = pane.scrollHeight;
    },
  },
});
