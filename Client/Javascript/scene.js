/*declare var mat4: any;
declare var vec3: any;

namespace Ocean
{
    export class Scene
    {
        gl: WebGLRenderingContext;
        canvas: HTMLCanvasElement;

        projMatrix: any;
        viewMatrix: any;

        frameNumber: number;
        skybox:SkyBox;
        ext: ANGLE_instanced_arrays;


        constructor(gl, canvas)
        {
            this.gl = gl;
            this.canvas = canvas;
            this.projMatrix = mat4.create();
            this.viewMatrix = mat4.create();

            this.frameNumber = 0;
            this.ext          = this.gl.getExtension("ANGLE_instanced_arrays");
            this.skybox = new SkyBox(gl, 100);
        }

        public load()
        {
            debugger;
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
            this.gl.clearColor(0.0, 0.3, 0.5, 1.0);

            this.gl.clearDepth(1);
            this.gl.enable(this.gl.DEPTH_TEST);

            mat4.perspective(65.0, 1.0, 0.1, 4000.0, this.projMatrix);
            mat4.lookAt(vec3.create([400,300,400]), vec3.create([0,0,0]), vec3.create([0,1,0]), this.viewMatrix);
            
            this.skybox.create();

        }

        public render()
        {
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

            this.skybox.render(this.projMatrix, this.viewMatrix);
            
            this.frameNumber = requestAnimationFrame(()=> {
                this.render();
            });
        }
    }
}

window.onload = () => {
   
    let canvas = <HTMLCanvasElement> document.getElementById('canvas');
    let gl     = <WebGLRenderingContext> canvas.getContext('webgl');

    var scene = new Ocean.Scene(gl, canvas);
    scene.load();
    scene.render();
}*/ 
