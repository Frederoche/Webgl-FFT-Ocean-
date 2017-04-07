namespace Ocean
{
    export class chunck extends Buffer{

        indices : any[];
        vertices :any[]; 
        size : number;
        gl: WebGLRenderingContext;

        constructor(gl, size)
        {
            super(gl);
            this.gl = gl;
            this.size = size;
            this.indices = [];
            this.vertices = [];

            super.createProgram('vertexShader', 'fragmentShader', true);
        }

        update()
        {
            super.update(this.vertices);
        }

        create()
        {
            let k = 0, n = 0;
            
            for(let i = 0; i <this.size+1; i++)
            {
                for(let j = 0; j < this.size+1; j++)
                {
                    this.vertices [k] = -1 + 2 * i / (this.size);
                    this.vertices [k + 1] = 0.0;
                    this.vertices [k + 2] = -1 + 2 * j / (this.size);

                    k +=3;
                }
            }

            for (let i = 0; i < this.size; i++)
            {
                for (let j = 0; j < this.size;j++)
                {
                    this.indices[n] = i + j * (this.size+1);
                    this.indices[n + 1] = i + 1 + j * (this.size+1);
                    this.indices[n + 2] = i + (j + 1) * (this.size+1);
                    this.indices[n + 3] = i + (j + 1) * (this.size+1);
                    this.indices[n + 4] = i + 1 + j * (this.size+1);
                    this.indices[n + 5] = i + 1 + (j + 1) * (this.size+1);
                    n += 6;
                }
            }

            let offset = new Float32Array([
                        0.0, 0.0, 0.0,
                        127.0, 0.0, 0.0,
                        0.0, 0.0, 127.0,
                        127.0, 0.0, 127.0,
                        254.0, 0.0, 0.0,
                        0.0, 0.0, 254.0,
                        254, 0.0, 254.0,
                        127, 0.0, 254.0,
                        254, 0.0, 127.0,
                        ]);

            
            this.gl.useProgram(this.program);
                
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
                this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
                
                this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.gl.DYNAMIC_DRAW);

                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.offsetBuffer);
                this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(offset), this.gl.STATIC_DRAW);

            this.gl.useProgram(null);
        }

        Draw(ext, wireframe, camera, projMatrix, viewMatrix, reflection , displacement, refraction)
        {
            this.gl.useProgram(this.program);

                    this.gl.uniform3f(this.program.cameraPosition, camera.position[0], camera.position[1], camera.position[2]);
                    this.gl.uniformMatrix4fv(this.program.projectionMatrix , false, projMatrix);
                    this.gl.uniformMatrix4fv(this.program.viewMatrixMatrix , false, viewMatrix);

                    this.gl.bindTexture(this.gl.TEXTURE_2D, displacement.displacementTexture);
                    this.gl.activeTexture(this.gl.TEXTURE0 + 1);
                    this.gl.uniform1i(this.program.reflection, 1);
                    
                    this.gl.bindTexture(this.gl.TEXTURE_2D, reflection.texture);
                    this.gl.activeTexture(this.gl.TEXTURE0+2);
                    this.gl.uniform1i(this.program.reflection, 2);

                    this.gl.bindTexture(this.gl.TEXTURE_2D, refraction.texture);
                    this.gl.activeTexture(this.gl.TEXTURE0+3);
                    this.gl.uniform1i(this.program.refraction, 3);

                    //LOAD OCEAN GRID
                    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
                    this.gl.enableVertexAttribArray(this.program.vertexPositionAttribute);
                    this.gl.vertexAttribPointer(this.program.vertexPositionAttribute, 3, this.gl.FLOAT, false, 12, 0);
                    
                    //INSTANCED DRAWING
                    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.offsetBuffer);
                    this.gl.enableVertexAttribArray(this.program.offsetAttribute);
                    this.gl.vertexAttribPointer(this.program.offsetAttribute, 3, this.gl.FLOAT, false, 0, 0);
                    ext.vertexAttribDivisorANGLE(this.program.offsetAttribute, 1);

                    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                    ext.drawElementsInstancedANGLE(wireframe, this.indices.length, this.gl.UNSIGNED_SHORT, 0, 9);
                    ext.vertexAttribDivisorANGLE(this.program.offsetAttribute, 0);

                    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
                    this.gl.disable(this.gl.BLEND);
                    
              this.gl.useProgram(null);
        }
    }
}