(function() {
  var Complex;

  Complex = (function() {

    function Complex() {}

    Complex.prototype.initialize = function(a, b) {
      this.a = a;
      this.b = b;
    };

    Complex.prototype.add_ = function(other) {
      this.a += other.a;
      return this.b += other.b;
    };

    Complex.prototype.add = function(other) {
      return new Complex(this.a + other.a, this.b + other.b);
    };

    Complex.prototype.mul_ = function(other) {
      this.a *= other.a;
      return this.b *= other.b;
    };

    Complex.prototype.mul = function(other) {
      return new Complex(this.a * other.a, this.b * other.b);
    };

    Complex.prototype.mag = function() {
      return this.a * this.a + this.b * this.b;
    };

    return Complex;

  })();

  this.Complex = Complex;

}).call(this);
