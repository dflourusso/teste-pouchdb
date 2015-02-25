(function() {
  var Todo, TodoModel, testeDaniel;

  testeDaniel = (function() {
    function testeDaniel() {
      return ['pouchdb'];
    }

    return testeDaniel;

  })();

  angular.module('teste-daniel', new testeDaniel());

  Todo = (function() {
    Todo.prototype.todos = {};

    function Todo(pouchDB, TodoModel1) {
      this.TodoModel = TodoModel1;
      this.remoteCouch = "http://192.168.25.8:5984/todos";
      this.db = pouchDB(this.remoteCouch);
      this.sync();
    }

    Todo.prototype.sync = function() {
      var options;
      this.updateTodos();
      options = {
        live: true
      };
      this.db.replicate.to(this.remoteCouch, options).on('change', (function(_this) {
        return function() {
          return _this.updateTodos();
        };
      })(this));
      return this.db.replicate.from(this.remoteCouch, options).on('change', (function(_this) {
        return function() {
          return _this.updateTodos();
        };
      })(this));
    };

    Todo.prototype.updateTodos = function() {
      var options;
      options = {
        include_docs: true,
        descending: true
      };
      return this.db.allDocs(options).then((function(_this) {
        return function(doc) {
          return _this.todos = doc.rows;
        };
      })(this));
    };

    Todo.prototype.insert = function(todo) {
      var p;
      p = this.db.post(todo);
      p.then((function(_this) {
        return function() {
          return console.log('Doc incluido com sucesso');
        };
      })(this));
      return p["catch"]((function(_this) {
        return function(e) {
          return console.log('Erro ao salvar doc', e);
        };
      })(this));
    };

    Todo.prototype.removeTodo = function(todo) {
      return this.db.remove(todo);
    };

    Todo.prototype.update = function(doc) {
      this.doc = doc ? doc : this.doc;
      return this.db.put(doc)["catch"](function(err) {
        if (err.status !== 409) {
          return this.update();
        }
      });
    };

    return Todo;

  })();

  angular.module('teste-daniel').service('todoService', ['pouchDB', 'TodoModel', Todo]);

  TodoModel = (function() {
    function TodoModel() {
      return (function() {
        function _Class() {
          this.title = '';
          this.completed = false;
          this.user = "user1";
        }

        return _Class;

      })();
    }

    return TodoModel;

  })();

  angular.module('teste-daniel').factory('TodoModel', [TodoModel]);

}).call(this);
