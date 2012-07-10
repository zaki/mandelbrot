HEIGHT= 512
WIDTH = 512
MAX_ITER = 30
MAX_RES  = 1024

#{{{ - Utilities
formatNumberLength = (num, length) ->
    r = "" + num
    while r.length < length
      r = "0" + r
    r

requestAnimFrame =
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      ((callback, element) ->
        window.setTimeout(callback, 1000/60)
      )

if (new RegExp("(iphone|android)", "i")).test navigator.userAgent
  WIDTH = document.documentElement.clientWidth
  HEIGHT = document.documentElement.clientHeight - 30
#}}}

class Mandelbrot
  constructor: (@canvas, @ctx) ->
    @pixels = 8
    @last_draw = new Date().getTime()
    @cx = 1.34
    @cy = 0.1
    @dx = 0
    @dy = 0
    @zoom_x = 3.5
    @zoom_y = 2.0

    @touching = false
    @touchX = null
    @touchY = null

    @canvas.addEventListener 'mousedown', this.mouseDown, true
    @canvas.addEventListener 'mouseup', this.mouseUp, true

    document.getElementById("zoom-out").addEventListener 'click', @zoomOut, true
    document.getElementById("zoom-in").addEventListener 'click', @zoomIn, true

    @canvas.addEventListener 'render-ready', this.renderReady, true

    @buffer = document.createElement('canvas')
    @buffer.width = WIDTH
    @buffer.height = HEIGHT
    @buffer_ctx = @buffer.getContext('2d')

#{{{
  renderReady: () =>
    @ctx.drawImage(@buffer, 0, 0)
    document.getElementById("loading").className = "hidden"

  getCanvasLocalCoordinates: (pageX, pageY) ->
    {
      x: (pageX - @canvas.offsetLeft)
      y: (pageY - @canvas.offsetTop)
    }

  getPositionFromEvent: (event) =>
    event.preventDefault()
    position = this.getCanvasLocalCoordinates(event.pageX, event.pageY)

  mouseDown: (event) =>
    position = this.getPositionFromEvent(event)

    @touching = true
    @touchX = position.x
    @touchY = position.y

    @canvas.addEventListener 'mousemove', @mouseMove, true

  mouseUp: (event) =>
    @touching = false
    @touchX   = null
    @touchY   = null

    @canvas.removeEventListener 'mousemove', @mouseMove, true

  mouseMove: (event) =>
    position = this.getPositionFromEvent(event)

    @dx += position.x - @touchX
    @dy += position.y - @touchY

    @touchX = position.x
    @touchY = position.y

    unless isNaN(@dx) or isNaN(@dy)
      this.reset(@dx * 0.001, @dy * 0.001)

  reset: (dx, dy) ->
    @pixels = 8

    @cx += dx * @zoom_x
    @cy += dy * @zoom_y
    @dx = 0
    @dy = 0
#}}}

  zoomIn: () =>
    @zoom_x *= 0.59
    @zoom_y *= 0.59
    this.reset 0, 0

  zoomOut: () =>
    @zoom_x *= 1.75
    @zoom_y *= 1.75
    this.reset 0, 0

  draw: () =>
    if @pixels < MAX_RES
      @buffer_ctx.fillStyle = '#000'
      @buffer_ctx.fillRect(0, 0, @canvas.width, @canvas.height)

      for _x in [0..@pixels]
        for _y in [0..@pixels]
          # x0 = ( _x / @pixels * 3.5 ) - 2.5
          # y0 = ( _y / @pixels * 2.0 ) - 1.0
          x0 = ( _x / @pixels * @zoom_x ) - @cx
          y0 = ( _y / @pixels * @zoom_y ) - @cy
          x  = 0
          y  = 0
          iter = 0

          while (x*x + y*y < 4) and iter < MAX_ITER
            xt = x*x - y*y + x0
            y  = 2*x*y + y0
            x  = xt

            iter++

          mod = Math.sqrt( x*x + y*y )

          mu = iter - Math.log( Math.log( mod ) ) / Math.log(2)
          if isNaN(mu)
            mu = 0

          #color = [(iter * 1) % 255, (iter * 11) % 255, (iter * 29) % 255]
          color = [(mu * 7) % 255, (mu * 11) % 255, (mu * 13) % 255]

          @buffer_ctx.fillStyle = "rgba(#{parseInt(color[0])},#{parseInt(color[1])},#{parseInt(color[2])},1)"
          @buffer_ctx.fillRect(_x * WIDTH / @pixels, _y * HEIGHT / @pixels, WIDTH / @pixels, HEIGHT / @pixels)
      @canvas.dispatchEvent(new Event('render-ready'))

    if @pixels < MAX_RES
      @pixels *= 2
    if @pixels < MAX_RES
      document.getElementById("loading").className = "visible"

    requestAnimFrame this.draw

mandelbrot = null
window.onload = () ->
  canvas = document.getElementById('canvas')
  canvas.width  = WIDTH
  canvas.height = HEIGHT

  c = canvas.getContext('2d')

  mandelbrot = new Mandelbrot(canvas, c)
  mandelbrot.draw()
