namespace Ocean{
    export class FFT{
        size : number
            constructor(size)
            {
                this.size = size;
            }

        public Inverse(input: Complex[]) : Complex[]
        {
            let transform = [];

            for(let i = 0; i < input.length; i++)
            {
                input[i] = Complex.Conj(input[i]);
            }
            
            transform = this.Forward(input);
            

            for(let i = 0; i < input.length; i++) 
            {
                transform[i] = Complex.Conj(transform[i]);
            }

            return transform;
        }

        public Forward(input: Complex[]) : Complex[]
        {
            
            let result = new Array<Complex>(input.length);
            let omega = (-2.0 * Math.PI)/ input.length;
            
            if(input.length <= 1)
            {
                result[0] = input[0];

                if(isNaN(input[0].x) || isNaN(input[0].y))
                {
                    result[0] = new Complex(0.0,0.0);
                    input[0] = result[0];
                }

                return result;
            }

            let evenInput = new Array<Complex>(input.length/2);
            let oddInput  = new Array<Complex>(input.length/2);

            for(let k = 0; k < input.length / 2 ; k++)
            {
                evenInput[k] = input[2*k];
                oddInput[k]  = input[2*k + 1];
            }
            
            let even  = this.Forward(evenInput);
            let odd   = this.Forward(oddInput);

            for(let k = 0; k < input.length / 2; k++)
            {
                let polar = Complex.Polar(1.0, omega*(k));
                odd[k]    = Complex.mult(odd[k], polar);
            }

            for(let k = 0; k < input.length / 2; k++)
            {
                result[k]                    =  Complex.add(even[k], odd[k]);
                result[k + input.length / 2] =  Complex.substract(even[k], odd[k]);
                
            }

            return result;
        }
    }

    export class FFT2D extends FFT
    {
        constructor(size)
        {
            super(size);
        }

        public Inverse2D(inputComplex:Complex[][]) : Number[]
        {
            let p = [];
            let f = [];
            let t = [];
            
            let floatImage = [];

            for(let l=0; l < this.size; l++)
            {
                p[l] = super.Inverse(inputComplex[l]);
            }
            
            for(let l=0; l< this.size; l++)
            {
                t[l] = new Array<Complex>(this.size);
                
                for(let k=0; k< this.size ; k++)
                {
                    t[l][k] = Complex.divideScalar(p[k][l], this.size * this.size);
                }
                
                f[l] = super.Inverse(t[l]);
            }
            

            for(let k=0; k <this.size; k++)
            {
                floatImage[k] = [];

                for(let l=0; l< this.size;l++)
                {
                    floatImage[k][l] = f[k][l].x;
                }
            }
            
            return floatImage;
        }
    }
}