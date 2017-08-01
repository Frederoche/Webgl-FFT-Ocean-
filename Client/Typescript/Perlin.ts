namespace Ocean{
    export class Noise{
        x : number;
        y:number;

        constructor(x:number, y:number)
        {
            this.x = x;
            this.y = y;
        }

        private Lerp(p0: number, p1: number, w:number)
        {
            return (1 - w)*p0 +w*p1;
        }

        

        private Gradient(i: number, j: number, x:number, y:number)
        {
            let dx = x - i;
            let dy = y - j;
 
            return (dx*Gradient[i][j][0] + dy*Gradient[i][j][1]);
        }

    }
}