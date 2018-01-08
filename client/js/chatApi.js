(function() {
  var history = [];

  window.chatApi = {

    // stubbed out, overidden by chatBox.js
    onHistoryUpdate: function() {},

    // call API and call onHistoryUpdate
    refresh: function() {
      var _this = this;

      // mock ajax call
      setTimeout(function() {
        _this.onHistoryUpdate(history);
      }, 100);
    },

    // send chat and call onHistoryUpdate
    sendChat: function(chat) {
      var _this = this;
      // send chat
      history.push(chat);

      // call onHistoryUpdate
      setTimeout(function() {
        _this.onHistoryUpdate(history);
      }, 100);
    },

    reset: function() {
      history = [];
      this.onHistoryUpdate(history);
    },
  }
})();
