class Todo extends Service
  todos: {}
  constructor: (pouchDB, @TodoModel)->
    @remoteCouch = "http://192.168.25.8:5984/todos"
    @db = pouchDB @remoteCouch
    @sync()
    @changes()

  sync: ->
    @updateTodos()
    options = live: true
    @db.replicate.to(@remoteCouch, options).on 'change', => @updateTodos()
    @db.replicate.from(@remoteCouch, options).on 'change', => @updateTodos()

  updateTodos: ->
    options = include_docs: true, descending: true
    @db.allDocs(options).then (doc)=>
      @todos = doc.rows

  onChange = (doc) ->
    console.log doc._conflicts
    unless doc._conflicts
      return
    collectConflicts doc._conflicts, (docs) ->
      master = docs.sort(byTime).unshift()
      for doc of docs
        for prop of doc
          if !(prop in master)
            master[prop] = doc[prop]
      @db.put master, (err)=>
        if !err
          for doc of docs
            @db.remove doc
        return
      return
    return

  changes: ->
    @db.changes
      conflicts: true
      onChange: onChange






  insert: (todo)->
    p = @db.post todo
    p.then =>
      console.log  'Doc incluido com sucesso'
    p.catch (e)=>
      console.log 'Erro ao salvar doc', e

  update: (doc)->
    @doc = if doc then doc else @doc
    @db.put(@doc).catch (err)->
      if err.status != 409
        @update()

  removeTodo: (todo)->
    @db.remove todo
