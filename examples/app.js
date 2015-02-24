(function() {
  var init, ready;

  angular.module('app', ['teste-daniel']).controller('ctrl', [
    '$scope', 'todoService', function($scope, todoService) {
      $scope.teste = 'teste';
      $scope.ts = todoService;
      return console.log($scope.ts);
    }
  ]);

  ready = navigator.userAgent.indexOf('(cordova;') > -1 ? 'deviceready' : 'DOMContentLoaded';

  init = function() {
    console.log("init: " + ready);
    return angular.bootstrap(document, ['app']);
  };

  document.addEventListener(ready, init, false);

}).call(this);
