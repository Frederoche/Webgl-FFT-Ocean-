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
            this.chunck = new Ocean.chunck(gl, 250);
            this.interval = 1.0;
            this.ext = this.gl.getExtension("ANGLE_instanced_arrays");
            this.floatExtension = this.gl.getExtension("OES_texture_float");
            this.gl.getExtension("OES_texture_float_linear");
            this.Phillips = new Ocean.Phillips(this.gl, 64);
            this.h0 = this.Phillips.createH0();
            this.h1 = this.Phillips.createH1();
            this.fft = new Ocean.FFT2D(64);
            this.frameNumber = 0;
            this.wireframe = wireframe;
            this.skybox = new Ocean.SkyBox(gl, 100);
            this.reflection = new Ocean.FrameBuffer(window.innerWidth, window.innerHeight, this.gl);
            this.refraction = new Ocean.FrameBuffer(window.innerWidth, window.innerHeight, this.gl);
            this.camera = new Ocean.Camera(vec3.create([26, 2, 326]), vec3.create([26.417, 2, 325.4]), vec3.create([0, 1, 0]));
            this.birdCamera = new Ocean.Camera(vec3.create([26, 140, 400.0]), vec3.create([26.417, 131.32, 325.4]), vec3.create([0, 1, 0]));
            this.displacementTexture = new Ocean.Texture(this.gl, 64);
        }
        Engine.prototype.load = function () {
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
            this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
            this.gl.clearDepth(1);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.skybox.create();
            this.chunck.create();
            this.reflection.CreateFrameBuffer();
            this.refraction.CreateFrameBuffer();
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
            //
            //FRAMEBUFFER
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            var text = document.getElementById("camera-height");
            text.value = this.camera.position[1];
            this.reflection.BeginRenderframeBuffer(this.camera, 0.0);
            this.skybox.render(this.projMatrix, this.viewMatrix, true);
            this.reflection.EndRenderBuffer(this.camera);
            this.refraction.BeginRenderframeBuffer(this.camera, 0.0);
            this.skybox.render(this.projMatrix, this.viewMatrix, true);
            this.refraction.EndRenderBuffer(this.camera);
            //REST OF SCENE
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            this.skybox.render(this.projMatrix, this.viewMatrix, false);
            this.generateWaves();
            mat4.perspective(60.0, 1.2, 0.01, 4000.0, this.projMatrix);
            mat4.lookAt(this.camera.position, this.camera.lookAt, this.camera.up, this.viewMatrix);
            mat4.lookAt(this.birdCamera.position, this.birdCamera.lookAt, this.birdCamera.up, this.birdViewMatrix);
            mat4.inverse(this.viewMatrix, this.invView);
            mat4.inverse(this.projMatrix, this.invProj);
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
    var gl = canvas.getContext('experimental-webgl', { antialias: true });
    var engine = new Ocean.Engine(gl, canvas, gl.TRIANGLES);
    engine.load();
    engine.render();
    var choppiness = document.getElementById("choppiness");
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
