var Ocean;
(function (Ocean) {
    var Texture = (function () {
        function Texture(gl, size) {
            this.gl = gl;
            this.size = size;
            this.lambda = 0.8;
            this.displacementTexture = this.gl.createTexture();
            this.normalTextures = this.gl.createTexture();
            this.plot = new Ocean.Plot("spacial", 64);
        }
        Texture.prototype.texture = function (array0, array1, array2) {
            var dataArray = [];
            var k = 0, h = 0;
            var signs = [1.0, -1.0];
            for (var i = 0; i < this.size; i++) {
                for (var j = 0; j < this.size; j++) {
                    var sign = signs[(i + j) & 1];
                    dataArray[k] = array0[i][j] * (this.lambda) * sign;
                    dataArray[k + 1] = array1[i][j] * sign;
                    dataArray[k + 2] = array2[i][j] * (this.lambda) * sign;
                    dataArray[k + 3] = 1.0;
                    this.plot.imagedata.data[h] = dataArray[k] * 255.0 * 10;
                    this.plot.imagedata.data[h + 1] = dataArray[k + 1] * 255.0 * 10;
                    this.plot.imagedata.data[h + 2] = dataArray[k + 2] * 255.0 * 10;
                    this.plot.imagedata.data[h + 3] = 255.0;
                    h += 4;
                    k += 4;
                }
            }
            this.plot.load();
            return this.createTexturefromData(dataArray);
        };
        Texture.prototype.createTexturefromData = function (dataArray) {
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.displacementTexture);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_LINEAR);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR_MIPMAP_LINEAR);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
            this.gl.generateMipmap(this.gl.TEXTURE_2D);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.size, this.size, 0, this.gl.RGBA, this.gl.FLOAT, new Float32Array(dataArray));
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);
            return this;
        };
        Texture.prototype.createTexture = function (callback) {
            var _this = this;
            var image = new Image(512, 512);
            var texture = this.gl.createTexture();
            image.addEventListener("load", function () {
                _this.gl.bindTexture(_this.gl.TEXTURE_2D, texture);
                _this.gl.texParameteri(_this.gl.TEXTURE_2D, _this.gl.TEXTURE_MIN_FILTER, _this.gl.LINEAR_MIPMAP_LINEAR);
                _this.gl.texParameteri(_this.gl.TEXTURE_2D, _this.gl.TEXTURE_MAG_FILTER, _this.gl.LINEAR_MIPMAP_LINEAR);
                _this.gl.texParameteri(_this.gl.TEXTURE_2D, _this.gl.TEXTURE_WRAP_S, _this.gl.CLAMP_TO_EDGE);
                _this.gl.texParameteri(_this.gl.TEXTURE_2D, _this.gl.TEXTURE_WRAP_T, _this.gl.CLAMP_TO_EDGE);
                _this.gl.texImage2D(_this.gl.TEXTURE_2D, 0, _this.gl.RGBA, _this.gl.RGBA, _this.gl.UNSIGNED_BYTE, image);
                _this.gl.bindTexture(_this.gl.TEXTURE_2D, null);
                callback(texture);
            }, false);
            image.src = "images/Skybox2.jpg";
        };
        return Texture;
    }());
    Ocean.Texture = Texture;
})(Ocean || (Ocean = {}));
