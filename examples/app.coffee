angular.module('app', ['teste-daniel'])

.controller 'ctrl', ['$scope', 'todoService', 'TodoModel', ($scope, todoService, TodoModel)->
  $scope.user = 'user1'
  $scope.ts = todoService
  $scope.currentTodo = new TodoModel()

  $scope.removeTodo = (todo)->
    todoService.removeTodo(todo)

  $scope.completeTodo = (todo)->
    todo.complete = !todo.complete
    todoService.update todo

  $scope.insert = ($event)->
    if $event.keyCode == 13
      todoService.insert $scope.currentTodo
      $scope.currentTodo = new TodoModel()

  $scope.update = ($event, editTodo)->
    if $event.keyCode == 13
      todoService.update editTodo

]
ready = if navigator.userAgent.indexOf('(cordova;') > -1 then 'deviceready' else 'DOMContentLoaded'

init = ->
  console.log("init: " + ready)
  angular.bootstrap(document, ['app'])

document.addEventListener(ready, init, false)

