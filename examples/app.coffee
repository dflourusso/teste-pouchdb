angular.module('app', ['teste-daniel'])

.controller 'ctrl', ['$scope', 'pouchDB', 'TodoModel', ($scope, pouchDB, TodoModel)->
  $scope.remote = "http://192.168.25.8:5984/todos"
  db = pouchDB $scope.remote

#  updateStatus = (response)->
#    $scope.status = JSON.stringify(response)
#
#  $scope.replicate = ->
#    db.post date: new Date().toJSON()
#    db.replicate.to($scope.remote)
#    .then(null, null, updateStatus)
#    .then(updateStatus)
#    .catch(updateStatus)


  db.replicate.from($scope.remote)

  $scope.docs = []

  $scope.add = ->
    db.post date: new Date().toJSON()

  $scope.remove = (doc)->
    db.get(doc._id).then((_doc)=>
      return db.remove(_doc);
    ).catch (err)=>
      console.log 'Erro ao remover'


  onChange = (change)=>
    console.log change
    $scope.docs.push change

  options =
    include_docs: true,
    live: true,
    onChange: onChange

  console.log db.changes(options)
  db.changes(options).then(null, null, onChange)


]
ready = if navigator.userAgent.indexOf('(cordova;') > -1 then 'deviceready' else 'DOMContentLoaded'

init = ->
  console.log("init: " + ready)
  angular.bootstrap(document, ['app'])

document.addEventListener(ready, init, false)

