namespace Ocean
{
    export class Texture
    {
        gl: WebGLRenderingContext;
        size: number;
        lambda:number;
        displacementTexture: WebGLTexture;
        normalTextures: WebGLTexture;

        plot :Plot;

        constructor(gl, size)
        {
            this.gl = gl;
            this.size = size;
            this.lambda = 0.8;
            this.displacementTexture = this.gl.createTexture();
            this.normalTextures = this.gl.createTexture();
            this.plot = new Plot("spacial",64);
        }

        public texture(array0, array1, array2)
        {
                let dataArray = [];
                let k=0, h=0;

                let signs =  [1.0, -1.0];

                for(let i =0; i < this.size; i++)
                {
                    for(let j = 0; j < this.size; j++)
                    {
                        let sign = signs[ (i+j) & 1];
                        
                        dataArray[k]   = array0[i][j] * (this.lambda)*sign;
                        dataArray[k+1] = array1[i][j]*sign;
                        dataArray[k+2] = array2[i][j] * (this.lambda)*sign;
                        dataArray[k+3] = 1.0;
                        

                        this.plot.imagedata.data[h] =   dataArray[k]*255.0*10;
                        this.plot.imagedata.data[h+1] = dataArray[k+1]*255.0*10;
                        this.plot.imagedata.data[h+2] = dataArray[k+2]*255.0*10;
                        this.plot.imagedata.data[h+3] = 255.0;

                        h+=4;
                        k+=4;
                    }
                }

                this.plot.load();
                return this.createTexturefromData(dataArray);
            }

        private createTexturefromData(dataArray)
        {
        

            this.gl.bindTexture(this.gl.TEXTURE_2D, this.displacementTexture);
            
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0 , this.gl.RGBA, this.size, this.size, 0, this.gl.RGBA, this.gl.FLOAT, new Float32Array(dataArray));
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);
            return this;
        }

    

        public createTexture(callback)
        {
             let image = new Image(512, 512);
             let texture = this.gl.createTexture();

             image.addEventListener("load", ()=>{

                

                this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
                
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
                
                
                
                this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA,  this.gl.RGBA, this.gl.UNSIGNED_BYTE,<HTMLImageElement> image);

                this.gl.bindTexture(this.gl.TEXTURE_2D, null);
                callback(texture);

             }, false);

             image.src = "images/Skybox2.jpg";
        }
    }

}