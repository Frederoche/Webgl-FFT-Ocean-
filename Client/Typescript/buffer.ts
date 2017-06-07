namespace Ocean
{
    export class Buffer
    {
        gl           : WebGLRenderingContext;
        offsetBuffer : WebGLBuffer;
        vertexBuffer : WebGLBuffer;
        indexBuffer  : WebGLBuffer;
        program      : any;

        constructor(gl)
        {
            this.gl = gl;
            this.program = gl.createProgram();

            this.offsetBuffer = gl.createBuffer();
            this.vertexBuffer = gl.createBuffer();
            this.indexBuffer  = gl.createBuffer();
        }

        protected update(vertices)
        {
            this.gl.useProgram(this.program);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
            this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, new Float32Array(vertices));

            this.program.vertexPositionAttribute = this.gl.getAttribLocation(this.program, "position");
            this.gl.enableVertexAttribArray(this.program.vertexPositionAttribute);
            this.gl.useProgram(null);
        }

        protected createProgram(vShaderId:string, fShaderId:string, isOcean:boolean)
        {
            let vshaderScript = document.getElementById(vShaderId);
            let fshaderScript = document.getElementById(fShaderId);

            let vShader  = this.gl.createShader(this.gl.VERTEX_SHADER);
            
            this.gl.shaderSource(vShader, vshaderScript.textContent);
            this.gl.compileShader(vShader);

            let fShader  = this.gl.createShader(this.gl.FRAGMENT_SHADER);
            this.gl.shaderSource(fShader, fshaderScript.textContent);
            this.gl.compileShader(fShader);

            this.gl.attachShader(this.program, vShader); 
            this.gl.attachShader(this.program, fShader);

            let vshaderError = this.gl.getShaderInfoLog(vShader);
            let fshaderError = this.gl.getShaderInfoLog(fShader);
            
            console.log(vshaderError);
            console.log(fshaderError);
            
            this.gl.linkProgram(this.program);
            let error = this.gl.getProgramInfoLog(this.program);
            
            this.gl.useProgram(this.program);

            if(isOcean)
            {
                this.program.time            = this.gl.getUniformLocation(this.program,  "time");

                this.program.spectrum        = this.gl.getUniformLocation(this.program, "displacement");
                this.program.reflection      = this.gl.getUniformLocation(this.program, "reflectionSampler");
                this.program.refraction      = this.gl.getUniformLocation(this.program, "refractionSampler");
                
            }
            else
            {
                this.program.texture   = this.gl.getUniformLocation(this.program, "texture");
                this.program.clipPlane = this.gl.getUniformLocation(this.program, "clipplane");
                this.program.isclipped = this.gl.getUniformLocation(this.program, "isclipped");
            }
            
            this.program.cameraPosition  = this.gl.getUniformLocation(this.program, "cameraPosition");

            this.program.texcoord                = this.gl.getAttribLocation(this.program,  "texCoord");
            this.program.vertexPositionAttribute = this.gl.getAttribLocation(this.program,  "position");
            
            this.program.projectionMatrix        = this.gl.getUniformLocation(this.program, "projMatrix");
            this.program.viewMatrixMatrix        = this.gl.getUniformLocation(this.program, "viewMatrix");
            this.program.invViewMatrix           = this.gl.getUniformLocation(this.program, "invViewMatrix");
            this.program.invProjMatrix           = this.gl.getUniformLocation(this.program, "invProjMatrix");
            this.program.birdviewMatrix          = this.gl.getUniformLocation(this.program, "birdviewMatrix");

            this.gl.useProgram(null);   
        }
}
}