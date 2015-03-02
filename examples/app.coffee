angular.module('app', ['teste-daniel', 'file-model'])
.filter 'url2image', ['$sce', ($sce)->
  (val)->
    return val unless val
    val
#    val.replace 'blob:', ''
]
.directive 'imgPouch', ($window)->
  restrict: 'A'
  scope:
    getAttachment: '='
    docId: '='
    attachmentId: '='
  link: (scope, element, attrs)->
    scope.getAttachment(scope.docId, scope.attachmentId).then (file)=>
      url = $window.URL.createObjectURL file
      element.attr 'src', url

.controller 'ctrl', ['$q', '$scope', '$window', 'pouchDB', ($q, $scope, $window, pouchDB)->
  remote = "http://192.168.25.8:5984/todos"
  local = 'todos'
  $scope.docs = []
  $scope.attachment = null

  db = pouchDB local
  $scope.getAttachment = db.getAttachment
  $scope.sync = ->
    db.sync remote, live: true
  $scope.sync()

  window.addEventListener 'online', ->
    $scope.sync()

  onChange = =>
    options =
      include_docs: true
    db.allDocs(options).then (data)=>
      $scope.docs = data.rows

  options =
    include_docs: true,
    live: true,
    onChange: onChange

  db.changes(options).then(null, null, onChange)






  $scope.add = ->
    db.post date: new Date().toJSON()

  $scope.update = (doc)->
    db.get(doc._id).then((_doc)=>
      console.log 'update', _doc
      db.put
        _id: _doc._id
        _rev: _doc._rev
        date: new Date().toJSON()
    ).catch (err)=>
      console.log 'Erro ao remover', err


  $scope.addAttach = (attachment, doc)->
    return unless attachment
    attachment_id = new Date().toJSON()
    db.putAttachment doc._id, attachment_id, doc._rev, attachment, attachment.type, (err, res)->
      console.log err, res

  $scope.removeAttach = (doc_id, attachment_id, _rev)->
    db.removeAttachment doc_id, attachment_id, _rev, (err, res)->
      console.log err, res


  $scope.remove = (doc)->
    db.get(doc._id).then((_doc)=>
      return db.remove(_doc);
    ).catch (err)=>
      console.log 'Erro ao remover'

]
ready = if navigator.userAgent.indexOf('(cordova;') > -1 then 'deviceready' else 'DOMContentLoaded'

init = ->
  console.log("init: " + ready)
  angular.bootstrap(document, ['app'])

document.addEventListener(ready, init, false)

