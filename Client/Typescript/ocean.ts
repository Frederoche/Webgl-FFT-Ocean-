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
         birdViewMatrix:any;

         invProj:any;
         invView:any;
         
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
         birdCamera:Camera;

         plot: Plot
         reflection:FrameBuffer;
         refraction : FrameBuffer;
         

        constructor(gl, canvas, wireframe) 
        {
            this.gl = gl;
            this.canvas = canvas;
            this.projMatrix = mat4.create();
            this.viewMatrix = mat4.create();
            this.birdViewMatrix = mat4.create();

            this.invProj =  mat4.create();
            this.invView =  mat4.create();

            this.chunck = new chunck(gl, 512);
            
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

            this.camera = new Camera(vec3.create([26,2,326]), vec3.create([26.417,2,325.4]), vec3.create([0,1,0]));
            this.birdCamera = new Camera(vec3.create([26,140,400.0]), vec3.create([26.417,131.32,325.4]), vec3.create([0,1,0]));

            this.displacementTexture = new Texture(this.gl, 64);
            
        }

        public load() {
           
            this.gl.getExtension('OES_element_index_uint');

            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
            this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
            this.gl.clearDepth(1);
            this.gl.enable(this.gl.DEPTH_TEST);

            this.skybox.create();
            this.chunck.create();

            this.reflection.CreateFrameBuffer();
        }

        private generateWaves() {
            this.frameNumber = window.requestAnimationFrame(() => {
                this.interval += 1.0/6.0;

                let spectrum = this.Phillips.update(this.interval, this.h0, this.h1);

                let h = this.fft.Inverse2D(spectrum.h);
                let x = this.fft.Inverse2D(spectrum.x);
                let z = this.fft.Inverse2D(spectrum.z);

                this.displacementTexture.texture(x, h, z);
                    this.render();
                });
        }

        public render()
        {     
              this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	      
              let text = <HTMLInputElement>document.getElementById("camera-height"); 
              
              text.value = this.camera.position[1];
              
              let reflectionMatrix = mat4.create([1.0,0.0,0.0,0.0,
                                                  0.0, -1.0, 0.0 ,0.0,
                                                  0.0, 0.0, 1.0, 0.0,
                                                  0.0, 0.0, 0.0, 1.0]);
               var reflView = mat4.create();
               mat4.multiply(this.viewMatrix, reflectionMatrix, reflView);

              
              //REFLECTION FRAMEBUFFER RENDERING
              this.reflection.BeginRenderframeBuffer();
                this.skybox.render(this.projMatrix, reflView, true, false); 
              this.reflection.EndRenderBuffer();
             

              //REST OF SCENE
              this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
              this.skybox.render(this.projMatrix, this.viewMatrix, false, false); 

              this.generateWaves();

              mat4.perspective(55.0, 1.0, 0.1,  4000.0, this.projMatrix);
              mat4.perspective(65.0, 1.0, 0.01, 4000.0, this.invProj);

              mat4.lookAt(this.camera.position, this.camera.lookAt, this.camera.up, this.viewMatrix);
              
              mat4.inverse(this.viewMatrix, this.invView);
              mat4.inverse(this.invProj, this.invProj);

              this.chunck.Draw(this.ext, this.wireframe, this.camera, this.projMatrix, this.viewMatrix, this.reflection,this.displacementTexture ,this.refraction, this.invProj, this.invView, this.birdViewMatrix);              
        }
    }
}

window.onload = () => {
   
    let canvas      = <HTMLCanvasElement> document.getElementById('canvas');
    canvas.width    = window.innerWidth;
    canvas.height   = window.innerHeight;

    let gl          = <WebGLRenderingContext> canvas.getContext('webgl',{antialias: true});
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
    }
}




