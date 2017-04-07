var Ocean;
(function (Ocean) {
    var Camera = (function () {
        function Camera(position0, lookAt0, up0) {
            this.position = vec3.create(position0);
            this.lookAt = vec3.create(lookAt0);
            this.up = vec3.create(up0);
            this.angle = -1.035;
            this.pitch = 2.17;
            this.speed = 10.0;
        }
        Camera.prototype.moveForward = function () {
            vec3.add(this.position, [this.speed * Math.cos(this.angle) * Math.sin(this.pitch), this.speed * Math.cos(this.pitch), this.speed * Math.sin(this.angle) * Math.sin(this.pitch)], this.position);
            vec3.add(this.position, [Math.cos(this.angle) * Math.sin(this.pitch), Math.cos(this.pitch), Math.sin(this.angle) * Math.sin(this.pitch)], this.lookAt);
        };
        Camera.prototype.moveBackward = function () {
            vec3.add(this.position, [-this.speed * Math.cos(this.angle) * Math.sin(this.pitch), -this.speed * Math.cos(this.pitch), -this.speed * Math.sin(this.angle) * Math.sin(this.pitch)], this.position);
            vec3.add(this.position, [Math.cos(this.angle) * Math.sin(this.pitch), Math.cos(this.pitch), Math.sin(this.angle) * Math.sin(this.pitch)], this.lookAt);
        };
        Camera.prototype.moveUp = function () {
            vec3.add(this.position, [0, this.speed, 0], this.position);
            vec3.add(this.lookAt, [0, this.speed, 0], this.lookAt);
        };
        Camera.prototype.moveDown = function () {
            vec3.add(this.position, [0, -this.speed, 0], this.position);
            vec3.add(this.lookAt, [0, -this.speed, 0], this.lookAt);
        };
        Camera.prototype.lookRight = function () {
            this.angle += 0.25;
            vec3.add(this.position, [Math.cos(this.angle) * Math.sin(this.pitch), Math.cos(this.pitch), Math.sin(this.angle) * Math.sin(this.pitch)], this.lookAt);
        };
        Camera.prototype.lookLeft = function () {
            this.angle -= 0.25;
            vec3.add(this.position, [Math.cos(this.angle) * Math.sin(this.pitch), Math.cos(this.pitch), Math.sin(this.angle) * Math.sin(this.pitch)], this.lookAt);
        };
        Camera.prototype.lookUp = function () {
            this.pitch += 0.05;
            vec3.add(this.position, [Math.cos(this.angle) * Math.sin(this.pitch), Math.cos(this.pitch), Math.sin(this.angle) * Math.sin(this.pitch)], this.lookAt);
        };
        Camera.prototype.lookDown = function () {
            this.pitch -= 0.05;
            vec3.add(this.position, [Math.cos(this.angle) * Math.sin(this.pitch), Math.cos(this.pitch), Math.sin(this.angle) * Math.sin(this.pitch)], this.lookAt);
        };
        Camera.prototype.log = function () {
            console.log(this.position);
            console.log(this.lookAt);
            console.log(this.angle);
            console.log(this.pitch);
        };
        return Camera;
    }());
    Ocean.Camera = Camera;
})(Ocean || (Ocean = {}));
