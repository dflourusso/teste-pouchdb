(function() {
  var init, ready;

  angular.module('app', ['teste-daniel']).controller('ctrl', [
    '$scope', '$window', 'pouchDB', 'TodoModel', function($scope, $window, pouchDB, TodoModel) {
      var db, local, onChange, options, remote;
      remote = "http://192.168.25.8:5984/todos";
      local = 'todos';
      $scope.docs = [];
      db = pouchDB(local);
      $scope.sync = function() {
        return db.sync(remote, {
          live: true
        });
      };
      $scope.sync();
      window.addEventListener('online', function() {
        return $scope.sync();
      });
      $scope.add = function() {
        return db.post({
          date: new Date().toJSON()
        });
      };
      $scope.remove = function(doc) {
        return db.get(doc._id).then((function(_this) {
          return function(_doc) {
            return db.remove(_doc);
          };
        })(this))["catch"]((function(_this) {
          return function(err) {
            return console.log('Erro ao remover');
          };
        })(this));
      };
      onChange = (function(_this) {
        return function() {
          var options;
          options = {
            include_docs: true
          };
          return db.allDocs(options).then(function(data) {
            return $scope.docs = data.rows;
          });
        };
      })(this);
      options = {
        include_docs: true,
        live: true,
        onChange: onChange
      };
      console.log(db.changes(options));
      return db.changes(options).then(null, null, onChange);
    }
  ]);

  ready = navigator.userAgent.indexOf('(cordova;') > -1 ? 'deviceready' : 'DOMContentLoaded';

  init = function() {
    console.log("init: " + ready);
    return angular.bootstrap(document, ['app']);
  };

  document.addEventListener(ready, init, false);

}).call(this);
