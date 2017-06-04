namespace Ocean{
    export class Phillips{
        
        size:number;
        gl: WebGLRenderingContext;
        length:number;
        windspeed:number;
        windX:number;
        windY:number;
        A:number;
        g:number;
        maxh:number;

       
        constructor(gl, size:number)
        {
            this.size = size;
            this.gl = gl;
            this.length = 1024.0;
            this.windspeed = 25.0;
            this.windX = 2.5;
            this.windY = 2.0;
            this.A = 0.0001;
            this.g = 9.81;
            this.maxh = 0.0;
        }
        

        public createH0() : Complex[][]
        {
            let result = [];
            let k = 0;
            let plot = new Plot("spectrum",64);
            let max = 0.0;

            for(var i = 0; i < this.size; i++)
            {
                result[i] = [];

                for(var j=0; j < this.size; j++)
                {
                    var parameter = {

                        g:this.g,
                        A:this.A,
                        windSpeed:this.windspeed ,

                        windX:this.windX,
                        windY:this.windY,

                        Kx:  2.0 * Math.PI  * (i -  this.size/2.0)/this.length ,
                        Ky:  2.0 * Math.PI  * (j -  this.size/2.0)/this.length ,
                    };

                    var spec = this.spectrum(parameter);
                    let h0   = this.calculateH0(spec);
                
                    result[i][j] = h0;

                    plot.imagedata.data[k]   = spec * 255;
                    plot.imagedata.data[k+1] = spec * 255;
                    plot.imagedata.data[k+2] = spec * 255;
                    plot.imagedata.data[k+3] = 255.0;

                    k+=4;
                }
            }
            plot.load();
           
            return result;
        }

        public createH1() : Complex[][]
        {
            let result = [];
        
            for(var i = 0; i < this.size; i++)
            {
                result[i] = [];

                for(var j=0; j < this.size; j++)
                {
                    var parameter = {

                        g:this.g,
                        A:this.A,
                        windSpeed:this.windspeed ,

                        windX:this.windX,
                        windY:this.windY,

                        Kx:  2.0 * Math.PI  * (-i - this.size/2.0 )/this.length ,
                        Ky:  2.0 * Math.PI  * (-j - this.size/2.0 )/this.length ,
                    };

                    
                    let h0 =  Complex.Conj(this.calculateH0(this.spectrum(parameter)));

                    result[i][j]  = Complex.Conj(this.calculateH0(this.spectrum(parameter)));                   
                }
            }
            return result;
        }

        


        public update(time, h0, h1)
        {
            let plot = new Plot("hu", 64);
           
            let result = {h:[], z:[], x:[]};
            
            let Kx, Ky =0;

            let k = 0;

            for(var i = 0; i < this.size; i++)
            {
                result.h[i] = [];
                result.z[i] = [];
                result.x[i] = [];

                let h =  new Complex(0.0,0.0);

                for(var j=0; j < this.size; j++)
                {  
                    
                    Kx = 2.0  * Math.PI  * (i - this.size/2.0)/2048;  
                    Ky = 2.0  * Math.PI  * (j - this.size/2.0)/2048 ;

                    let KK = Math.sqrt(Kx*Kx + Ky*Ky);

                    let omega = Math.sqrt(9.81* KK);

                    let polar  = Complex.Polar(1.0, omega * time);
                    
                    let h0t = Complex.mult(h0[i][j], polar);
                    let h1t = Complex.mult(h1[i][j], Complex.Conj(polar));

                    let htilde = Complex.add(h0t, h1t);

                    let imaginarydoth = Complex.mult(new Complex(0, 1.0), htilde);

                    let x = Complex.multScalar(imaginarydoth, Kx/KK);
                    let z = Complex.multScalar(imaginarydoth, Ky/KK);
                    
                    plot.imagedata.data[k]   = x.x * 255.0;
                    plot.imagedata.data[k+1] = htilde.x * 255.0;
                    plot.imagedata.data[k+2] = z.x * 255.0;
                    plot.imagedata.data[k+3] = 255.0;

                    k+=4;

                    result.h[i][j] = htilde;
                    result.z[i][j] = z;
                    result.x[i][j] = x;
                    
                }
            }
            
            plot.load();
            

            return result;
        }

        private spectrum(parameter) : number
        {
            let knormalized = Math.sqrt(parameter.Kx * parameter.Kx + parameter.Ky * parameter.Ky);

            if(knormalized < 0.000001)
                knormalized = 0.0;

            let wlength = Math.sqrt(parameter.windX*parameter.windX + parameter.windY*parameter.windY);

            let L = parameter.windSpeed * parameter.windSpeed * wlength / parameter.g;

            let kx = parameter.Kx / knormalized;
            let ky = parameter.Ky / knormalized;

            let windkdot = kx * parameter.windX/wlength + ky * parameter.windY/wlength;

            if(windkdot == 0.0)
                return 0.0;
                

            let result = Math.exp(-knormalized * knormalized*0.00001*0.00001)  * parameter.A /(knormalized * knormalized * knormalized * knormalized) * Math.exp(-1.0/(knormalized * knormalized * L * L)) 
            * windkdot * windkdot;
            
            return result;
        }

        

        private calculateH0(input:number) : Complex
        {   
            let t = this.randomBM();
            return new Complex(1.0/ Math.sqrt(2.0) * this.randomBM() * Math.sqrt(input), 1.0 / Math.sqrt(2.0)*this.randomBM()  * Math.sqrt(input));
        }


        private randomBM()
        {
            var u = 1.0 - Math.random(); 
            var v = 1.0 - Math.random();

            return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
        }
    }
}