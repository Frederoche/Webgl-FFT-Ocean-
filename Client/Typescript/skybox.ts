namespace Ocean{

    export class SkyBox extends Buffer
    {
        size:number;
        indices: Array<number>;
        vertexBuffer: WebGLBuffer;
        indexBuffer: WebGLBuffer;
        texture : WebGLTexture;

        constructor(gl, size)   
        {
            super(gl);

            this.gl = gl;
            this.size = size;
            this.indices = [];
            this.texture = this.gl.createTexture();
            new Texture(this.gl, 512).createTexture((texture)=>{
                this.texture = texture;
            });

            super.createProgram("skyBoxVertexShader", "skyBoxfragmentShader", false);
        }

        public create()
        {
            let vertices = [ -1, -1, -1, 0.25, 2.0/3.0,
                             -1, -1, 1,  0.25,  1.0,
                             1,  -1, 1,  0.5, 1.0,
                             1,  -1, -1,  0.5, 2.0/3.0,
                             
                            -1,  1, -1,  0.25, 1.0/3.0,
                            -1,  1,  1,  0.25, 0.0,
                             1,  1,  1,  0.5, 0.0,
                             1,  1,  -1, 0.5, 1.0/3.0, 

                            -1, -1, -1, 0.25, 2.0/3.0,
                            -1,  1, -1, 0.25, 1.0/3.0,
                             1,  1, -1, 0.5, 1.0/3.0,
                             1, -1, -1, 0.5, 2.0/3.0,
                             
                            -1, -1,  1, 1.0, 2.0/3.0,              
                            -1,  1,  1, 1.0, 1.0/3.0, 
                             1,  1,  1, 0.75, 1.0/3.0,
                             1, -1,  1, 0.75, 2.0/3.0,

                             1, -1, -1, 0.5, 2.0/3.0,
                             1,  1, -1, 0.5, 1.0/3.0,
                             1,  1,  1, 0.75, 1.0/3.0,
                             1, -1,  1, 0.75, 2.0/3.0,
                             
                             -1, -1, -1,  0.25, 2.0/3.0,
                             -1,  1, -1,  0.25, 1.0/3.0,
                             -1,  1,  1,  0.0 , 1.0/3.0,
                             -1, -1,  1 , 0.0, 2.0/3.0];
             
            

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
        }

        public render(projMatrix, viewMatrix, isclipped)
        {
            this.gl.useProgram(this.program);

            this.gl.uniform4f(this.program.clipPlane, 0, -1, 0, -5);

            if (isclipped === true)
                this.gl.uniform1f(this.program.isclipped, 1.0);
            else
                this.gl.uniform1f(this.program.isclipped, 0.0);
           
                this.gl.uniformMatrix4fv(this.program.projectionMatrix , false, projMatrix);
                this.gl.uniformMatrix4fv(this.program.viewMatrixMatrix , false, viewMatrix);

                this.gl.activeTexture(this.gl.TEXTURE0);
                this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
                
                 
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
                this.gl.enableVertexAttribArray(this.program.vertexPositionAttribute);
                
                this.gl.vertexAttribPointer(this.program.vertexPositionAttribute, 3, this.gl.FLOAT, false, 20, 0);
                this.gl.vertexAttribPointer(this.program.texcoord, 2, this.gl.FLOAT, false, 20, 12);

                this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                this.gl.drawElements(this.gl.TRIANGLES, this.indices.length, this.gl.UNSIGNED_BYTE, 0);

            this.gl.useProgram(null);
        }

    }
}