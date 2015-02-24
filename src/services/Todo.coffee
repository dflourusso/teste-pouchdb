class Todo extends Service
  constructor: (@pouchDB)->
    @remoteCouch = "http://192.168.25.8:5984/todos"
    @db = @pouchDB @remoteCouch
    @sync()


  sync: ->
    options = live: true
    @db.replicate.to(@remoteCouch, options);
    @db.replicate.from(@remoteCouch, options);