var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Ocean;
(function (Ocean) {
    var FFT = (function () {
        function FFT(size) {
            this.size = size;
        }
        FFT.prototype.Inverse = function (input) {
            var transform = [];
            for (var i = 0; i < input.length; i++) {
                input[i] = Ocean.Complex.Conj(input[i]);
            }
            transform = this.Forward(input);
            for (var i = 0; i < input.length; i++) {
                transform[i] = Ocean.Complex.Conj(transform[i]);
            }
            return transform;
        };
        FFT.prototype.Forward = function (input) {
            var result = new Array(input.length);
            var omega = (-2.0 * Math.PI) / input.length;
            if (input.length <= 1) {
                result[0] = input[0];
                if (isNaN(input[0].x) || isNaN(input[0].y)) {
                    result[0] = new Ocean.Complex(0.0, 0.0);
                    input[0] = result[0];
                }
                return result;
            }
            var evenInput = new Array(input.length / 2);
            var oddInput = new Array(input.length / 2);
            for (var k = 0; k < input.length / 2; k++) {
                evenInput[k] = input[2 * k];
                oddInput[k] = input[2 * k + 1];
            }
            var even = this.Forward(evenInput);
            var odd = this.Forward(oddInput);
            for (var k = 0; k < input.length / 2; k++) {
                var polar = Ocean.Complex.Polar(1.0, omega * (k));
                odd[k] = Ocean.Complex.mult(odd[k], polar);
            }
            for (var k = 0; k < input.length / 2; k++) {
                result[k] = Ocean.Complex.add(even[k], odd[k]);
                result[k + input.length / 2] = Ocean.Complex.substract(even[k], odd[k]);
            }
            return result;
        };
        return FFT;
    }());
    Ocean.FFT = FFT;
    var FFT2D = (function (_super) {
        __extends(FFT2D, _super);
        function FFT2D(size) {
            return _super.call(this, size) || this;
        }
        FFT2D.prototype.Inverse2D = function (inputComplex) {
            var p = [];
            var f = [];
            var t = [];
            var floatImage = [];
            for (var l = 0; l < this.size; l++) {
                p[l] = _super.prototype.Inverse.call(this, inputComplex[l]);
            }
            for (var l = 0; l < this.size; l++) {
                t[l] = new Array(this.size);
                for (var k = 0; k < this.size; k++) {
                    t[l][k] = Ocean.Complex.divideScalar(p[k][l], this.size * this.size);
                }
                f[l] = _super.prototype.Inverse.call(this, t[l]);
            }
            for (var k = 0; k < this.size; k++) {
                floatImage[k] = [];
                for (var l = 0; l < this.size; l++) {
                    floatImage[k][l] = f[k][l].x;
                }
            }
            return floatImage;
        };
        return FFT2D;
    }(FFT));
    Ocean.FFT2D = FFT2D;
})(Ocean || (Ocean = {}));
