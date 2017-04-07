declare var mat4: any

namespace Ocean
{
    export class FrameBuffer
    {
        width:number;
        height:number;
        gl: WebGLRenderingContext;
        texture : WebGLTexture;
        framBuffer:WebGLFramebuffer;
        renderbuffer: WebGLRenderbuffer;
        

        constructor(width:number, height:number, gl:WebGLRenderingContext)
        {
            this.width =  width;
            this.height = height;

            this.gl = gl;
            this.texture = gl.createTexture();
            this.framBuffer = this.gl.createFramebuffer();
        }

        private InitEmptyTexture()
        {
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
            
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
            
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0 , this.gl.RGBA, this.width , this.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
        }

        public CreateFrameBuffer()
        {
            this.InitEmptyTexture();

            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,this.framBuffer);
            this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.texture, 0);
            
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);
            
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        }

        public BeginRenderframeBuffer(viewMatrix, mirrorMatrix)
        {
            mat4.multiply(viewMatrix, mirrorMatrix, viewMatrix);

            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            this.gl.viewport(0, 0, this.width, this.height);
            this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.renderbuffer);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framBuffer);
            
            this.gl.bindTexture(this.gl.TEXTURE_2D,this.texture);
        }

        public EndRenderBuffer(viewMatrix, mirrorMatrix, width, height)
        {
             mat4.multiply(viewMatrix, mirrorMatrix, viewMatrix);
                                        
            this.gl.bindTexture(this.gl.TEXTURE_2D,null);
            this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
            
            this.gl.viewport(0, 0, width, height);
        }
    }
}