namespace Ocean
{
    export class Plot
    {
        ctx : CanvasRenderingContext2D;
        canvas: HTMLCanvasElement;
        imagedata: ImageData;
        img: HTMLImageElement;

        constructor(id, size)
        {
            this.canvas =document.createElement('canvas');
            this.canvas.width = 64;
            this.canvas.height = 64;
            this.img  = <HTMLImageElement>document.getElementById(id);
            
            this.ctx = this.canvas.getContext('2d');

            this.imagedata = this.ctx.createImageData(size, size);

        }

       public load()
       {
            this.ctx.putImageData(this.imagedata,0,0);
            this.ctx.scale(4.0, 4.0);
            var src = this.canvas.toDataURL("image/png");
            this.img.src= src;
       }

    }
}