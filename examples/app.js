(function() {
  var init, ready;

  angular.module('app', ['teste-daniel']).controller('ctrl', [
    '$scope', 'todoService', 'TodoModel', function($scope, todoService, TodoModel) {
      $scope.user = 'user1';
      $scope.ts = todoService;
      $scope.currentTodo = new TodoModel();
      $scope.removeTodo = function(todo) {
        return todoService.removeTodo(todo);
      };
      $scope.completeTodo = function(todo) {
        todo.complete = !todo.complete;
        return todoService.update(todo);
      };
      $scope.insert = function($event) {
        if ($event.keyCode === 13) {
          todoService.insert($scope.currentTodo);
          return $scope.currentTodo = new TodoModel();
        }
      };
      return $scope.update = function($event, editTodo) {
        if ($event.keyCode === 13) {
          return todoService.update(editTodo);
        }
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
