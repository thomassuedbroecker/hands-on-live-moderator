app.factory('feedSocket', ['$rootScope', function ($rootScope) {

  // We return this object to anything injecting our service
  var Service = {};

  var callbacks = [];

  // Create our websocket object with the address to the websocket
  var ws;

  // Connect the socket
  wsConnect();

  function wsConnect() {
    // INSERT HERE!
    ws = new WebSocket("wss://[YOUR_BLUEMIX_ROUTE].mybluemix.net/livefeed");
    ws.onmessage = function (message) {
      handleData(JSON.parse(message.data));
    };
    ws.onclose = function () {
      setTimeout(wsConnect, 1000);
    };
  }

  function handleData(feedUpdate) {
    $rootScope.$apply(function () {
      for (var i in callbacks) {
        var callback = callbacks[i];
        if (typeof callback === 'function') {
          callback(feedUpdate);
        }
      }
    });
  }

  Service.subscribe = function (callback) {
    callbacks.push(callback);
  };

  Service.unsubscribe = function (callback) {
    var index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  };

  return Service;
}]);
