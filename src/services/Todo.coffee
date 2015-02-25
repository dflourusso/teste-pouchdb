class Todo extends Service
  todos: {}
  constructor: (pouchDB, @TodoModel)->
    @remoteCouch = "http://192.168.25.8:5984/todos"
    @db = pouchDB @remoteCouch
    @sync()

  sync: ->
    @updateTodos()
    options = live: true
    @db.replicate.to(@remoteCouch, options).on 'change', => @updateTodos()
    @db.replicate.from(@remoteCouch, options).on 'change', => @updateTodos()

  updateTodos: ->
    options = include_docs: true, descending: true
    @db.allDocs(options).then (doc)=>
      @todos = doc.rows




  insert: (todo)->
    p = @db.post todo
    p.then =>
      console.log  'Doc incluido com sucesso'
    p.catch (e)=>
      console.log 'Erro ao salvar doc', e

  removeTodo: (todo)->
    @db.remove todo

  update: (doc)->
    @doc = if doc then doc else @doc
    @db.put(doc).catch (err)->
      if err.status != 409
        @update()