namespace Ocean
{
    export class Camera
    {
        position:any;
        lookAt:any;
        up:any;

        angle:number;
        pitch:number;

        speed:number;

        constructor(position0, lookAt0, up0)
        {
            this.position   = vec3.create(position0);
            this.lookAt     = vec3.create(lookAt0);
            this.up         = vec3.create(up0);

            this.angle = -1.035;
            this.pitch = 2.17;
            this.speed = 0.25;
        }

        moveForward() {
            
            vec3.add(this.position, [this.speed * Math.cos(this.angle) * Math.sin(this.pitch), this.speed * Math.cos(this.pitch), this.speed * Math.sin(this.angle) * Math.sin(this.pitch)], this.position);
            vec3.add(this.position, [Math.cos(this.angle) * Math.sin(this.pitch), Math.cos(this.pitch), Math.sin(this.angle) * Math.sin(this.pitch)], this.lookAt);
        }

        moveBackward(){
            vec3.add(this.position, [-this.speed * Math.cos(this.angle) * Math.sin(this.pitch), -this.speed * Math.cos(this.pitch), -this.speed * Math.sin(this.angle) * Math.sin(this.pitch)], this.position);
            vec3.add(this.position, [Math.cos(this.angle) * Math.sin(this.pitch), Math.cos(this.pitch), Math.sin(this.angle) * Math.sin(this.pitch)], this.lookAt);
        }

        moveUp() {
             vec3.add(this.position, [0, this.speed, 0], this.position);
             vec3.add(this.lookAt, [0, this.speed, 0], this.lookAt);
        }   

        moveDown() {
            vec3.add(this.position, [0,   -this.speed, 0], this.position);
            vec3.add(this.lookAt,   [0,   -this.speed, 0], this.lookAt);
        }

        lookRight() {
            
            this.angle += 0.05;
            vec3.add(this.position, [Math.cos(this.angle) * Math.sin(this.pitch), Math.cos(this.pitch), Math.sin(this.angle) * Math.sin(this.pitch)], this.lookAt);
        }

        lookLeft()
        {
            this.angle -= 0.05;
            vec3.add(this.position, [ Math.cos(this.angle) * Math.sin(this.pitch), Math.cos(this.pitch), Math.sin(this.angle) * Math.sin(this.pitch)], this.lookAt);
        }

        lookUp () {
            this.pitch += 0.05;
            vec3.add(this.position, [Math.cos(this.angle) * Math.sin(this.pitch), Math.cos(this.pitch), Math.sin(this.angle) * Math.sin(this.pitch)], this.lookAt);
        }

        lookDown() {
            this.pitch -= 0.05;
            vec3.add(this.position, [Math.cos(this.angle) * Math.sin(this.pitch), Math.cos(this.pitch), Math.sin(this.angle) * Math.sin(this.pitch)], this.lookAt);
        }

        invertPitch()
        {
            this.pitch = -this.pitch;
        }
       

        log()
        {
            console.log(this.position);
            console.log(this.lookAt);
            console.log(this.angle);
            console.log(this.pitch);
        }
        
    }
}

