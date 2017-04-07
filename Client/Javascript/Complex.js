var Ocean;
(function (Ocean) {
    var Complex = (function () {
        function Complex(x, y) {
            this.x = x;
            this.y = y;
        }
        Complex.Conj = function (a) {
            return new Complex(a.x, -a.y);
        };
        Complex.add = function (a, b) {
            return new Complex(a.x + b.x, a.y + b.y);
        };
        Complex.substract = function (a, b) {
            return new Complex(a.x - b.x, a.y - b.y);
        };
        Complex.mult = function (a, b) {
            return new Complex(a.x * b.x - a.y * b.y, a.x * b.y + b.x * a.y);
        };
        Complex.multScalar = function (a, b) {
            return new Complex(a.x * b, a.y * b);
        };
        Complex.divideScalar = function (a, b) {
            return new Complex(a.x / b, a.y / b);
        };
        Complex.Polar = function (r, angle) {
            return new Complex(r * Math.cos(angle), r * Math.sin(angle));
        };
        Complex.Modulus = function (a) {
            return Math.sqrt(a.x * a.x + a.y * a.y);
        };
        return Complex;
    }());
    Ocean.Complex = Complex;
})(Ocean || (Ocean = {}));
