class CyclicQueue
  constructor: (@max_length, @width, @height) ->
    @values = []
    @index  = []

    @colors = [ '#f22', '#2f2' ]

  push: (value) ->
    if @values.length < @max_length
      @values.push value
    else
      @values[@index] = value
      @index++
      if @index > @max_length
        @index = 0

  draw: (ctx) ->
    i = 0
    for value in @values
      ctx.fillStyle = if i == @index-1 then @colors[0] else @colors[1]
      height = (value / 100) * 30
      ctx.fillRect( @width-15-@max_length*3+i*3, 55-height, 2, 2)
      i++

@CyclicQueue = CyclicQueue
