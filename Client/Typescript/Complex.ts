namespace Ocean{
    export class Complex{

        x:number;
        y:number;

        constructor(x:number ,y:number)
        {
            this.x = x;
            this.y = y;
        }
        
        static Conj(a) :Complex
        {
            return new Complex(a.x,-a.y);
        }

        static add(a:Complex,b:Complex) :Complex
        {
            return new Complex(a.x + b.x, a.y + b.y);
        }

        static substract(a,b) :Complex
        {
            return new Complex(a.x - b.x, a.y - b.y);
        }

        static mult(a,b) :Complex
        {
            return new Complex(a.x * b.x - a.y * b.y, a.x * b.y + b.x * a.y);
        }

        static multScalar(a:Complex,b:number): Complex
        {
            return new Complex(a.x * b, a.y * b);
        }

        static divideScalar(a:Complex, b:number) : Complex
        {
            return new Complex(a.x / b, a.y / b);
        }

        static Polar(r:any, angle:any) : Complex
        {
            return new Complex(r * Math.cos(angle), r * Math.sin(angle));
        }

        static Modulus(a:Complex) : any
        {
            return Math.sqrt(a.x*a.x + a.y*a.y);
        }

        
    }
}