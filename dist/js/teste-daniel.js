(function() {
  var Todo, TodoModel, testeDaniel,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  testeDaniel = (function() {
    function testeDaniel() {
      return ['pouchdb'];
    }

    return testeDaniel;

  })();

  angular.module('teste-daniel', new testeDaniel());

  Todo = (function() {
    var onChange;

    Todo.prototype.todos = {};

    function Todo(pouchDB, TodoModel1) {
      this.TodoModel = TodoModel1;
      this.remoteCouch = "http://192.168.25.8:5984/todos";
      this.db = pouchDB(this.remoteCouch);
      this.sync();
      this.changes();
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

    onChange = function(doc) {
      console.log(doc._conflicts);
      if (!doc._conflicts) {
        return;
      }
      collectConflicts(doc._conflicts, function(docs) {
        var master, prop;
        master = docs.sort(byTime).unshift();
        for (doc in docs) {
          for (prop in doc) {
            if (!(indexOf.call(master, prop) >= 0)) {
              master[prop] = doc[prop];
            }
          }
        }
        this.db.put(master, (function(_this) {
          return function(err) {
            if (!err) {
              for (doc in docs) {
                _this.db.remove(doc);
              }
            }
          };
        })(this));
      });
    };

    Todo.prototype.changes = function() {
      return this.db.changes({
        conflicts: true,
        onChange: onChange
      });
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

    Todo.prototype.update = function(doc) {
      this.doc = doc ? doc : this.doc;
      return this.db.put(this.doc)["catch"](function(err) {
        if (err.status !== 409) {
          return this.update();
        }
      });
    };

    Todo.prototype.removeTodo = function(todo) {
      return this.db.remove(todo);
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
