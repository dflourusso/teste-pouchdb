(function() {
  var init, ready;

  angular.module('app', ['teste-daniel']).controller('ctrl', [
    '$scope', 'pouchDB', 'TodoModel', function($scope, pouchDB, TodoModel) {
      var db, onChange, options;
      $scope.remote = "http://192.168.25.8:5984/todos";
      db = pouchDB($scope.remote);
      db.replicate.from($scope.remote);
      $scope.docs = [];
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
        return function(change) {
          console.log(change);
          return $scope.docs.push(change);
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
