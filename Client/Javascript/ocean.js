var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
//MIT License
//Copyright (c) 2016 Frederic Dumont
//Permission is hereby granted, free of charge, to any person obtaining a copy
//of this software and associated documentation files (the "Software"), to deal
//in the Software without restriction, including without limitation the rights
//to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//copies of the Software, and to permit persons to whom the Software is
//furnished to do so, subject to the following conditions:
//The above copyright notice and this permission notice shall be included in all
//copies or substantial portions of the Software.
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//SOFTWARE. 
var Ocean;
(function (Ocean) {
    var Buffer = (function () {
        function Buffer(gl) {
            this.gl = gl;
            this.program = gl.createProgram();
            this.offsetBuffer = gl.createBuffer();
            this.vertexBuffer = gl.createBuffer();
            this.indexBuffer = gl.createBuffer();
        }
        Buffer.prototype.update = function (vertices) {
            this.gl.useProgram(this.program);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
            this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, new Float32Array(vertices));
            this.program.vertexPositionAttribute = this.gl.getAttribLocation(this.program, "position");
            this.gl.enableVertexAttribArray(this.program.vertexPositionAttribute);
            this.gl.useProgram(null);
        };
        Buffer.prototype.createProgram = function (vShaderId, fShaderId, isOcean) {
            var vshaderScript = document.getElementById(vShaderId);
            var fshaderScript = document.getElementById(fShaderId);
            var vShader = this.gl.createShader(this.gl.VERTEX_SHADER);
            this.gl.shaderSource(vShader, vshaderScript.textContent);
            this.gl.compileShader(vShader);
            var fShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
            this.gl.shaderSource(fShader, fshaderScript.textContent);
            this.gl.compileShader(fShader);
            this.gl.attachShader(this.program, vShader);
            this.gl.attachShader(this.program, fShader);
            var vshaderError = this.gl.getShaderInfoLog(vShader);
            var fshaderError = this.gl.getShaderInfoLog(fShader);
            console.log(vshaderError);
            console.log(fshaderError);
            this.gl.linkProgram(this.program);
            var error = this.gl.getProgramInfoLog(this.program);
            this.gl.useProgram(this.program);
            if (isOcean) {
                this.program.time = this.gl.getUniformLocation(this.program, "time");
                this.program.spectrum = this.gl.getUniformLocation(this.program, "displacement");
                this.program.reflection = this.gl.getUniformLocation(this.program, "reflectionSampler");
                this.program.refraction = this.gl.getUniformLocation(this.program, "refractionSampler");
            }
            else {
                this.program.texture = this.gl.getUniformLocation(this.program, "texture");
                this.program.clipPlane = this.gl.getUniformLocation(this.program, "clipplane");
                this.program.isclipped = this.gl.getUniformLocation(this.program, "isclipped");
            }
            this.program.cameraPosition = this.gl.getUniformLocation(this.program, "cameraPosition");
            this.program.texcoord = this.gl.getAttribLocation(this.program, "texCoord");
            this.program.vertexPositionAttribute = this.gl.getAttribLocation(this.program, "position");
            this.program.projectionMatrix = this.gl.getUniformLocation(this.program, "projMatrix");
            this.program.viewMatrixMatrix = this.gl.getUniformLocation(this.program, "viewMatrix");
            this.program.invViewMatrix = this.gl.getUniformLocation(this.program, "invViewMatrix");
            this.program.invProjMatrix = this.gl.getUniformLocation(this.program, "invProjMatrix");
            this.program.birdviewMatrix = this.gl.getUniformLocation(this.program, "birdviewMatrix");
            this.gl.useProgram(null);
        };
        return Buffer;
    }());
    Ocean.Buffer = Buffer;
})(Ocean || (Ocean = {}));
var Ocean;
(function (Ocean) {
    var chunck = (function (_super) {
        __extends(chunck, _super);
        function chunck(gl, size) {
            _super.call(this, gl);
            this.gl = gl;
            this.size = size;
            this.indices = [];
            this.vertices = [];
            this.clipPlane = [];
            _super.prototype.createProgram.call(this, 'vertexShader', 'fragmentShader', true);
        }
        chunck.prototype.update = function () {
            _super.prototype.update.call(this, this.vertices);
        };
        chunck.prototype.create = function () {
            var k = 0, n = 0;
            for (var i = 0; i < this.size + 1; i++) {
                for (var j = 0; j < this.size + 1; j++) {
                    this.vertices[k] = -1 + 2 * i / (this.size);
                    this.vertices[k + 1] = 0.0;
                    this.vertices[k + 2] = -1 + 2 * j / (this.size);
                    k += 3;
                }
            }
            for (var i = 0; i < this.size; i++) {
                for (var j = 0; j < this.size; j++) {
                    this.indices[n] = i + j * (this.size + 1);
                    this.indices[n + 1] = i + 1 + j * (this.size + 1);
                    this.indices[n + 2] = i + (j + 1) * (this.size + 1);
                    this.indices[n + 3] = i + (j + 1) * (this.size + 1);
                    this.indices[n + 4] = i + 1 + j * (this.size + 1);
                    this.indices[n + 5] = i + 1 + (j + 1) * (this.size + 1);
                    n += 6;
                }
            }
            this.gl.useProgram(this.program);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(this.indices), this.gl.DYNAMIC_DRAW);
            this.gl.useProgram(null);
        };
        chunck.prototype.Draw = function (ext, wireframe, camera, projMatrix, viewMatrix, reflection, displacement, refraction, invProj, invView, birdviewMatrix) {
            this.gl.useProgram(this.program);
            //camera position, up vector, lookAt
            this.gl.uniform3f(this.program.cameraPosition, camera.position[0], camera.position[1], camera.position[2]);
            this.gl.uniform3f(this.program.upVector, camera.up[0], camera.up[1], camera.up[2]);
            this.gl.uniform3f(this.program.lookAt, camera.lookAt[0], camera.lookAt[1], camera.lookAt[2]);
            this.gl.uniformMatrix4fv(this.program.invViewMatrix, false, invView);
            this.gl.uniformMatrix4fv(this.program.invProjMatrix, false, invProj);
            this.gl.uniformMatrix4fv(this.program.projectionMatrix, false, projMatrix);
            this.gl.uniformMatrix4fv(this.program.viewMatrixMatrix, false, viewMatrix);
            this.gl.uniformMatrix4fv(this.program.birdviewMatrix, false, birdviewMatrix);
            this.gl.bindTexture(this.gl.TEXTURE_2D, displacement.displacementTexture);
            this.gl.activeTexture(this.gl.TEXTURE0 + 1);
            this.gl.uniform1i(this.program.reflection, 1);
            this.gl.bindTexture(this.gl.TEXTURE_2D, reflection.texture);
            this.gl.activeTexture(this.gl.TEXTURE0 + 2);
            this.gl.uniform1i(this.program.reflection, 2);
            //LOAD OCEAN GRID
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
            this.gl.enableVertexAttribArray(this.program.vertexPositionAttribute);
            this.gl.vertexAttribPointer(this.program.vertexPositionAttribute, 3, this.gl.FLOAT, false, 0, 0);
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            this.gl.drawElements(wireframe, this.indices.length, this.gl.UNSIGNED_INT, 0);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
            this.gl.disable(this.gl.BLEND);
            this.gl.useProgram(null);
        };
        return chunck;
    }(Ocean.Buffer));
    Ocean.chunck = chunck;
})(Ocean || (Ocean = {}));
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
            _super.call(this, size);
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
var Ocean;
(function (Ocean) {
    var Engine = (function () {
        function Engine(gl, canvas, wireframe) {
            this.gl = gl;
            this.canvas = canvas;
            this.projMatrix = mat4.create();
            this.viewMatrix = mat4.create();
            this.birdViewMatrix = mat4.create();
            this.invProj = mat4.create();
            this.invView = mat4.create();
            this.chunck = new Ocean.chunck(gl, 512);
            this.interval = 1.0;
            this.ext = this.gl.getExtension("ANGLE_instanced_arrays");
            this.floatExtension = this.gl.getExtension("OES_texture_float");
            this.gl.getExtension("OES_texture_float_linear");
            this.gl.getExtension("EXT_color_buffer_float");
            this.Phillips = new Ocean.Phillips(this.gl, 64);
            this.h0 = this.Phillips.createH0();
            this.h1 = this.Phillips.createH1();
            this.fft = new Ocean.FFT2D(64);
            this.frameNumber = 0;
            this.wireframe = wireframe;
            this.skybox = new Ocean.SkyBox(gl, 100);
            this.reflection = new Ocean.FrameBuffer(window.innerWidth, window.innerHeight, this.gl);
            this.camera = new Ocean.Camera(vec3.create([26, 2, 326]), vec3.create([26.417, 2, 325.4]), vec3.create([0, 1, 0]));
            this.birdCamera = new Ocean.Camera(vec3.create([26, 140, 400.0]), vec3.create([26.417, 131.32, 325.4]), vec3.create([0, 1, 0]));
            this.displacementTexture = new Ocean.Texture(this.gl, 64);
        }
        Engine.prototype.load = function () {
            this.gl.getExtension('OES_element_index_uint');
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
            this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
            this.gl.clearDepth(1);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.skybox.create();
            this.chunck.create();
            this.reflection.CreateFrameBuffer();
        };
        Engine.prototype.generateWaves = function () {
            var _this = this;
            this.frameNumber = window.requestAnimationFrame(function () {
                _this.interval += 1.0 / 6.0;
                var spectrum = _this.Phillips.update(_this.interval, _this.h0, _this.h1);
                var h = _this.fft.Inverse2D(spectrum.h);
                var x = _this.fft.Inverse2D(spectrum.x);
                var z = _this.fft.Inverse2D(spectrum.z);
                _this.displacementTexture.texture(x, h, z);
                _this.render();
            });
        };
        Engine.prototype.render = function () {
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            var text = document.getElementById("camera-height");
            text.value = this.camera.position[1];
            var reflectionMatrix = mat4.create([1.0, 0.0, 0.0, 0.0,
                0.0, -1.0, 0.0, 0.0,
                0.0, 0.0, 1.0, 0.0,
                0.0, 0.0, 0.0, 1.0]);
            var reflView = mat4.create();
            mat4.multiply(this.viewMatrix, reflectionMatrix, reflView);
            //REFLECTION FRAMEBUFFER RENDERING
            this.reflection.BeginRenderframeBuffer();
            this.skybox.render(this.projMatrix, reflView, true, false);
            this.reflection.EndRenderBuffer();
            //REST OF SCENE
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            this.skybox.render(this.projMatrix, this.viewMatrix, false, false);
            this.generateWaves();
            mat4.perspective(55.0, 1.0, 0.1, 4000.0, this.projMatrix);
            mat4.perspective(65.0, 1.0, 0.01, 4000.0, this.invProj);
            mat4.lookAt(this.camera.position, this.camera.lookAt, this.camera.up, this.viewMatrix);
            mat4.inverse(this.viewMatrix, this.invView);
            mat4.inverse(this.invProj, this.invProj);
            this.chunck.Draw(this.ext, this.wireframe, this.camera, this.projMatrix, this.viewMatrix, this.reflection, this.displacementTexture, this.refraction, this.invProj, this.invView, this.birdViewMatrix);
        };
        return Engine;
    }());
    Ocean.Engine = Engine;
})(Ocean || (Ocean = {}));
window.onload = function () {
    var canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var gl = canvas.getContext('webgl2', { antialias: true });
    var engine = new Ocean.Engine(gl, canvas, gl.TRIANGLES);
    engine.load();
    engine.render();
    var choppiness = document.getElementById("choppiness");
    var wireframeButton = document.getElementById("wireframe");
    wireframeButton.onchange = function (e) {
        if (engine.wireframe === gl.TRIANGLES) {
            engine.wireframe = gl.LINES;
        }
        else {
            engine.wireframe = gl.TRIANGLES;
        }
    };
    choppiness.oninput = function (e) {
        engine.displacementTexture.lambda = parseInt(e.target.value) / 10;
    };
    document.onkeydown = function (e) {
        switch (e.which) {
            case 87:
                {
                    if (engine.wireframe === gl.TRIANGLES) {
                        engine.wireframe = gl.LINES;
                    }
                    else {
                        engine.wireframe = gl.TRIANGLES;
                    }
                    break;
                }
            case 39:
                {
                    engine.camera.lookRight();
                    break;
                }
            case 37:
                {
                    engine.camera.lookLeft();
                    break;
                }
            case 38:
                {
                    engine.camera.moveForward();
                    break;
                }
            case 40:
                {
                    engine.camera.moveBackward();
                    break;
                }
            case 90:
                {
                    engine.camera.moveDown();
                    break;
                }
            case 65:
                {
                    engine.camera.moveUp();
                    break;
                }
            case 83:
                {
                    engine.camera.lookDown();
                    break;
                }
            case 88:
                {
                    engine.camera.lookUp();
                    break;
                }
        }
    };
};
var Ocean;
(function (Ocean) {
    var Phillips = (function () {
        function Phillips(gl, size) {
            this.size = size;
            this.gl = gl;
            this.length = 900.0;
            this.windspeed = 50.0;
            this.windX = -0.5;
            this.windY = -0.5;
            this.A = 0.0001;
            this.g = 9.81;
        }
        Phillips.prototype.createH0 = function () {
            var result = [];
            var k = 0;
            var plot = new Ocean.Plot("spectrum", 64);
            for (var i = 0; i < this.size * 2; i++) {
                result[i] = [];
                for (var j = 0; j < this.size * 2; j++) {
                    var parameter = {
                        g: this.g,
                        A: this.A,
                        windSpeed: this.windspeed,
                        windX: this.windX,
                        windY: this.windY,
                        Kx: 2.0 * Math.PI * (i - this.size / 2.0) / this.length,
                        Ky: 2.0 * Math.PI * (j - this.size / 2.0) / this.length,
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
            for (var i = 0; i < this.size * 2; i++) {
                result[i] = [];
                for (var j = 0; j < this.size * 2; j++) {
                    var parameter = {
                        g: this.g,
                        A: this.A,
                        windSpeed: this.windspeed,
                        windX: this.windX,
                        windY: this.windY,
                        Kx: 2.0 * Math.PI * (-i - this.size / 2.0) / this.length,
                        Ky: 2.0 * Math.PI * (-j - this.size / 2.0) / this.length,
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
            var result = parameter.A / (knormalized * knormalized * knormalized * knormalized) * Math.exp(-1.0 / (knormalized * knormalized * L * L))
                * windkdot * windkdot * windkdot * windkdot;
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
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA32F, this.size, this.size, 0, this.gl.RGBA, this.gl.FLOAT, new Float32Array(dataArray));
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);
            return this;
        };
        Texture.prototype.createTexture = function (callback) {
            /*let image = new Image(512,512);
            let texture = this.gl.createTexture();

            

            image.addEventListener("load", ()=>{
               
               this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
               
               this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_LINEAR);
               this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR_MIPMAP_LINEAR);
               this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
               this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
               
               
               this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA,  this.gl.RGBA, this.gl.UNSIGNED_BYTE,<HTMLImageElement> image);

               this.gl.bindTexture(this.gl.TEXTURE_2D, null);
               callback(texture);

            }, false);

            image.src = "images/Skybox2.jpg";*/
        };
        return Texture;
    }());
    Ocean.Texture = Texture;
})(Ocean || (Ocean = {}));
var Ocean;
(function (Ocean) {
    var SkyBox = (function (_super) {
        __extends(SkyBox, _super);
        function SkyBox(gl, size) {
            var _this = this;
            _super.call(this, gl);
            this.gl = gl;
            this.size = size;
            this.indices = [];
            new Ocean.Texture(this.gl, 512).createTexture(function (texture) {
                _this.texture = texture;
            });
            _super.prototype.createProgram.call(this, "skyBoxVertexShader", "skyBoxfragmentShader", false);
        }
        SkyBox.prototype.create = function () {
            var vertices = [-1, -1, -1, 0.25, 2.0 / 3.0,
                -1, -1, 1, 0.25, 1.0,
                1, -1, 1, 0.5, 1.0,
                1, -1, -1, 0.5, 2.0 / 3.0,
                -1, 1, -1, 0.25, 1.0 / 3.0,
                -1, 1, 1, 0.25, 0.0,
                1, 1, 1, 0.5, 0.0,
                1, 1, -1, 0.5, 1.0 / 3.0,
                -1, -1, -1, 0.25, 2.0 / 3.0,
                -1, 1, -1, 0.25, 1.0 / 3.0,
                1, 1, -1, 0.5, 1.0 / 3.0,
                1, -1, -1, 0.5, 2.0 / 3.0,
                -1, -1, 1, 1.0, 2.0 / 3.0,
                -1, 1, 1, 1.0, 1.0 / 3.0,
                1, 1, 1, 0.75, 1.0 / 3.0,
                1, -1, 1, 0.75, 2.0 / 3.0,
                1, -1, -1, 0.5, 2.0 / 3.0,
                1, 1, -1, 0.5, 1.0 / 3.0,
                1, 1, 1, 0.75, 1.0 / 3.0,
                1, -1, 1, 0.75, 2.0 / 3.0,
                -1, -1, -1, 0.25, 2.0 / 3.0,
                -1, 1, -1, 0.25, 1.0 / 3.0,
                -1, 1, 1, 0.0, 1.0 / 3.0,
                -1, -1, 1, 0.0, 2.0 / 3.0];
            this.indices = [0, 1, 2, 2, 3, 0,
                4, 5, 6, 6, 7, 4,
                8, 9, 10, 10, 11, 8,
                12, 13, 14, 14, 15, 12,
                16, 17, 18, 18, 19, 16,
                20, 21, 22, 22, 23, 20];
            this.gl.useProgram(this.program);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(this.indices), this.gl.STATIC_DRAW);
            this.gl.useProgram(null);
        };
        SkyBox.prototype.render = function (projMatrix, viewMatrix, isclipped, isReflection) {
            this.gl.useProgram(this.program);
            if (isReflection)
                this.gl.uniform4f(this.program.clipPlane, 0, 1, 0, 1.0);
            else
                this.gl.uniform4f(this.program.clipPlane, 0, -1, 0, 1.0);
            if (isclipped)
                this.gl.uniform1f(this.program.isclipped, 1.0);
            else
                this.gl.uniform1f(this.program.isclipped, 0.0);
            this.gl.uniformMatrix4fv(this.program.projectionMatrix, false, projMatrix);
            this.gl.uniformMatrix4fv(this.program.viewMatrixMatrix, false, viewMatrix);
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
            this.gl.enableVertexAttribArray(this.program.vertexPositionAttribute);
            this.gl.vertexAttribPointer(this.program.vertexPositionAttribute, 3, this.gl.FLOAT, false, 20, 0);
            this.gl.vertexAttribPointer(this.program.texcoord, 2, this.gl.FLOAT, false, 20, 12);
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            this.gl.depthMask(false);
            this.gl.drawElements(this.gl.TRIANGLES, this.indices.length, this.gl.UNSIGNED_BYTE, 0);
            this.gl.depthMask(true);
            this.gl.useProgram(null);
        };
        return SkyBox;
    }(Ocean.Buffer));
    Ocean.SkyBox = SkyBox;
})(Ocean || (Ocean = {}));
/*declare var mat4: any;
declare var vec3: any;

namespace Ocean
{
    export class Scene
    {
        gl: WebGLRenderingContext;
        canvas: HTMLCanvasElement;

        projMatrix: any;
        viewMatrix: any;

        frameNumber: number;
        skybox:SkyBox;
        ext: ANGLE_instanced_arrays;


        constructor(gl, canvas)
        {
            this.gl = gl;
            this.canvas = canvas;
            this.projMatrix = mat4.create();
            this.viewMatrix = mat4.create();

            this.frameNumber = 0;
            this.ext          = this.gl.getExtension("ANGLE_instanced_arrays");
            this.skybox = new SkyBox(gl, 100);
        }

        public load()
        {
            debugger;
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
            this.gl.clearColor(0.0, 0.3, 0.5, 1.0);

            this.gl.clearDepth(1);
            this.gl.enable(this.gl.DEPTH_TEST);

            mat4.perspective(65.0, 1.0, 0.1, 4000.0, this.projMatrix);
            mat4.lookAt(vec3.create([400,300,400]), vec3.create([0,0,0]), vec3.create([0,1,0]), this.viewMatrix);
            
            this.skybox.create();

        }

        public render()
        {
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

            this.skybox.render(this.projMatrix, this.viewMatrix);
            
            this.frameNumber = requestAnimationFrame(()=> {
                this.render();
            });
        }
    }
}

window.onload = () => {
   
    let canvas = <HTMLCanvasElement> document.getElementById('canvas');
    let gl     = <WebGLRenderingContext> canvas.getContext('webgl');

    var scene = new Ocean.Scene(gl, canvas);
    scene.load();
    scene.render();
}*/ 
var Ocean;
(function (Ocean) {
    var Camera = (function () {
        function Camera(position0, lookAt0, up0) {
            this.position = vec3.create(position0);
            this.lookAt = vec3.create(lookAt0);
            this.up = vec3.create(up0);
            this.angle = -1.035;
            this.pitch = 2.17;
            this.speed = 0.25;
        }
        Camera.prototype.moveForward = function () {
            vec3.add(this.position, [this.speed * Math.cos(this.angle) * Math.sin(this.pitch), this.speed * Math.cos(this.pitch), this.speed * Math.sin(this.angle) * Math.sin(this.pitch)], this.position);
            vec3.add(this.position, [Math.cos(this.angle) * Math.sin(this.pitch), Math.cos(this.pitch), Math.sin(this.angle) * Math.sin(this.pitch)], this.lookAt);
        };
        Camera.prototype.moveBackward = function () {
            vec3.add(this.position, [-this.speed * Math.cos(this.angle) * Math.sin(this.pitch), -this.speed * Math.cos(this.pitch), -this.speed * Math.sin(this.angle) * Math.sin(this.pitch)], this.position);
            vec3.add(this.position, [Math.cos(this.angle) * Math.sin(this.pitch), Math.cos(this.pitch), Math.sin(this.angle) * Math.sin(this.pitch)], this.lookAt);
        };
        Camera.prototype.moveUp = function () {
            vec3.add(this.position, [0, this.speed, 0], this.position);
            vec3.add(this.lookAt, [0, this.speed, 0], this.lookAt);
        };
        Camera.prototype.moveDown = function () {
            vec3.add(this.position, [0, -this.speed, 0], this.position);
            vec3.add(this.lookAt, [0, -this.speed, 0], this.lookAt);
        };
        Camera.prototype.lookRight = function () {
            this.angle += 0.05;
            vec3.add(this.position, [Math.cos(this.angle) * Math.sin(this.pitch), Math.cos(this.pitch), Math.sin(this.angle) * Math.sin(this.pitch)], this.lookAt);
        };
        Camera.prototype.lookLeft = function () {
            this.angle -= 0.05;
            vec3.add(this.position, [Math.cos(this.angle) * Math.sin(this.pitch), Math.cos(this.pitch), Math.sin(this.angle) * Math.sin(this.pitch)], this.lookAt);
        };
        Camera.prototype.lookUp = function () {
            this.pitch += 0.05;
            vec3.add(this.position, [Math.cos(this.angle) * Math.sin(this.pitch), Math.cos(this.pitch), Math.sin(this.angle) * Math.sin(this.pitch)], this.lookAt);
        };
        Camera.prototype.lookDown = function () {
            this.pitch -= 0.05;
            vec3.add(this.position, [Math.cos(this.angle) * Math.sin(this.pitch), Math.cos(this.pitch), Math.sin(this.angle) * Math.sin(this.pitch)], this.lookAt);
        };
        Camera.prototype.invertPitch = function () {
            this.pitch = -this.pitch;
        };
        Camera.prototype.log = function () {
            console.log(this.position);
            console.log(this.lookAt);
            console.log(this.angle);
            console.log(this.pitch);
        };
        return Camera;
    }());
    Ocean.Camera = Camera;
})(Ocean || (Ocean = {}));
var Ocean;
(function (Ocean) {
    var Plot = (function () {
        function Plot(id, size) {
            this.canvas = document.createElement('canvas');
            this.canvas.width = 64;
            this.canvas.height = 64;
            this.img = document.getElementById(id);
            this.ctx = this.canvas.getContext('2d');
            this.imagedata = this.ctx.createImageData(size, size);
        }
        Plot.prototype.load = function () {
            this.ctx.putImageData(this.imagedata, 0, 0);
            this.ctx.scale(4.0, 4.0);
            var src = this.canvas.toDataURL("image/png");
            this.img.src = src;
        };
        return Plot;
    }());
    Ocean.Plot = Plot;
})(Ocean || (Ocean = {}));
var Ocean;
(function (Ocean) {
    var FrameBuffer = (function () {
        function FrameBuffer(width, height, gl) {
            this.width = width;
            this.height = height;
            this.distance = 0;
            this.gl = gl;
            this.texture = gl.createTexture();
            this.framBuffer = this.gl.createFramebuffer();
            this.renderbuffer = this.gl.createRenderbuffer();
        }
        FrameBuffer.prototype.InitEmptyTexture = function () {
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 512, 512, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
        };
        FrameBuffer.prototype.CreateFrameBuffer = function () {
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framBuffer);
            this.InitEmptyTexture();
            this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.renderbuffer);
            this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, 512, 512);
            this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.texture, 0);
            this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, this.renderbuffer);
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);
            this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        };
        FrameBuffer.prototype.BeginRenderframeBuffer = function () {
            this.gl.viewport(0, 0, 512, 512);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framBuffer);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        };
        FrameBuffer.prototype.EndRenderBuffer = function () {
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
            this.gl.viewport(0, 0, this.width, this.height);
        };
        return FrameBuffer;
    }());
    Ocean.FrameBuffer = FrameBuffer;
})(Ocean || (Ocean = {}));
// gl-matrix 1.3.7 - https://github.com/toji/gl-matrix/blob/master/LICENSE.md
(function (w, D) { "object" === typeof exports ? module.exports = D(global) : "function" === typeof define && define.amd ? define([], function () { return D(w); }) : D(w); })(this, function (w) {
    function D(a) { return o = a; }
    function G() { return o = "undefined" !== typeof Float32Array ? Float32Array : Array; }
    var E = {};
    (function () {
        if ("undefined" != typeof Float32Array) {
            var a = new Float32Array(1), b = new Int32Array(a.buffer);
            E.invsqrt = function (c) {
                a[0] = c;
                b[0] = 1597463007 - (b[0] >> 1);
                var d = a[0];
                return d * (1.5 - 0.5 * c * d * d);
            };
        }
        else
            E.invsqrt = function (a) {
                return 1 /
                    Math.sqrt(a);
            };
    })();
    var o = null;
    G();
    var r = {
        create: function (a) {
            var b = new o(3);
            a ? (b[0] = a[0], b[1] = a[1], b[2] = a[2]) : b[0] = b[1] = b[2] = 0;
            return b;
        },
        createFrom: function (a, b, c) {
            var d = new o(3);
            d[0] = a;
            d[1] = b;
            d[2] = c;
            return d;
        },
        set: function (a, b) {
            b[0] = a[0];
            b[1] = a[1];
            b[2] = a[2];
            return b;
        },
        equal: function (a, b) { return a === b || 1.0E-6 > Math.abs(a[0] - b[0]) && 1.0E-6 > Math.abs(a[1] - b[1]) && 1.0E-6 > Math.abs(a[2] - b[2]); },
        add: function (a, b, c) {
            if (!c || a === c)
                return a[0] += b[0], a[1] += b[1], a[2] += b[2], a;
            c[0] = a[0] + b[0];
            c[1] = a[1] + b[1];
            c[2] = a[2] + b[2];
            return c;
        },
        subtract: function (a, b, c) {
            if (!c || a === c)
                return a[0] -= b[0], a[1] -= b[1], a[2] -= b[2], a;
            c[0] = a[0] - b[0];
            c[1] = a[1] - b[1];
            c[2] = a[2] - b[2];
            return c;
        },
        multiply: function (a, b, c) {
            if (!c || a === c)
                return a[0] *= b[0], a[1] *= b[1], a[2] *= b[2], a;
            c[0] = a[0] * b[0];
            c[1] = a[1] * b[1];
            c[2] = a[2] * b[2];
            return c;
        },
        negate: function (a, b) {
            b || (b = a);
            b[0] = -a[0];
            b[1] = -a[1];
            b[2] = -a[2];
            return b;
        },
        scale: function (a, b, c) {
            if (!c || a === c)
                return a[0] *= b, a[1] *= b, a[2] *= b, a;
            c[0] = a[0] * b;
            c[1] = a[1] * b;
            c[2] = a[2] * b;
            return c;
        },
        normalize: function (a, b) {
            b || (b = a);
            var c = a[0], d = a[1], e = a[2], g = Math.sqrt(c * c + d * d + e * e);
            if (!g)
                return b[0] = 0, b[1] = 0, b[2] = 0, b;
            if (1 === g)
                return b[0] = c, b[1] = d, b[2] = e, b;
            g = 1 / g;
            b[0] = c * g;
            b[1] = d * g;
            b[2] = e * g;
            return b;
        },
        cross: function (a, b, c) {
            c || (c = a);
            var d = a[0], e = a[1], a = a[2], g = b[0], f = b[1], b = b[2];
            c[0] = e * b - a * f;
            c[1] = a * g - d * b;
            c[2] = d * f - e * g;
            return c;
        },
        length: function (a) {
            var b = a[0], c = a[1], a = a[2];
            return Math.sqrt(b * b + c * c + a * a);
        },
        squaredLength: function (a) {
            var b = a[0], c = a[1], a = a[2];
            return b * b + c * c + a * a;
        },
        dot: function (a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; },
        direction: function (a, b, c) {
            c || (c = a);
            var d = a[0] - b[0], e = a[1] - b[1], a = a[2] - b[2], b = Math.sqrt(d * d + e * e + a * a);
            if (!b)
                return c[0] = 0, c[1] = 0, c[2] = 0, c;
            b = 1 / b;
            c[0] = d * b;
            c[1] = e * b;
            c[2] = a * b;
            return c;
        },
        lerp: function (a, b, c, d) {
            d || (d = a);
            d[0] = a[0] + c * (b[0] - a[0]);
            d[1] = a[1] + c * (b[1] - a[1]);
            d[2] = a[2] + c * (b[2] - a[2]);
            return d;
        },
        dist: function (a, b) {
            var c = b[0] - a[0], d = b[1] - a[1], e = b[2] - a[2];
            return Math.sqrt(c * c + d * d + e * e);
        }
    }, H = null, y = new o(4);
    r.unproject = function (a, b, c, d, e) {
        e || (e = a);
        H || (H = x.create());
        var g = H;
        y[0] = 2 * (a[0] - d[0]) / d[2] - 1;
        y[1] = 2 * (a[1] - d[1]) / d[3] - 1;
        y[2] =
            2 * a[2] - 1;
        y[3] = 1;
        x.multiply(c, b, g);
        if (!x.inverse(g))
            return null;
        x.multiplyVec4(g, y);
        if (0 === y[3])
            return null;
        e[0] = y[0] / y[3];
        e[1] = y[1] / y[3];
        e[2] = y[2] / y[3];
        return e;
    };
    var L = r.createFrom(1, 0, 0), M = r.createFrom(0, 1, 0), N = r.createFrom(0, 0, 1), z = r.create();
    r.rotationTo = function (a, b, c) {
        c || (c = k.create());
        var d = r.dot(a, b);
        if (1 <= d)
            k.set(O, c);
        else if (-0.999999 > d)
            r.cross(L, a, z), 1.0E-6 > r.length(z) && r.cross(M, a, z), 1.0E-6 > r.length(z) && r.cross(N, a, z), r.normalize(z), k.fromAngleAxis(Math.PI, z, c);
        else {
            var d = Math.sqrt(2 * (1 +
                d)), e = 1 / d;
            r.cross(a, b, z);
            c[0] = z[0] * e;
            c[1] = z[1] * e;
            c[2] = z[2] * e;
            c[3] = 0.5 * d;
            k.normalize(c);
        }
        1 < c[3] ? c[3] = 1 : -1 > c[3] && (c[3] = -1);
        return c;
    };
    r.str = function (a) { return "[" + a[0] + ", " + a[1] + ", " + a[2] + "]"; };
    var A = {
        create: function (a) {
            var b = new o(9);
            a ? (b[0] = a[0], b[1] = a[1], b[2] = a[2], b[3] = a[3], b[4] = a[4], b[5] = a[5], b[6] = a[6], b[7] = a[7], b[8] = a[8]) : b[0] = b[1] = b[2] = b[3] = b[4] = b[5] = b[6] = b[7] = b[8] = 0;
            return b;
        },
        createFrom: function (a, b, c, d, e, g, f, h, j) {
            var i = new o(9);
            i[0] = a;
            i[1] = b;
            i[2] = c;
            i[3] = d;
            i[4] = e;
            i[5] = g;
            i[6] = f;
            i[7] = h;
            i[8] = j;
            return i;
        },
        determinant: function (a) {
            var b = a[3], c = a[4], d = a[5], e = a[6], g = a[7], f = a[8];
            return a[0] * (f * c - d * g) + a[1] * (-f * b + d * e) + a[2] * (g * b - c * e);
        },
        inverse: function (a, b) {
            var c = a[0], d = a[1], e = a[2], g = a[3], f = a[4], h = a[5], j = a[6], i = a[7], m = a[8], l = m * f - h * i, C = -m * g + h * j, q = i * g - f * j, n = c * l + d * C + e * q;
            if (!n)
                return null;
            n = 1 / n;
            b || (b = A.create());
            b[0] = l * n;
            b[1] = (-m * d + e * i) * n;
            b[2] = (h * d - e * f) * n;
            b[3] = C * n;
            b[4] = (m * c - e * j) * n;
            b[5] = (-h * c + e * g) * n;
            b[6] = q * n;
            b[7] = (-i * c + d * j) * n;
            b[8] = (f * c - d * g) * n;
            return b;
        },
        multiply: function (a, b, c) {
            c || (c = a);
            var d = a[0], e = a[1], g = a[2], f = a[3], h = a[4], j = a[5], i = a[6], m = a[7], a = a[8], l = b[0], C = b[1], q = b[2], n = b[3], k = b[4], p = b[5], o = b[6], s = b[7], b = b[8];
            c[0] = l * d + C * f + q * i;
            c[1] = l * e + C * h + q * m;
            c[2] = l * g + C * j + q * a;
            c[3] = n * d + k * f + p * i;
            c[4] = n * e + k * h + p * m;
            c[5] = n * g + k * j + p * a;
            c[6] = o * d + s * f + b * i;
            c[7] = o * e + s * h + b * m;
            c[8] = o * g + s * j + b * a;
            return c;
        },
        multiplyVec2: function (a, b, c) {
            c || (c = b);
            var d = b[0], b = b[1];
            c[0] = d * a[0] + b * a[3] + a[6];
            c[1] = d * a[1] + b * a[4] + a[7];
            return c;
        },
        multiplyVec3: function (a, b, c) {
            c || (c = b);
            var d = b[0], e = b[1], b = b[2];
            c[0] = d * a[0] + e * a[3] + b * a[6];
            c[1] = d * a[1] + e * a[4] + b * a[7];
            c[2] =
                d * a[2] + e * a[5] + b * a[8];
            return c;
        },
        set: function (a, b) {
            b[0] = a[0];
            b[1] = a[1];
            b[2] = a[2];
            b[3] = a[3];
            b[4] = a[4];
            b[5] = a[5];
            b[6] = a[6];
            b[7] = a[7];
            b[8] = a[8];
            return b;
        },
        equal: function (a, b) { return a === b || 1.0E-6 > Math.abs(a[0] - b[0]) && 1.0E-6 > Math.abs(a[1] - b[1]) && 1.0E-6 > Math.abs(a[2] - b[2]) && 1.0E-6 > Math.abs(a[3] - b[3]) && 1.0E-6 > Math.abs(a[4] - b[4]) && 1.0E-6 > Math.abs(a[5] - b[5]) && 1.0E-6 > Math.abs(a[6] - b[6]) && 1.0E-6 > Math.abs(a[7] - b[7]) && 1.0E-6 > Math.abs(a[8] - b[8]); },
        identity: function (a) {
            a || (a = A.create());
            a[0] = 1;
            a[1] = 0;
            a[2] = 0;
            a[3] = 0;
            a[4] = 1;
            a[5] = 0;
            a[6] = 0;
            a[7] = 0;
            a[8] = 1;
            return a;
        },
        transpose: function (a, b) {
            if (!b || a === b) {
                var c = a[1], d = a[2], e = a[5];
                a[1] = a[3];
                a[2] = a[6];
                a[3] = c;
                a[5] = a[7];
                a[6] = d;
                a[7] = e;
                return a;
            }
            b[0] = a[0];
            b[1] = a[3];
            b[2] = a[6];
            b[3] = a[1];
            b[4] = a[4];
            b[5] = a[7];
            b[6] = a[2];
            b[7] = a[5];
            b[8] = a[8];
            return b;
        },
        toMat4: function (a, b) {
            b || (b = x.create());
            b[15] = 1;
            b[14] = 0;
            b[13] = 0;
            b[12] = 0;
            b[11] = 0;
            b[10] = a[8];
            b[9] = a[7];
            b[8] = a[6];
            b[7] = 0;
            b[6] = a[5];
            b[5] = a[4];
            b[4] = a[3];
            b[3] = 0;
            b[2] = a[2];
            b[1] = a[1];
            b[0] = a[0];
            return b;
        },
        str: function (a) {
            return "[" + a[0] + ", " + a[1] +
                ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + "]";
        }
    }, x = {
        create: function (a) {
            var b = new o(16);
            a && (b[0] = a[0], b[1] = a[1], b[2] = a[2], b[3] = a[3], b[4] = a[4], b[5] = a[5], b[6] = a[6], b[7] = a[7], b[8] = a[8], b[9] = a[9], b[10] = a[10], b[11] = a[11], b[12] = a[12], b[13] = a[13], b[14] = a[14], b[15] = a[15]);
            return b;
        },
        createFrom: function (a, b, c, d, e, g, f, h, j, i, m, l, C, q, n, k) {
            var p = new o(16);
            p[0] = a;
            p[1] = b;
            p[2] = c;
            p[3] = d;
            p[4] = e;
            p[5] = g;
            p[6] = f;
            p[7] = h;
            p[8] = j;
            p[9] = i;
            p[10] = m;
            p[11] = l;
            p[12] = C;
            p[13] = q;
            p[14] = n;
            p[15] = k;
            return p;
        },
        set: function (a, b) {
            b[0] = a[0];
            b[1] = a[1];
            b[2] = a[2];
            b[3] = a[3];
            b[4] = a[4];
            b[5] = a[5];
            b[6] = a[6];
            b[7] = a[7];
            b[8] = a[8];
            b[9] = a[9];
            b[10] = a[10];
            b[11] = a[11];
            b[12] = a[12];
            b[13] = a[13];
            b[14] = a[14];
            b[15] = a[15];
            return b;
        },
        equal: function (a, b) {
            return a === b || 1.0E-6 > Math.abs(a[0] - b[0]) && 1.0E-6 > Math.abs(a[1] - b[1]) && 1.0E-6 > Math.abs(a[2] - b[2]) && 1.0E-6 > Math.abs(a[3] - b[3]) && 1.0E-6 > Math.abs(a[4] - b[4]) && 1.0E-6 > Math.abs(a[5] - b[5]) && 1.0E-6 > Math.abs(a[6] - b[6]) && 1.0E-6 > Math.abs(a[7] - b[7]) && 1.0E-6 > Math.abs(a[8] - b[8]) && 1.0E-6 > Math.abs(a[9] - b[9]) && 1.0E-6 >
                Math.abs(a[10] - b[10]) && 1.0E-6 > Math.abs(a[11] - b[11]) && 1.0E-6 > Math.abs(a[12] - b[12]) && 1.0E-6 > Math.abs(a[13] - b[13]) && 1.0E-6 > Math.abs(a[14] - b[14]) && 1.0E-6 > Math.abs(a[15] - b[15]);
        },
        identity: function (a) {
            a || (a = x.create());
            a[0] = 1;
            a[1] = 0;
            a[2] = 0;
            a[3] = 0;
            a[4] = 0;
            a[5] = 1;
            a[6] = 0;
            a[7] = 0;
            a[8] = 0;
            a[9] = 0;
            a[10] = 1;
            a[11] = 0;
            a[12] = 0;
            a[13] = 0;
            a[14] = 0;
            a[15] = 1;
            return a;
        },
        transpose: function (a, b) {
            if (!b || a === b) {
                var c = a[1], d = a[2], e = a[3], g = a[6], f = a[7], h = a[11];
                a[1] = a[4];
                a[2] = a[8];
                a[3] = a[12];
                a[4] = c;
                a[6] = a[9];
                a[7] = a[13];
                a[8] = d;
                a[9] = g;
                a[11] =
                    a[14];
                a[12] = e;
                a[13] = f;
                a[14] = h;
                return a;
            }
            b[0] = a[0];
            b[1] = a[4];
            b[2] = a[8];
            b[3] = a[12];
            b[4] = a[1];
            b[5] = a[5];
            b[6] = a[9];
            b[7] = a[13];
            b[8] = a[2];
            b[9] = a[6];
            b[10] = a[10];
            b[11] = a[14];
            b[12] = a[3];
            b[13] = a[7];
            b[14] = a[11];
            b[15] = a[15];
            return b;
        },
        determinant: function (a) {
            var b = a[0], c = a[1], d = a[2], e = a[3], g = a[4], f = a[5], h = a[6], j = a[7], i = a[8], m = a[9], l = a[10], C = a[11], q = a[12], n = a[13], k = a[14], a = a[15];
            return q * m * h * e - i * n * h * e - q * f * l * e + g * n * l * e + i * f * k * e - g * m * k * e - q * m * d * j + i * n * d * j + q * c * l * j - b * n * l * j - i * c * k * j + b * m * k * j + q * f * d * C - g * n * d * C - q * c * h * C + b * n * h * C +
                g * c * k * C - b * f * k * C - i * f * d * a + g * m * d * a + i * c * h * a - b * m * h * a - g * c * l * a + b * f * l * a;
        },
        inverse: function (a, b) {
            b || (b = a);
            var c = a[0], d = a[1], e = a[2], g = a[3], f = a[4], h = a[5], j = a[6], i = a[7], m = a[8], l = a[9], k = a[10], q = a[11], n = a[12], o = a[13], p = a[14], r = a[15], s = c * h - d * f, v = c * j - e * f, t = c * i - g * f, u = d * j - e * h, w = d * i - g * h, x = e * i - g * j, y = m * o - l * n, z = m * p - k * n, F = m * r - q * n, A = l * p - k * o, D = l * r - q * o, E = k * r - q * p, B = s * E - v * D + t * A + u * F - w * z + x * y;
            if (!B)
                return null;
            B = 1 / B;
            b[0] = (h * E - j * D + i * A) * B;
            b[1] = (-d * E + e * D - g * A) * B;
            b[2] = (o * x - p * w + r * u) * B;
            b[3] = (-l * x + k * w - q * u) * B;
            b[4] = (-f * E + j * F - i * z) * B;
            b[5] =
                (c * E - e * F + g * z) * B;
            b[6] = (-n * x + p * t - r * v) * B;
            b[7] = (m * x - k * t + q * v) * B;
            b[8] = (f * D - h * F + i * y) * B;
            b[9] = (-c * D + d * F - g * y) * B;
            b[10] = (n * w - o * t + r * s) * B;
            b[11] = (-m * w + l * t - q * s) * B;
            b[12] = (-f * A + h * z - j * y) * B;
            b[13] = (c * A - d * z + e * y) * B;
            b[14] = (-n * u + o * v - p * s) * B;
            b[15] = (m * u - l * v + k * s) * B;
            return b;
        },
        toRotationMat: function (a, b) {
            b || (b = x.create());
            b[0] = a[0];
            b[1] = a[1];
            b[2] = a[2];
            b[3] = a[3];
            b[4] = a[4];
            b[5] = a[5];
            b[6] = a[6];
            b[7] = a[7];
            b[8] = a[8];
            b[9] = a[9];
            b[10] = a[10];
            b[11] = a[11];
            b[12] = 0;
            b[13] = 0;
            b[14] = 0;
            b[15] = 1;
            return b;
        },
        toMat3: function (a, b) {
            b || (b = A.create());
            b[0] =
                a[0];
            b[1] = a[1];
            b[2] = a[2];
            b[3] = a[4];
            b[4] = a[5];
            b[5] = a[6];
            b[6] = a[8];
            b[7] = a[9];
            b[8] = a[10];
            return b;
        },
        toInverseMat3: function (a, b) {
            var c = a[0], d = a[1], e = a[2], g = a[4], f = a[5], h = a[6], j = a[8], i = a[9], m = a[10], l = m * f - h * i, k = -m * g + h * j, q = i * g - f * j, n = c * l + d * k + e * q;
            if (!n)
                return null;
            n = 1 / n;
            b || (b = A.create());
            b[0] = l * n;
            b[1] = (-m * d + e * i) * n;
            b[2] = (h * d - e * f) * n;
            b[3] = k * n;
            b[4] = (m * c - e * j) * n;
            b[5] = (-h * c + e * g) * n;
            b[6] = q * n;
            b[7] = (-i * c + d * j) * n;
            b[8] = (f * c - d * g) * n;
            return b;
        },
        multiply: function (a, b, c) {
            c || (c = a);
            var d = a[0], e = a[1], g = a[2], f = a[3], h = a[4], j = a[5], i = a[6], m = a[7], l = a[8], k = a[9], q = a[10], n = a[11], o = a[12], p = a[13], r = a[14], a = a[15], s = b[0], v = b[1], t = b[2], u = b[3];
            c[0] = s * d + v * h + t * l + u * o;
            c[1] = s * e + v * j + t * k + u * p;
            c[2] = s * g + v * i + t * q + u * r;
            c[3] = s * f + v * m + t * n + u * a;
            s = b[4];
            v = b[5];
            t = b[6];
            u = b[7];
            c[4] = s * d + v * h + t * l + u * o;
            c[5] = s * e + v * j + t * k + u * p;
            c[6] = s * g + v * i + t * q + u * r;
            c[7] = s * f + v * m + t * n + u * a;
            s = b[8];
            v = b[9];
            t = b[10];
            u = b[11];
            c[8] = s * d + v * h + t * l + u * o;
            c[9] = s * e + v * j + t * k + u * p;
            c[10] = s * g + v * i + t * q + u * r;
            c[11] = s * f + v * m + t * n + u * a;
            s = b[12];
            v = b[13];
            t = b[14];
            u = b[15];
            c[12] = s * d + v * h + t * l + u * o;
            c[13] = s * e + v * j + t * k + u * p;
            c[14] = s * g +
                v * i + t * q + u * r;
            c[15] = s * f + v * m + t * n + u * a;
            return c;
        },
        multiplyVec3: function (a, b, c) {
            c || (c = b);
            var d = b[0], e = b[1], b = b[2];
            c[0] = a[0] * d + a[4] * e + a[8] * b + a[12];
            c[1] = a[1] * d + a[5] * e + a[9] * b + a[13];
            c[2] = a[2] * d + a[6] * e + a[10] * b + a[14];
            return c;
        },
        multiplyVec4: function (a, b, c) {
            c || (c = b);
            var d = b[0], e = b[1], g = b[2], b = b[3];
            c[0] = a[0] * d + a[4] * e + a[8] * g + a[12] * b;
            c[1] = a[1] * d + a[5] * e + a[9] * g + a[13] * b;
            c[2] = a[2] * d + a[6] * e + a[10] * g + a[14] * b;
            c[3] = a[3] * d + a[7] * e + a[11] * g + a[15] * b;
            return c;
        },
        translate: function (a, b, c) {
            var d = b[0], e = b[1], b = b[2], g, f, h, j, i, m, l, k, q, n, o, p;
            if (!c || a === c)
                return a[12] = a[0] * d + a[4] * e + a[8] * b + a[12], a[13] = a[1] * d + a[5] * e + a[9] * b + a[13], a[14] = a[2] * d + a[6] * e + a[10] * b + a[14], a[15] = a[3] * d + a[7] * e + a[11] * b + a[15], a;
            g = a[0];
            f = a[1];
            h = a[2];
            j = a[3];
            i = a[4];
            m = a[5];
            l = a[6];
            k = a[7];
            q = a[8];
            n = a[9];
            o = a[10];
            p = a[11];
            c[0] = g;
            c[1] = f;
            c[2] = h;
            c[3] = j;
            c[4] = i;
            c[5] = m;
            c[6] = l;
            c[7] = k;
            c[8] = q;
            c[9] = n;
            c[10] = o;
            c[11] = p;
            c[12] = g * d + i * e + q * b + a[12];
            c[13] = f * d + m * e + n * b + a[13];
            c[14] = h * d + l * e + o * b + a[14];
            c[15] = j * d + k * e + p * b + a[15];
            return c;
        },
        scale: function (a, b, c) {
            var d = b[0], e = b[1], b = b[2];
            if (!c || a === c)
                return a[0] *=
                    d, a[1] *= d, a[2] *= d, a[3] *= d, a[4] *= e, a[5] *= e, a[6] *= e, a[7] *= e, a[8] *= b, a[9] *= b, a[10] *= b, a[11] *= b, a;
            c[0] = a[0] * d;
            c[1] = a[1] * d;
            c[2] = a[2] * d;
            c[3] = a[3] * d;
            c[4] = a[4] * e;
            c[5] = a[5] * e;
            c[6] = a[6] * e;
            c[7] = a[7] * e;
            c[8] = a[8] * b;
            c[9] = a[9] * b;
            c[10] = a[10] * b;
            c[11] = a[11] * b;
            c[12] = a[12];
            c[13] = a[13];
            c[14] = a[14];
            c[15] = a[15];
            return c;
        },
        rotate: function (a, b, c, d) {
            var e = c[0], g = c[1], c = c[2], f = Math.sqrt(e * e + g * g + c * c), h, j, i, m, l, k, q, n, o, p, r, s, v, t, u, w, x, y, z, A;
            if (!f)
                return null;
            1 !== f && (f = 1 / f, e *= f, g *= f, c *= f);
            h = Math.sin(b);
            j = Math.cos(b);
            i = 1 - j;
            b = a[0];
            f = a[1];
            m = a[2];
            l = a[3];
            k = a[4];
            q = a[5];
            n = a[6];
            o = a[7];
            p = a[8];
            r = a[9];
            s = a[10];
            v = a[11];
            t = e * e * i + j;
            u = g * e * i + c * h;
            w = c * e * i - g * h;
            x = e * g * i - c * h;
            y = g * g * i + j;
            z = c * g * i + e * h;
            A = e * c * i + g * h;
            e = g * c * i - e * h;
            g = c * c * i + j;
            d ? a !== d && (d[12] = a[12], d[13] = a[13], d[14] = a[14], d[15] = a[15]) : d = a;
            d[0] = b * t + k * u + p * w;
            d[1] = f * t + q * u + r * w;
            d[2] = m * t + n * u + s * w;
            d[3] = l * t + o * u + v * w;
            d[4] = b * x + k * y + p * z;
            d[5] = f * x + q * y + r * z;
            d[6] = m * x + n * y + s * z;
            d[7] = l * x + o * y + v * z;
            d[8] = b * A + k * e + p * g;
            d[9] = f * A + q * e + r * g;
            d[10] = m * A + n * e + s * g;
            d[11] = l * A + o * e + v * g;
            return d;
        },
        rotateX: function (a, b, c) {
            var d = Math.sin(b), b = Math.cos(b), e = a[4], g = a[5], f = a[6], h = a[7], j = a[8], i = a[9], m = a[10], l = a[11];
            c ? a !== c && (c[0] = a[0], c[1] = a[1], c[2] = a[2], c[3] = a[3], c[12] = a[12], c[13] = a[13], c[14] = a[14], c[15] = a[15]) : c = a;
            c[4] = e * b + j * d;
            c[5] = g * b + i * d;
            c[6] = f * b + m * d;
            c[7] = h * b + l * d;
            c[8] = e * -d + j * b;
            c[9] = g * -d + i * b;
            c[10] = f * -d + m * b;
            c[11] = h * -d + l * b;
            return c;
        },
        rotateY: function (a, b, c) {
            var d = Math.sin(b), b = Math.cos(b), e = a[0], g = a[1], f = a[2], h = a[3], j = a[8], i = a[9], m = a[10], l = a[11];
            c ? a !== c && (c[4] = a[4], c[5] = a[5], c[6] = a[6], c[7] = a[7], c[12] = a[12], c[13] = a[13], c[14] = a[14], c[15] =
                a[15]) : c = a;
            c[0] = e * b + j * -d;
            c[1] = g * b + i * -d;
            c[2] = f * b + m * -d;
            c[3] = h * b + l * -d;
            c[8] = e * d + j * b;
            c[9] = g * d + i * b;
            c[10] = f * d + m * b;
            c[11] = h * d + l * b;
            return c;
        },
        rotateZ: function (a, b, c) {
            var d = Math.sin(b), b = Math.cos(b), e = a[0], g = a[1], f = a[2], h = a[3], j = a[4], i = a[5], m = a[6], l = a[7];
            c ? a !== c && (c[8] = a[8], c[9] = a[9], c[10] = a[10], c[11] = a[11], c[12] = a[12], c[13] = a[13], c[14] = a[14], c[15] = a[15]) : c = a;
            c[0] = e * b + j * d;
            c[1] = g * b + i * d;
            c[2] = f * b + m * d;
            c[3] = h * b + l * d;
            c[4] = e * -d + j * b;
            c[5] = g * -d + i * b;
            c[6] = f * -d + m * b;
            c[7] = h * -d + l * b;
            return c;
        },
        frustum: function (a, b, c, d, e, g, f) {
            f ||
                (f = x.create());
            var h = b - a, j = d - c, i = g - e;
            f[0] = 2 * e / h;
            f[1] = 0;
            f[2] = 0;
            f[3] = 0;
            f[4] = 0;
            f[5] = 2 * e / j;
            f[6] = 0;
            f[7] = 0;
            f[8] = (b + a) / h;
            f[9] = (d + c) / j;
            f[10] = -(g + e) / i;
            f[11] = -1;
            f[12] = 0;
            f[13] = 0;
            f[14] = -(2 * g * e) / i;
            f[15] = 0;
            return f;
        },
        perspective: function (a, b, c, d, e) {
            a = c * Math.tan(a * Math.PI / 360);
            b *= a;
            return x.frustum(-b, b, -a, a, c, d, e);
        },
        ortho: function (a, b, c, d, e, g, f) {
            f || (f = x.create());
            var h = b - a, j = d - c, i = g - e;
            f[0] = 2 / h;
            f[1] = 0;
            f[2] = 0;
            f[3] = 0;
            f[4] = 0;
            f[5] = 2 / j;
            f[6] = 0;
            f[7] = 0;
            f[8] = 0;
            f[9] = 0;
            f[10] = -2 / i;
            f[11] = 0;
            f[12] = -(a + b) / h;
            f[13] = -(d + c) / j;
            f[14] = -(g + e) / i;
            f[15] = 1;
            return f;
        },
        lookAt: function (a, b, c, d) {
            d || (d = x.create());
            var e, g, f, h, j, i, m, l, k = a[0], o = a[1], a = a[2];
            f = c[0];
            h = c[1];
            g = c[2];
            m = b[0];
            c = b[1];
            e = b[2];
            if (k === m && o === c && a === e)
                return x.identity(d);
            b = k - m;
            c = o - c;
            m = a - e;
            l = 1 / Math.sqrt(b * b + c * c + m * m);
            b *= l;
            c *= l;
            m *= l;
            e = h * m - g * c;
            g = g * b - f * m;
            f = f * c - h * b;
            (l = Math.sqrt(e * e + g * g + f * f)) ? (l = 1 / l, e *= l, g *= l, f *= l) : f = g = e = 0;
            h = c * f - m * g;
            j = m * e - b * f;
            i = b * g - c * e;
            (l = Math.sqrt(h * h + j * j + i * i)) ? (l = 1 / l, h *= l, j *= l, i *= l) : i = j = h = 0;
            d[0] = e;
            d[1] = h;
            d[2] = b;
            d[3] = 0;
            d[4] = g;
            d[5] = j;
            d[6] = c;
            d[7] = 0;
            d[8] = f;
            d[9] =
                i;
            d[10] = m;
            d[11] = 0;
            d[12] = -(e * k + g * o + f * a);
            d[13] = -(h * k + j * o + i * a);
            d[14] = -(b * k + c * o + m * a);
            d[15] = 1;
            return d;
        },
        fromRotationTranslation: function (a, b, c) {
            c || (c = x.create());
            var d = a[0], e = a[1], g = a[2], f = a[3], h = d + d, j = e + e, i = g + g, a = d * h, m = d * j, d = d * i, k = e * j, e = e * i, g = g * i, h = f * h, j = f * j, f = f * i;
            c[0] = 1 - (k + g);
            c[1] = m + f;
            c[2] = d - j;
            c[3] = 0;
            c[4] = m - f;
            c[5] = 1 - (a + g);
            c[6] = e + h;
            c[7] = 0;
            c[8] = d + j;
            c[9] = e - h;
            c[10] = 1 - (a + k);
            c[11] = 0;
            c[12] = b[0];
            c[13] = b[1];
            c[14] = b[2];
            c[15] = 1;
            return c;
        },
        str: function (a) {
            return "[" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " +
                a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ", " + a[9] + ", " + a[10] + ", " + a[11] + ", " + a[12] + ", " + a[13] + ", " + a[14] + ", " + a[15] + "]";
        }
    }, k = {
        create: function (a) {
            var b = new o(4);
            a ? (b[0] = a[0], b[1] = a[1], b[2] = a[2], b[3] = a[3]) : b[0] = b[1] = b[2] = b[3] = 0;
            return b;
        },
        createFrom: function (a, b, c, d) {
            var e = new o(4);
            e[0] = a;
            e[1] = b;
            e[2] = c;
            e[3] = d;
            return e;
        },
        set: function (a, b) {
            b[0] = a[0];
            b[1] = a[1];
            b[2] = a[2];
            b[3] = a[3];
            return b;
        },
        equal: function (a, b) {
            return a === b || 1.0E-6 > Math.abs(a[0] - b[0]) && 1.0E-6 > Math.abs(a[1] - b[1]) && 1.0E-6 > Math.abs(a[2] - b[2]) && 1.0E-6 >
                Math.abs(a[3] - b[3]);
        },
        identity: function (a) {
            a || (a = k.create());
            a[0] = 0;
            a[1] = 0;
            a[2] = 0;
            a[3] = 1;
            return a;
        }
    }, O = k.identity();
    k.calculateW = function (a, b) {
        var c = a[0], d = a[1], e = a[2];
        if (!b || a === b)
            return a[3] = -Math.sqrt(Math.abs(1 - c * c - d * d - e * e)), a;
        b[0] = c;
        b[1] = d;
        b[2] = e;
        b[3] = -Math.sqrt(Math.abs(1 - c * c - d * d - e * e));
        return b;
    };
    k.dot = function (a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]; };
    k.inverse = function (a, b) {
        var c = a[0], d = a[1], e = a[2], g = a[3], c = (c = c * c + d * d + e * e + g * g) ? 1 / c : 0;
        if (!b || a === b)
            return a[0] *= -c, a[1] *= -c, a[2] *= -c, a[3] *=
                c, a;
        b[0] = -a[0] * c;
        b[1] = -a[1] * c;
        b[2] = -a[2] * c;
        b[3] = a[3] * c;
        return b;
    };
    k.conjugate = function (a, b) {
        if (!b || a === b)
            return a[0] *= -1, a[1] *= -1, a[2] *= -1, a;
        b[0] = -a[0];
        b[1] = -a[1];
        b[2] = -a[2];
        b[3] = a[3];
        return b;
    };
    k.length = function (a) {
        var b = a[0], c = a[1], d = a[2], a = a[3];
        return Math.sqrt(b * b + c * c + d * d + a * a);
    };
    k.normalize = function (a, b) {
        b || (b = a);
        var c = a[0], d = a[1], e = a[2], g = a[3], f = Math.sqrt(c * c + d * d + e * e + g * g);
        if (0 === f)
            return b[0] = 0, b[1] = 0, b[2] = 0, b[3] = 0, b;
        f = 1 / f;
        b[0] = c * f;
        b[1] = d * f;
        b[2] = e * f;
        b[3] = g * f;
        return b;
    };
    k.add = function (a, b, c) {
        if (!c ||
            a === c)
            return a[0] += b[0], a[1] += b[1], a[2] += b[2], a[3] += b[3], a;
        c[0] = a[0] + b[0];
        c[1] = a[1] + b[1];
        c[2] = a[2] + b[2];
        c[3] = a[3] + b[3];
        return c;
    };
    k.multiply = function (a, b, c) {
        c || (c = a);
        var d = a[0], e = a[1], g = a[2], a = a[3], f = b[0], h = b[1], j = b[2], b = b[3];
        c[0] = d * b + a * f + e * j - g * h;
        c[1] = e * b + a * h + g * f - d * j;
        c[2] = g * b + a * j + d * h - e * f;
        c[3] = a * b - d * f - e * h - g * j;
        return c;
    };
    k.multiplyVec3 = function (a, b, c) {
        c || (c = b);
        var d = b[0], e = b[1], g = b[2], b = a[0], f = a[1], h = a[2], a = a[3], j = a * d + f * g - h * e, i = a * e + h * d - b * g, k = a * g + b * e - f * d, d = -b * d - f * e - h * g;
        c[0] = j * a + d * -b + i * -h - k * -f;
        c[1] = i * a +
            d * -f + k * -b - j * -h;
        c[2] = k * a + d * -h + j * -f - i * -b;
        return c;
    };
    k.scale = function (a, b, c) {
        if (!c || a === c)
            return a[0] *= b, a[1] *= b, a[2] *= b, a[3] *= b, a;
        c[0] = a[0] * b;
        c[1] = a[1] * b;
        c[2] = a[2] * b;
        c[3] = a[3] * b;
        return c;
    };
    k.toMat3 = function (a, b) {
        b || (b = A.create());
        var c = a[0], d = a[1], e = a[2], g = a[3], f = c + c, h = d + d, j = e + e, i = c * f, k = c * h, c = c * j, l = d * h, d = d * j, e = e * j, f = g * f, h = g * h, g = g * j;
        b[0] = 1 - (l + e);
        b[1] = k + g;
        b[2] = c - h;
        b[3] = k - g;
        b[4] = 1 - (i + e);
        b[5] = d + f;
        b[6] = c + h;
        b[7] = d - f;
        b[8] = 1 - (i + l);
        return b;
    };
    k.toMat4 = function (a, b) {
        b || (b = x.create());
        var c = a[0], d = a[1], e = a[2], g = a[3], f = c + c, h = d + d, j = e + e, i = c * f, k = c * h, c = c * j, l = d * h, d = d * j, e = e * j, f = g * f, h = g * h, g = g * j;
        b[0] = 1 - (l + e);
        b[1] = k + g;
        b[2] = c - h;
        b[3] = 0;
        b[4] = k - g;
        b[5] = 1 - (i + e);
        b[6] = d + f;
        b[7] = 0;
        b[8] = c + h;
        b[9] = d - f;
        b[10] = 1 - (i + l);
        b[11] = 0;
        b[12] = 0;
        b[13] = 0;
        b[14] = 0;
        b[15] = 1;
        return b;
    };
    k.slerp = function (a, b, c, d) {
        d || (d = a);
        var e = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3], g, f;
        if (1 <= Math.abs(e))
            return d !== a && (d[0] = a[0], d[1] = a[1], d[2] = a[2], d[3] = a[3]), d;
        g = Math.acos(e);
        f = Math.sqrt(1 - e * e);
        if (0.001 > Math.abs(f))
            return d[0] = 0.5 * a[0] + 0.5 * b[0], d[1] = 0.5 * a[1] + 0.5 * b[1],
                d[2] = 0.5 * a[2] + 0.5 * b[2], d[3] = 0.5 * a[3] + 0.5 * b[3], d;
        e = Math.sin((1 - c) * g) / f;
        c = Math.sin(c * g) / f;
        d[0] = a[0] * e + b[0] * c;
        d[1] = a[1] * e + b[1] * c;
        d[2] = a[2] * e + b[2] * c;
        d[3] = a[3] * e + b[3] * c;
        return d;
    };
    k.fromRotationMatrix = function (a, b) {
        b || (b = k.create());
        var c = a[0] + a[4] + a[8], d;
        if (0 < c)
            d = Math.sqrt(c + 1), b[3] = 0.5 * d, d = 0.5 / d, b[0] = (a[7] - a[5]) * d, b[1] = (a[2] - a[6]) * d, b[2] = (a[3] - a[1]) * d;
        else {
            d = k.fromRotationMatrix.s_iNext = k.fromRotationMatrix.s_iNext || [1, 2, 0];
            c = 0;
            a[4] > a[0] && (c = 1);
            a[8] > a[3 * c + c] && (c = 2);
            var e = d[c], g = d[e];
            d = Math.sqrt(a[3 * c +
                c] - a[3 * e + e] - a[3 * g + g] + 1);
            b[c] = 0.5 * d;
            d = 0.5 / d;
            b[3] = (a[3 * g + e] - a[3 * e + g]) * d;
            b[e] = (a[3 * e + c] + a[3 * c + e]) * d;
            b[g] = (a[3 * g + c] + a[3 * c + g]) * d;
        }
        return b;
    };
    A.toQuat4 = k.fromRotationMatrix;
    (function () {
        var a = A.create();
        k.fromAxes = function (b, c, d, e) {
            a[0] = c[0];
            a[3] = c[1];
            a[6] = c[2];
            a[1] = d[0];
            a[4] = d[1];
            a[7] = d[2];
            a[2] = b[0];
            a[5] = b[1];
            a[8] = b[2];
            return k.fromRotationMatrix(a, e);
        };
    })();
    k.identity = function (a) {
        a || (a = k.create());
        a[0] = 0;
        a[1] = 0;
        a[2] = 0;
        a[3] = 1;
        return a;
    };
    k.fromAngleAxis = function (a, b, c) {
        c || (c = k.create());
        var a = 0.5 * a, d = Math.sin(a);
        c[3] = Math.cos(a);
        c[0] = d * b[0];
        c[1] = d * b[1];
        c[2] = d * b[2];
        return c;
    };
    k.toAngleAxis = function (a, b) {
        b || (b = a);
        var c = a[0] * a[0] + a[1] * a[1] + a[2] * a[2];
        0 < c ? (b[3] = 2 * Math.acos(a[3]), c = E.invsqrt(c), b[0] = a[0] * c, b[1] = a[1] * c, b[2] = a[2] * c) : (b[3] = 0, b[0] = 1, b[1] = 0, b[2] = 0);
        return b;
    };
    k.str = function (a) { return "[" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + "]"; };
    var J = {
        create: function (a) {
            var b = new o(2);
            a ? (b[0] = a[0], b[1] = a[1]) : (b[0] = 0, b[1] = 0);
            return b;
        },
        createFrom: function (a, b) {
            var c = new o(2);
            c[0] = a;
            c[1] = b;
            return c;
        },
        add: function (a, b, c) {
            c ||
                (c = b);
            c[0] = a[0] + b[0];
            c[1] = a[1] + b[1];
            return c;
        },
        subtract: function (a, b, c) {
            c || (c = b);
            c[0] = a[0] - b[0];
            c[1] = a[1] - b[1];
            return c;
        },
        multiply: function (a, b, c) {
            c || (c = b);
            c[0] = a[0] * b[0];
            c[1] = a[1] * b[1];
            return c;
        },
        divide: function (a, b, c) {
            c || (c = b);
            c[0] = a[0] / b[0];
            c[1] = a[1] / b[1];
            return c;
        },
        scale: function (a, b, c) {
            c || (c = a);
            c[0] = a[0] * b;
            c[1] = a[1] * b;
            return c;
        },
        dist: function (a, b) {
            var c = b[0] - a[0], d = b[1] - a[1];
            return Math.sqrt(c * c + d * d);
        },
        set: function (a, b) {
            b[0] = a[0];
            b[1] = a[1];
            return b;
        },
        equal: function (a, b) {
            return a === b || 1.0E-6 > Math.abs(a[0] -
                b[0]) && 1.0E-6 > Math.abs(a[1] - b[1]);
        },
        negate: function (a, b) {
            b || (b = a);
            b[0] = -a[0];
            b[1] = -a[1];
            return b;
        },
        normalize: function (a, b) {
            b || (b = a);
            var c = a[0] * a[0] + a[1] * a[1];
            0 < c ? (c = Math.sqrt(c), b[0] = a[0] / c, b[1] = a[1] / c) : b[0] = b[1] = 0;
            return b;
        },
        cross: function (a, b, c) {
            a = a[0] * b[1] - a[1] * b[0];
            if (!c)
                return a;
            c[0] = c[1] = 0;
            c[2] = a;
            return c;
        },
        length: function (a) {
            var b = a[0], a = a[1];
            return Math.sqrt(b * b + a * a);
        },
        squaredLength: function (a) {
            var b = a[0], a = a[1];
            return b * b + a * a;
        },
        dot: function (a, b) { return a[0] * b[0] + a[1] * b[1]; },
        direction: function (a, b, c) {
            c || (c = a);
            var d = a[0] - b[0], a = a[1] - b[1], b = d * d + a * a;
            if (!b)
                return c[0] = 0, c[1] = 0, c[2] = 0, c;
            b = 1 / Math.sqrt(b);
            c[0] = d * b;
            c[1] = a * b;
            return c;
        },
        lerp: function (a, b, c, d) {
            d || (d = a);
            d[0] = a[0] + c * (b[0] - a[0]);
            d[1] = a[1] + c * (b[1] - a[1]);
            return d;
        },
        str: function (a) { return "[" + a[0] + ", " + a[1] + "]"; }
    }, I = {
        create: function (a) {
            var b = new o(4);
            a ? (b[0] = a[0], b[1] = a[1], b[2] = a[2], b[3] = a[3]) : b[0] = b[1] = b[2] = b[3] = 0;
            return b;
        },
        createFrom: function (a, b, c, d) {
            var e = new o(4);
            e[0] = a;
            e[1] = b;
            e[2] = c;
            e[3] = d;
            return e;
        },
        set: function (a, b) {
            b[0] = a[0];
            b[1] = a[1];
            b[2] = a[2];
            b[3] = a[3];
            return b;
        },
        equal: function (a, b) { return a === b || 1.0E-6 > Math.abs(a[0] - b[0]) && 1.0E-6 > Math.abs(a[1] - b[1]) && 1.0E-6 > Math.abs(a[2] - b[2]) && 1.0E-6 > Math.abs(a[3] - b[3]); },
        identity: function (a) {
            a || (a = I.create());
            a[0] = 1;
            a[1] = 0;
            a[2] = 0;
            a[3] = 1;
            return a;
        },
        transpose: function (a, b) {
            if (!b || a === b) {
                var c = a[1];
                a[1] = a[2];
                a[2] = c;
                return a;
            }
            b[0] = a[0];
            b[1] = a[2];
            b[2] = a[1];
            b[3] = a[3];
            return b;
        },
        determinant: function (a) { return a[0] * a[3] - a[2] * a[1]; },
        inverse: function (a, b) {
            b || (b = a);
            var c = a[0], d = a[1], e = a[2], g = a[3], f = c * g - e *
                d;
            if (!f)
                return null;
            f = 1 / f;
            b[0] = g * f;
            b[1] = -d * f;
            b[2] = -e * f;
            b[3] = c * f;
            return b;
        },
        multiply: function (a, b, c) {
            c || (c = a);
            var d = a[0], e = a[1], g = a[2], a = a[3];
            c[0] = d * b[0] + e * b[2];
            c[1] = d * b[1] + e * b[3];
            c[2] = g * b[0] + a * b[2];
            c[3] = g * b[1] + a * b[3];
            return c;
        },
        rotate: function (a, b, c) {
            c || (c = a);
            var d = a[0], e = a[1], g = a[2], a = a[3], f = Math.sin(b), b = Math.cos(b);
            c[0] = d * b + e * f;
            c[1] = d * -f + e * b;
            c[2] = g * b + a * f;
            c[3] = g * -f + a * b;
            return c;
        },
        multiplyVec2: function (a, b, c) {
            c || (c = b);
            var d = b[0], b = b[1];
            c[0] = d * a[0] + b * a[1];
            c[1] = d * a[2] + b * a[3];
            return c;
        },
        scale: function (a, b, c) {
            c || (c = a);
            var d = a[1], e = a[2], g = a[3], f = b[0], b = b[1];
            c[0] = a[0] * f;
            c[1] = d * b;
            c[2] = e * f;
            c[3] = g * b;
            return c;
        },
        str: function (a) { return "[" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + "]"; }
    }, K = {
        create: function (a) {
            var b = new o(4);
            a ? (b[0] = a[0], b[1] = a[1], b[2] = a[2], b[3] = a[3]) : (b[0] = 0, b[1] = 0, b[2] = 0, b[3] = 0);
            return b;
        },
        createFrom: function (a, b, c, d) {
            var e = new o(4);
            e[0] = a;
            e[1] = b;
            e[2] = c;
            e[3] = d;
            return e;
        },
        add: function (a, b, c) {
            c || (c = b);
            c[0] = a[0] + b[0];
            c[1] = a[1] + b[1];
            c[2] = a[2] + b[2];
            c[3] = a[3] + b[3];
            return c;
        },
        subtract: function (a, b, c) {
            c || (c =
                b);
            c[0] = a[0] - b[0];
            c[1] = a[1] - b[1];
            c[2] = a[2] - b[2];
            c[3] = a[3] - b[3];
            return c;
        },
        multiply: function (a, b, c) {
            c || (c = b);
            c[0] = a[0] * b[0];
            c[1] = a[1] * b[1];
            c[2] = a[2] * b[2];
            c[3] = a[3] * b[3];
            return c;
        },
        divide: function (a, b, c) {
            c || (c = b);
            c[0] = a[0] / b[0];
            c[1] = a[1] / b[1];
            c[2] = a[2] / b[2];
            c[3] = a[3] / b[3];
            return c;
        },
        scale: function (a, b, c) {
            c || (c = a);
            c[0] = a[0] * b;
            c[1] = a[1] * b;
            c[2] = a[2] * b;
            c[3] = a[3] * b;
            return c;
        },
        set: function (a, b) {
            b[0] = a[0];
            b[1] = a[1];
            b[2] = a[2];
            b[3] = a[3];
            return b;
        },
        equal: function (a, b) {
            return a === b || 1.0E-6 > Math.abs(a[0] - b[0]) && 1.0E-6 >
                Math.abs(a[1] - b[1]) && 1.0E-6 > Math.abs(a[2] - b[2]) && 1.0E-6 > Math.abs(a[3] - b[3]);
        },
        negate: function (a, b) {
            b || (b = a);
            b[0] = -a[0];
            b[1] = -a[1];
            b[2] = -a[2];
            b[3] = -a[3];
            return b;
        },
        length: function (a) {
            var b = a[0], c = a[1], d = a[2], a = a[3];
            return Math.sqrt(b * b + c * c + d * d + a * a);
        },
        squaredLength: function (a) {
            var b = a[0], c = a[1], d = a[2], a = a[3];
            return b * b + c * c + d * d + a * a;
        },
        lerp: function (a, b, c, d) {
            d || (d = a);
            d[0] = a[0] + c * (b[0] - a[0]);
            d[1] = a[1] + c * (b[1] - a[1]);
            d[2] = a[2] + c * (b[2] - a[2]);
            d[3] = a[3] + c * (b[3] - a[3]);
            return d;
        },
        str: function (a) {
            return "[" + a[0] + ", " +
                a[1] + ", " + a[2] + ", " + a[3] + "]";
        }
    };
    w && (w.glMatrixArrayType = o, w.MatrixArray = o, w.setMatrixArrayType = D, w.determineMatrixArrayType = G, w.glMath = E, w.vec2 = J, w.vec3 = r, w.vec4 = K, w.mat2 = I, w.mat3 = A, w.mat4 = x, w.quat4 = k);
    return { glMatrixArrayType: o, MatrixArray: o, setMatrixArrayType: D, determineMatrixArrayType: G, glMath: E, vec2: J, vec3: r, vec4: K, mat2: I, mat3: A, mat4: x, quat4: k };
});
//# sourceMappingURL=ocean.js.map