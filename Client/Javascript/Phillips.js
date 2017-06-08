var Ocean;
(function (Ocean) {
    var Phillips = (function () {
        function Phillips(gl, size) {
            this.size = size;
            this.gl = gl;
            this.length = 1100.0;
            this.windspeed = 25.0;
            this.windX = -2.0;
            this.windY = -0.5;
            this.A = 0.0001;
            this.g = 9.81;
            this.maxh = 0.0;
        }
        Phillips.prototype.createH0 = function () {
            var result = [];
            var k = 0;
            var plot = new Ocean.Plot("spectrum", 64);
            var max = 0.0;
            for (var i = 0; i < this.size; i++) {
                result[i] = [];
                for (var j = 0; j < this.size; j++) {
                    var parameter = {
                        g: this.g,
                        A: this.A,
                        windSpeed: this.windspeed,
                        windX: this.windX,
                        windY: this.windY,
                        Kx: 2.0 * Math.PI * (i - this.size / 2.0) / this.length,
                        Ky: 2.0 * Math.PI * (j - this.size / 2.0) / this.length
                    };
                    var spec = this.spectrum(parameter);
                    var h0 = this.calculateH0(spec);
                    result[i][j] = h0;
                    plot.imagedata.data[k] = spec * 255;
                    plot.imagedata.data[k + 1] = spec * 255;
                    plot.imagedata.data[k + 2] = spec * 255;
                    plot.imagedata.data[k + 3] = 255.0;
                    k += 4;
                }
            }
            plot.load();
            return result;
        };
        Phillips.prototype.createH1 = function () {
            var result = [];
            for (var i = 0; i < this.size; i++) {
                result[i] = [];
                for (var j = 0; j < this.size; j++) {
                    var parameter = {
                        g: this.g,
                        A: this.A,
                        windSpeed: this.windspeed,
                        windX: this.windX,
                        windY: this.windY,
                        Kx: 2.0 * Math.PI * (-i - this.size / 2.0) / this.length,
                        Ky: 2.0 * Math.PI * (-j - this.size / 2.0) / this.length
                    };
                    var h0 = Ocean.Complex.Conj(this.calculateH0(this.spectrum(parameter)));
                    result[i][j] = Ocean.Complex.Conj(this.calculateH0(this.spectrum(parameter)));
                }
            }
            return result;
        };
        Phillips.prototype.update = function (time, h0, h1) {
            var plot = new Ocean.Plot("hu", 64);
            var result = { h: [], z: [], x: [] };
            var Kx, Ky = 0;
            var k = 0;
            for (var i = 0; i < this.size; i++) {
                result.h[i] = [];
                result.z[i] = [];
                result.x[i] = [];
                var h = new Ocean.Complex(0.0, 0.0);
                for (var j = 0; j < this.size; j++) {
                    Kx = 2.0 * Math.PI * (i - this.size / 2.0) / this.length;
                    Ky = 2.0 * Math.PI * (j - this.size / 2.0) / this.length;
                    var KK = Math.sqrt(Kx * Kx + Ky * Ky);
                    var omega = Math.sqrt(9.81 * KK);
                    var polar = Ocean.Complex.Polar(1.0, omega * time);
                    var h0t = Ocean.Complex.mult(h0[i][j], polar);
                    var h1t = Ocean.Complex.mult(h1[i][j], Ocean.Complex.Conj(polar));
                    var htilde = Ocean.Complex.add(h0t, h1t);
                    var imaginarydoth = Ocean.Complex.mult(new Ocean.Complex(0, 1.0), htilde);
                    var x = Ocean.Complex.multScalar(imaginarydoth, Kx / KK);
                    var z = Ocean.Complex.multScalar(imaginarydoth, Ky / KK);
                    plot.imagedata.data[k] = x.x * 255.0;
                    plot.imagedata.data[k + 1] = htilde.x * 255.0;
                    plot.imagedata.data[k + 2] = z.x * 255.0;
                    plot.imagedata.data[k + 3] = 255.0;
                    k += 4;
                    result.h[i][j] = htilde;
                    result.z[i][j] = z;
                    result.x[i][j] = x;
                }
            }
            plot.load();
            return result;
        };
        Phillips.prototype.spectrum = function (parameter) {
            var knormalized = Math.sqrt(parameter.Kx * parameter.Kx + parameter.Ky * parameter.Ky);
            if (knormalized < 0.000001)
                knormalized = 0.0;
            var wlength = Math.sqrt(parameter.windX * parameter.windX + parameter.windY * parameter.windY);
            var L = parameter.windSpeed * parameter.windSpeed * wlength / parameter.g;
            var kx = parameter.Kx / knormalized;
            var ky = parameter.Ky / knormalized;
            var windkdot = kx * parameter.windX / wlength + ky * parameter.windY / wlength;
            if (windkdot == 0.0)
                return 0.0;
            var result = Math.exp(-knormalized * knormalized * 0.00001 * 0.00001) * parameter.A / (knormalized * knormalized * knormalized * knormalized) * Math.exp(-1.0 / (knormalized * knormalized * L * L))
                * windkdot * windkdot;
            return result;
        };
        Phillips.prototype.calculateH0 = function (input) {
            var t = this.randomBM();
            return new Ocean.Complex(1.0 / Math.sqrt(2.0) * this.randomBM() * Math.sqrt(input), 1.0 / Math.sqrt(2.0) * this.randomBM() * Math.sqrt(input));
        };
        Phillips.prototype.randomBM = function () {
            var u = 1.0 - Math.random();
            var v = 1.0 - Math.random();
            return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        };
        return Phillips;
    }());
    Ocean.Phillips = Phillips;
})(Ocean || (Ocean = {}));
