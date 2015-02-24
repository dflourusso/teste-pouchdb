angular.module('app', ['teste-daniel'])

.controller 'ctrl', ['$scope', 'todoService', ($scope, todoService)->
  $scope.teste = 'teste'
  $scope.ts = todoService
  console.log $scope.ts

]
ready = if navigator.userAgent.indexOf('(cordova;') > -1 then 'deviceready' else 'DOMContentLoaded'

init = ->
  console.log("init: " + ready)
  angular.bootstrap(document, ['app'])

document.addEventListener(ready, init, false)

