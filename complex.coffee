class Complex
  initialize: (@a, @b) ->

  add_: (other) ->
    @a += other.a
    @b += other.b

  add: (other) ->
    new Complex(@a+other.a, @b+other.b)

  mul_: (other) ->
    @a *= other.a
    @b *= other.b

  mul: (other) ->
    new Complex(@a*other.a, @b*other.b)

  mag: () ->
    @a*@a + @b*@b

@Complex = Complex
