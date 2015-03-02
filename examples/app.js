(function() {
  var init, ready;

  angular.module('app', ['teste-daniel', 'file-model']).filter('url2image', [
    '$sce', function($sce) {
      return function(val) {
        if (!val) {
          return val;
        }
        return val;
      };
    }
  ]).directive('imgPouch', function($window) {
    return {
      restrict: 'A',
      scope: {
        getAttachment: '=',
        docId: '=',
        attachmentId: '='
      },
      link: function(scope, element, attrs) {
        return scope.getAttachment(scope.docId, scope.attachmentId).then((function(_this) {
          return function(file) {
            var url;
            url = $window.URL.createObjectURL(file);
            return element.attr('src', url);
          };
        })(this));
      }
    };
  }).controller('ctrl', [
    '$q', '$scope', '$window', 'pouchDB', function($q, $scope, $window, pouchDB) {
      var db, local, onChange, options, remote;
      remote = "http://192.168.25.8:5984/todos";
      local = 'todos';
      $scope.docs = [];
      $scope.attachment = null;
      db = pouchDB(local);
      $scope.getAttachment = db.getAttachment;
      $scope.sync = function() {
        return db.sync(remote, {
          live: true
        });
      };
      $scope.sync();
      window.addEventListener('online', function() {
        return $scope.sync();
      });
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
      db.changes(options).then(null, null, onChange);
      $scope.add = function() {
        return db.post({
          date: new Date().toJSON()
        });
      };
      $scope.update = function(doc) {
        return db.get(doc._id).then((function(_this) {
          return function(_doc) {
            console.log('update', _doc);
            return db.put({
              _id: _doc._id,
              _rev: _doc._rev,
              date: new Date().toJSON()
            });
          };
        })(this))["catch"]((function(_this) {
          return function(err) {
            return console.log('Erro ao remover', err);
          };
        })(this));
      };
      $scope.addAttach = function(attachment, doc) {
        var attachment_id;
        if (!attachment) {
          return;
        }
        attachment_id = new Date().toJSON();
        return db.putAttachment(doc._id, attachment_id, doc._rev, attachment, attachment.type, function(err, res) {
          return console.log(err, res);
        });
      };
      $scope.removeAttach = function(doc_id, attachment_id, _rev) {
        return db.removeAttachment(doc_id, attachment_id, _rev, function(err, res) {
          return console.log(err, res);
        });
      };
      return $scope.remove = function(doc) {
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
    }
  ]);

  ready = navigator.userAgent.indexOf('(cordova;') > -1 ? 'deviceready' : 'DOMContentLoaded';

  init = function() {
    console.log("init: " + ready);
    return angular.bootstrap(document, ['app']);
  };

  document.addEventListener(ready, init, false);

}).call(this);
