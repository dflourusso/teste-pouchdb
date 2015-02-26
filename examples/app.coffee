angular.module('app', ['teste-daniel'])

.controller 'ctrl', ['$scope', '$window', 'pouchDB', 'TodoModel', ($scope, $window, pouchDB, TodoModel)->
  remote = "http://192.168.25.8:5984/todos"
  local = 'todos'
  $scope.docs = []

  db = pouchDB local
  $scope.sync = ->
    db.sync remote, live: true
  $scope.sync()

  window.addEventListener 'online', ->
    $scope.sync()


  $scope.add = ->
    db.post date: new Date().toJSON()

  $scope.remove = (doc)->
    db.get(doc._id).then((_doc)=>
      return db.remove(_doc);
    ).catch (err)=>
      console.log 'Erro ao remover'


  onChange = =>
    options =
      include_docs: true
    db.allDocs(options).then (data)=>
      $scope.docs = data.rows

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

