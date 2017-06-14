namespace Ocean
{
    export class chunck extends Buffer{

        indices : any[];
        vertices :any[]; 
        size : number;
        gl: WebGLRenderingContext;
        clipPlane: any[];

        constructor(gl, size)
        {
            super(gl);
            this.gl = gl;
            this.size = size;
            this.indices = [];
            this.vertices = [];
            this.clipPlane = [];

            super.createProgram('vertexShader', 'fragmentShader', true);
        }

        update()
        {
            super.update(this.vertices);
        }

        create()
        {
            let k = 0, n = 0;
            
            for(let i = 0; i <this.size+1 ; i++)
            {
                for(let j = 0; j < this.size+1 ; j++)
                {
                    this.vertices [k] = -1 + 2 * i / (this.size+1);
                    this.vertices [k + 1] = 0.0;
                    this.vertices [k + 2] = -1 + 2 * j / (this.size+1);

                    k +=3;
                }
            }

            for (let i = 0; i < this.size; i++)
            {
                for (let j = 0; j < this.size;j++)
                {
                    this.indices[n] = i + j * (this.size+1);
                    this.indices[n + 1] = i + 1 + j * (this.size +1);
                    this.indices[n + 2] = i + (j + 1) * (this.size+1);
                    this.indices[n + 3] = i + (j + 1) * (this.size+1);
                    this.indices[n + 4] = i + 1 + j * (this.size+1);
                    this.indices[n + 5] = i + 1 + (j + 1) * (this.size+1);
                    n += 6;
                }
            }

           

            
            this.gl.useProgram(this.program);
                
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
                this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
                
                this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(this.indices), this.gl.DYNAMIC_DRAW);

                

            this.gl.useProgram(null);
        }

        Draw(ext, wireframe, camera, projMatrix, viewMatrix, reflection , displacement, refraction, invProj, invView, birdviewMatrix)
        {
            this.gl.useProgram(this.program);

                    //camera position, up vector, lookAt
                    this.gl.uniform3f(this.program.cameraPosition, camera.position[0], camera.position[1], camera.position[2]);

                    this.gl.uniform3f(this.program.upVector, camera.up[0], camera.up[1], camera.up[2]);
                    this.gl.uniform3f(this.program.lookAt, camera.lookAt[0], camera.lookAt[1], camera.lookAt[2]);

                    this.gl.uniformMatrix4fv(this.program.invViewMatrix , false, invView);
                    this.gl.uniformMatrix4fv(this.program.invProjMatrix , false, invProj);

                    this.gl.uniformMatrix4fv(this.program.projectionMatrix , false, projMatrix);
                    this.gl.uniformMatrix4fv(this.program.viewMatrixMatrix , false, viewMatrix);
                     this.gl.uniformMatrix4fv(this.program.birdviewMatrix , false, birdviewMatrix);

                    this.gl.bindTexture(this.gl.TEXTURE_2D, displacement.displacementTexture);
                    this.gl.activeTexture(this.gl.TEXTURE0 + 1);
                    this.gl.uniform1i(this.program.reflection, 1);
                    
                    this.gl.bindTexture(this.gl.TEXTURE_2D, reflection.texture);
                    this.gl.activeTexture(this.gl.TEXTURE0 + 2);
                    this.gl.uniform1i(this.program.reflection, 2);

                    this.gl.bindTexture(this.gl.TEXTURE_2D, refraction.texture);
                    this.gl.activeTexture(this.gl.TEXTURE0 + 3);
                    this.gl.uniform1i(this.program.refraction, 3);

                    //LOAD OCEAN GRID
                    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
                    this.gl.enableVertexAttribArray(this.program.vertexPositionAttribute);
                    this.gl.vertexAttribPointer(this.program.vertexPositionAttribute, 3, this.gl.FLOAT, false, 0, 0);
                    
                    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                    this.gl.drawElements(wireframe, this.indices.length, this.gl.UNSIGNED_INT,0);
                    

                    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
                    this.gl.disable(this.gl.BLEND);
                    
              this.gl.useProgram(null);
        }
    }
}