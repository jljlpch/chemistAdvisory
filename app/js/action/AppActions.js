var AppDispatcher = require('../dispatcher/AppDispatcher.js');

var Actions = {
  receive: function(from) {
    AppDispatcher.dispatch({
      'type': 'receive',
      'from':from
    });
  },

  readed: function(from) {
    AppDispatcher.dispatch({
      'type': 'readed',
      'from':from
    });
  }

};

module.exports = Actions;