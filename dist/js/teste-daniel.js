(function() {
  var Todo, testeDaniel;

  testeDaniel = (function() {
    function testeDaniel() {
      return ['pouchdb'];
    }

    return testeDaniel;

  })();

  angular.module('teste-daniel', new testeDaniel());

  Todo = (function() {
    function Todo(pouchDB) {
      this.pouchDB = pouchDB;
      this.remoteCouch = "http://192.168.25.8:5984/todos";
      this.db = this.pouchDB(this.remoteCouch);
      this.sync();
    }

    Todo.prototype.sync = function() {
      var options;
      options = {
        live: true
      };
      this.db.replicate.to(this.remoteCouch, options);
      return this.db.replicate.from(this.remoteCouch, options);
    };

    return Todo;

  })();

  angular.module('teste-daniel').service('todoService', ['pouchDB', Todo]);

}).call(this);
