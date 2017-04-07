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
                this.program.offsetAttribute = this.gl.getAttribLocation(this.program, "offset");
                this.program.spectrum = this.gl.getUniformLocation(this.program, "displacement");
                this.program.reflection = this.gl.getUniformLocation(this.program, "reflectionSampler");
                this.program.refraction = this.gl.getUniformLocation(this.program, "refractionSampler");
            }
            else {
                this.program.texture = this.gl.getUniformLocation(this.program, "texture");
            }
            this.program.cameraPosition = this.gl.getUniformLocation(this.program, "cameraPosition");
            this.program.texcoord = this.gl.getAttribLocation(this.program, "texCoord");
            this.program.vertexPositionAttribute = this.gl.getAttribLocation(this.program, "position");
            this.program.projectionMatrix = this.gl.getUniformLocation(this.program, "projMatrix");
            this.program.viewMatrixMatrix = this.gl.getUniformLocation(this.program, "viewMatrix");
            this.gl.useProgram(null);
        };
        return Buffer;
    }());
    Ocean.Buffer = Buffer;
})(Ocean || (Ocean = {}));
