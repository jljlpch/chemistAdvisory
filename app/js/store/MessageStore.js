var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var _messages = {
  isNewMessage:false,
};

var MessageStore = assign({}, EventEmitter.prototype, {
  emitChange: function() {
    this.emit('changed');
  },
  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on('changed', callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener('changed', callback);
  },

  get: function() {
    return _messages.isNewMessage;
  },

  getAll:function(){
    return _messages;
  }
});

AppDispatcher.register(function(action) {

  switch(action.type) {

    case 'receive':
      var from=action.from;
      _messages.isNewMessage=true;//收到消息,显示红点
      if(_messages[from]){
        _messages[from].count++;//如果存在该药师，未读消息加1
      }else{
        _messages[from]={};
        _messages[from].count=1;//如果不存在该药师，未读消息等于1
      }
      MessageStore.emitChange();
      break;

    case 'readed':
      var from=action.from;
      _messages.isNewMessage=false;//已读消息,去掉红点
      if(_messages[from]){
        _messages[from].count=0;//未读消息等于0
      }
      for(x in _messages){
        if(_messages[x].count!=0&&x!='isNewMessage'){
          _messages.isNewMessage=true;
        }
      }
      MessageStore.emitChange();
      break;

    default:
      // do nothing
  }

});

module.exports = MessageStore;

