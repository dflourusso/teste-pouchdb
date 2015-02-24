angular.module('app', ['teste-daniel', 'ngResource'])

.controller 'ctrl', ['$scope', '$resource', ($scope, $resource)->
  $scope.teste = 'teste'

]
ready = if navigator.userAgent.indexOf('(cordova;') > -1 then 'deviceready' else 'DOMContentLoaded'

init = ->
  console.log("init: " + ready)
  angular.bootstrap(document, ['app'])

document.addEventListener(ready, init, false)

