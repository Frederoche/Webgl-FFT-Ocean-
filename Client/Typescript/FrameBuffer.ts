declare var mat4: any

namespace Ocean
{
    export class FrameBuffer
    {
        width:number;
        height: number;

        gl: WebGLRenderingContext;
        texture : WebGLTexture;
        framBuffer:WebGLFramebuffer;
        renderbuffer: WebGLRenderbuffer;
        distance:number;
        

        constructor(width:number, height:number, gl:WebGLRenderingContext)
        {
            this.width =  width;
            this.height = height;
            this.distance = 0;
            this.gl = gl;
            this.texture = gl.createTexture();
            this.framBuffer     = this.gl.createFramebuffer();
            this.renderbuffer   = this.gl.createRenderbuffer();
        }

        private InitEmptyTexture()
        {
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
            
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
            
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0 , this.gl.RGBA, 512 , 512, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
        }

        public CreateFrameBuffer()
        {

            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framBuffer);
            this.InitEmptyTexture();

            this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.renderbuffer);
            this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, 512, 512);

            this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.texture, 0);
            this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, this.renderbuffer);
            
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);
            this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        }

        public BeginRenderframeBuffer(camera:Camera, isreflection)
        {
            
            if (isreflection) {
                this.distance = 2 * camera.position[1];

                camera.position[1] -= this.distance;
                camera.invertPitch();
            }

            this.gl.viewport(0, 0, 512, 512);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framBuffer);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        }

        public EndRenderBuffer(camera, isreflection) {
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

            if (isreflection){
                camera.position[1] += this.distance;
                camera.invertPitch();
            }

            this.gl.viewport(0, 0, this.width, this.height);
            

        }
    }
}