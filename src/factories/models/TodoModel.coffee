class TodoModel extends Factory
  constructor: ->
    return class
      constructor: ->
        @title = ''
        @completed = false
        @user = "user1"
