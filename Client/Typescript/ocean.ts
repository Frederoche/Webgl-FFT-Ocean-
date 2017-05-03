declare var mat4: any;
declare var vec3: any;


namespace Ocean
{
    export class Engine
    {
         gl: WebGLRenderingContext;
         canvas: HTMLCanvasElement;
         wireframe: number;
         projMatrix: any;
         viewMatrix: any;
         
         ext: ANGLE_instanced_arrays;
         floatExtension: OES_texture_float;

         displacementTexture : Texture;
         
         chunck: chunck;
         time: number;
         interval: number;
         h0 : Complex[][];
         h1 : Complex[][];
         fft: FFT2D;
         test: Complex[][];
         Phillips: Ocean.Phillips;
         frameNumber: number;
         skybox: SkyBox;

         camera: Camera;
         plot: Plot
         reflection:FrameBuffer;
         refraction : FrameBuffer;
         

        constructor(gl, canvas, wireframe) 
        {
            this.gl = gl;
            this.canvas = canvas;
            this.projMatrix = mat4.create();
            this.viewMatrix = mat4.create();
            this.chunck = new chunck(gl, 128);
            
            this.interval = 1.0;
            this.ext            = this.gl.getExtension("ANGLE_instanced_arrays");
            this.floatExtension = this.gl.getExtension("OES_texture_float");

            this.gl.getExtension("OES_texture_float_linear");

            this.Phillips = new Phillips(this.gl, 64);

            this.h0 = this.Phillips.createH0();
            this.h1 = this.Phillips.createH1();
            this.fft = new FFT2D(64);
            this.frameNumber = 0;
            this.wireframe = wireframe;
            this.skybox = new SkyBox(gl, 100);

            this.reflection = new FrameBuffer(window.innerWidth, window.innerHeight, this.gl); 
            this.refraction = new FrameBuffer(window.innerWidth, window.innerHeight, this.gl);

            this.camera = new Camera(vec3.create([26,132,326]), vec3.create([26.417,131.32,325.4]), vec3.create([0,1,0]));

            this.displacementTexture = new Texture(this.gl, 64);
            
        }

        public load(){
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
            this.gl.clearColor(1.0, 1.0, 1.0, 1.0);

            this.gl.clearDepth(1);
            this.gl.enable(this.gl.DEPTH_TEST);

            this.skybox.create();
            this.chunck.create();

            this.reflection.CreateFrameBuffer();
            this.refraction.CreateFrameBuffer();
        }

        private generateWaves(){
           cancelAnimationFrame(this.frameNumber);
                
                this.interval +=  1/8.0;
                
                let spectrum = this.Phillips.update(this.interval, this.h0, this.h1);
                
                let h = this.fft.Inverse2D(spectrum.h);
                let x = this.fft.Inverse2D(spectrum.x);
                let z = this.fft.Inverse2D(spectrum.z);
                
                
                this.displacementTexture.texture(x,h,z);
                
                this.frameNumber = requestAnimationFrame(()=> {
                    this.render();
                });
        }

        public render()
          {     
              //FRAMEBUFFER
              this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
              
              this.reflection.BeginRenderframeBuffer(this.viewMatrix,[1, 0, 0, 0,
                                                                       0, -1, 0, 0,
                                                                       0, 0, 1, 0,
                                                                       0, 0, 0, 1]);

              this.skybox.render(this.projMatrix, this.viewMatrix);  

              this.reflection.EndRenderBuffer(this.viewMatrix,[1, 0, 0, 0,
                                                               0, -1, 0, 0,
                                                               0, 0, 1, 0,
                                                               0, 0, 0, 1],this.canvas.width, this.canvas.height);
            
               this.refraction.BeginRenderframeBuffer(this.viewMatrix,[1, 0, 0, 0,
                                                                       0, 2, 0, 0,
                                                                       0, 0, 1, 0,
                                                                       0, 0, 0, 1]);

              this.skybox.render(this.projMatrix, this.viewMatrix);  

              this.refraction.EndRenderBuffer(this.viewMatrix,[1, 0, 0, 0,
                                                               0, 1/2.0, 0, 0,
                                                               0, 0, 1, 0,
                                                               0, 0, 0, 1],this.canvas.width, this.canvas.height);

              //REST OF SCENE
              this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
              this.skybox.render(this.projMatrix, this.viewMatrix); 

              this.generateWaves();
              

              mat4.perspective(45.0, 1.0, 0.1, 4000.0, this.projMatrix);
              mat4.lookAt(this.camera.position, this.camera.lookAt, this.camera.up, this.viewMatrix);

              this.chunck.Draw(this.ext, this.wireframe, this.camera, this.projMatrix, this.viewMatrix, this.reflection,this.displacementTexture ,this.refraction);
              
              
            this.frameNumber = requestAnimationFrame(()=> {
                this.render();
            });
        }
    }
}

window.onload = () => {
   
    let canvas      = <HTMLCanvasElement> document.getElementById('canvas');
    canvas.width    = window.innerWidth;
    canvas.height   = window.innerHeight;

    let gl          = <WebGLRenderingContext> canvas.getContext('experimental-webgl',{antialias:true});

    var engine      = new Ocean.Engine(gl, canvas, gl.TRIANGLES); 

    engine.load();
    engine.render();
    
    let choppiness = <HTMLInputElement> document.getElementById("choppiness");
    

    choppiness.oninput = (e) =>
    {
        engine.displacementTexture.lambda = parseInt((<any>e.target).value)/10;
    };
    
    document.onkeydown = (e) => {

        switch(e.which)
        {

            case 87:
            {
                if(engine.wireframe === gl.TRIANGLES)
                {
                    engine.wireframe = gl.LINES
                }
                else
                {
                    engine.wireframe = gl.TRIANGLES;
                }
                break;
            }

            case 39:
            {
                engine.camera.lookRight();
                engine.camera.log();
                break;
            }

            case 37:
            {
                engine.camera.lookLeft();
                engine.camera.log();
                break;
            }

             case 38:
            {
                engine.camera.moveForward();
                engine.camera.log();
                break;
            }

             case 40:
            {
                engine.camera.moveBackward();
                engine.camera.log();
                break;
            }
            case 90:
            {
                engine.camera.moveDown();
                engine.camera.log();
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
    }
}




