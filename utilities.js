(function() {
  var CyclicQueue;

  CyclicQueue = (function() {

    function CyclicQueue(max_length, width, height) {
      this.max_length = max_length;
      this.width = width;
      this.height = height;
      this.values = [];
      this.index = [];
      this.colors = ['#f22', '#2f2'];
    }

    CyclicQueue.prototype.push = function(value) {
      if (this.values.length < this.max_length) {
        return this.values.push(value);
      } else {
        this.values[this.index] = value;
        this.index++;
        if (this.index > this.max_length) return this.index = 0;
      }
    };

    CyclicQueue.prototype.draw = function(ctx) {
      var height, i, value, _i, _len, _ref, _results;
      i = 0;
      _ref = this.values;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        value = _ref[_i];
        ctx.fillStyle = i === this.index - 1 ? this.colors[0] : this.colors[1];
        height = (value / 100) * 30;
        ctx.fillRect(this.width - 15 - this.max_length * 3 + i * 3, 55 - height, 2, 2);
        _results.push(i++);
      }
      return _results;
    };

    return CyclicQueue;

  })();

  this.CyclicQueue = CyclicQueue;

}).call(this);
