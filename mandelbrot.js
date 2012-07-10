(function() {
  var HEIGHT, MAX_ITER, MAX_RES, Mandelbrot, WIDTH, formatNumberLength, mandelbrot, requestAnimFrame,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  HEIGHT = 512;

  WIDTH = 512;

  MAX_ITER = 30;

  MAX_RES = 1024;

  formatNumberLength = function(num, length) {
    var r;
    r = "" + num;
    while (r.length < length) {
      r = "0" + r;
    }
    return r;
  };

  requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || (function(callback, element) {
    return window.setTimeout(callback, 1000 / 60);
  });

  if ((new RegExp("(iphone|android)", "i")).test(navigator.userAgent)) {
    WIDTH = document.documentElement.clientWidth;
    HEIGHT = document.documentElement.clientHeight - 30;
  }

  Mandelbrot = (function() {

    function Mandelbrot(canvas, ctx) {
      this.canvas = canvas;
      this.ctx = ctx;
      this.draw = __bind(this.draw, this);
      this.zoomOut = __bind(this.zoomOut, this);
      this.zoomIn = __bind(this.zoomIn, this);
      this.mouseMove = __bind(this.mouseMove, this);
      this.mouseUp = __bind(this.mouseUp, this);
      this.mouseDown = __bind(this.mouseDown, this);
      this.getPositionFromEvent = __bind(this.getPositionFromEvent, this);
      this.renderReady = __bind(this.renderReady, this);
      this.pixels = 8;
      this.last_draw = new Date().getTime();
      this.cx = 1.34;
      this.cy = 0.1;
      this.dx = 0;
      this.dy = 0;
      this.zoom_x = 3.5;
      this.zoom_y = 2.0;
      this.touching = false;
      this.touchX = null;
      this.touchY = null;
      this.canvas.addEventListener('mousedown', this.mouseDown, true);
      this.canvas.addEventListener('mouseup', this.mouseUp, true);
      document.getElementById("zoom-out").addEventListener('click', this.zoomOut, true);
      document.getElementById("zoom-in").addEventListener('click', this.zoomIn, true);
      this.canvas.addEventListener('render-ready', this.renderReady, true);
      this.buffer = document.createElement('canvas');
      this.buffer.width = WIDTH;
      this.buffer.height = HEIGHT;
      this.buffer_ctx = this.buffer.getContext('2d');
    }

    Mandelbrot.prototype.renderReady = function() {
      this.ctx.drawImage(this.buffer, 0, 0);
      return document.getElementById("loading").className = "hidden";
    };

    Mandelbrot.prototype.getCanvasLocalCoordinates = function(pageX, pageY) {
      return {
        x: pageX - this.canvas.offsetLeft,
        y: pageY - this.canvas.offsetTop
      };
    };

    Mandelbrot.prototype.getPositionFromEvent = function(event) {
      var position;
      event.preventDefault();
      return position = this.getCanvasLocalCoordinates(event.pageX, event.pageY);
    };

    Mandelbrot.prototype.mouseDown = function(event) {
      var position;
      position = this.getPositionFromEvent(event);
      this.touching = true;
      this.touchX = position.x;
      this.touchY = position.y;
      return this.canvas.addEventListener('mousemove', this.mouseMove, true);
    };

    Mandelbrot.prototype.mouseUp = function(event) {
      this.touching = false;
      this.touchX = null;
      this.touchY = null;
      return this.canvas.removeEventListener('mousemove', this.mouseMove, true);
    };

    Mandelbrot.prototype.mouseMove = function(event) {
      var position;
      position = this.getPositionFromEvent(event);
      this.dx += position.x - this.touchX;
      this.dy += position.y - this.touchY;
      this.touchX = position.x;
      this.touchY = position.y;
      if (!(isNaN(this.dx) || isNaN(this.dy))) {
        return this.reset(this.dx * 0.001, this.dy * 0.001);
      }
    };

    Mandelbrot.prototype.reset = function(dx, dy) {
      this.pixels = 8;
      this.cx += dx * this.zoom_x;
      this.cy += dy * this.zoom_y;
      this.dx = 0;
      return this.dy = 0;
    };

    Mandelbrot.prototype.zoomIn = function() {
      this.zoom_x *= 0.59;
      this.zoom_y *= 0.59;
      return this.reset(0, 0);
    };

    Mandelbrot.prototype.zoomOut = function() {
      this.zoom_x *= 1.75;
      this.zoom_y *= 1.75;
      return this.reset(0, 0);
    };

    Mandelbrot.prototype.draw = function() {
      var color, iter, mod, mu, x, x0, xt, y, y0, _ref, _ref2, _x, _y;
      if (this.pixels < MAX_RES) {
        this.buffer_ctx.fillStyle = '#000';
        this.buffer_ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        for (_x = 0, _ref = this.pixels; 0 <= _ref ? _x <= _ref : _x >= _ref; 0 <= _ref ? _x++ : _x--) {
          for (_y = 0, _ref2 = this.pixels; 0 <= _ref2 ? _y <= _ref2 : _y >= _ref2; 0 <= _ref2 ? _y++ : _y--) {
            x0 = (_x / this.pixels * this.zoom_x) - this.cx;
            y0 = (_y / this.pixels * this.zoom_y) - this.cy;
            x = 0;
            y = 0;
            iter = 0;
            while ((x * x + y * y < 4) && iter < MAX_ITER) {
              xt = x * x - y * y + x0;
              y = 2 * x * y + y0;
              x = xt;
              iter++;
            }
            mod = Math.sqrt(x * x + y * y);
            mu = iter - Math.log(Math.log(mod)) / Math.log(2);
            if (isNaN(mu)) mu = 0;
            color = [(mu * 7) % 255, (mu * 11) % 255, (mu * 13) % 255];
            this.buffer_ctx.fillStyle = "rgba(" + (parseInt(color[0])) + "," + (parseInt(color[1])) + "," + (parseInt(color[2])) + ",1)";
            this.buffer_ctx.fillRect(_x * WIDTH / this.pixels, _y * HEIGHT / this.pixels, WIDTH / this.pixels, HEIGHT / this.pixels);
          }
        }
        this.canvas.dispatchEvent(new Event('render-ready'));
      }
      if (this.pixels < MAX_RES) this.pixels *= 2;
      if (this.pixels < MAX_RES) {
        document.getElementById("loading").className = "visible";
      }
      return requestAnimFrame(this.draw);
    };

    return Mandelbrot;

  })();

  mandelbrot = null;

  window.onload = function() {
    var c, canvas;
    canvas = document.getElementById('canvas');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    c = canvas.getContext('2d');
    mandelbrot = new Mandelbrot(canvas, c);
    return mandelbrot.draw();
  };

}).call(this);
