(function() {
  var init, ready;

  angular.module('app', ['teste-daniel', 'ngResource']).controller('ctrl', [
    '$scope', '$resource', function($scope, $resource) {
      return $scope.teste = 'teste';
    }
  ]);

  ready = navigator.userAgent.indexOf('(cordova;') > -1 ? 'deviceready' : 'DOMContentLoaded';

  init = function() {
    console.log("init: " + ready);
    return angular.bootstrap(document, ['app']);
  };

  document.addEventListener(ready, init, false);

}).call(this);
