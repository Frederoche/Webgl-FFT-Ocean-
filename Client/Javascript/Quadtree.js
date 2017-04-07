var Ocean;
(function (Ocean) {
    var Quadtree;
    (function (Quadtree_1) {
        var Node = (function () {
            function Node(parent, scale, center, key) {
                this.parent = parent;
                this.scale = scale;
                this.center = center;
                this.key = key;
                this.child = [];
            }
            return Node;
        }());
        Quadtree_1.Node = Node;
        var Quadtree = (function () {
            function Quadtree(gl) {
                this.rootNode = new Node(null, 256, vec3.create([0, 0, 0]), "");
                this.instanceNumber = 0;
                this.chunck = new Ocean.chunck(gl, 128);
                this.chunck.create();
                this.gl = gl;
            }
            Quadtree.prototype.add = function (node) {
                var scaling = node.scale * 0.5;
                var centerUpperLeft = vec3.create();
                vec3.add(node.center, vec3.create([-scaling, 0, scaling]), centerUpperLeft);
                var centerUpperRight = vec3.create();
                vec3.add(node.center, vec3.create([scaling, 0, scaling]), centerUpperRight);
                var centerLowerLeft = vec3.create();
                vec3.add(node.center, vec3.create([-scaling, 0, -scaling]), centerLowerLeft);
                var centerLowerRight = vec3.create();
                vec3.add(node.center, vec3.create([scaling, 0, -scaling]), centerLowerRight);
                node.child[0] = new Node(node, scaling, centerUpperLeft, node.key + "0");
                node.child[1] = new Node(node, scaling, centerUpperRight, node.key + "1");
                node.child[2] = new Node(node, scaling, centerLowerLeft, node.key + "2");
                node.child[3] = new Node(node, scaling, centerLowerRight, node.key + "3");
                this.instanceNumber++;
            };
            Quadtree.prototype.traverse = function (node, delta, ext, wireframe, camera, projMatrix, viewMatrix, reflection, displacement, refraction) {
                if (delta > 128) {
                    this.add(node);
                    for (var i = 0; i < 4; i++) {
                        this.traverse(node.child[i], delta / 2, ext, wireframe, camera, projMatrix, viewMatrix, reflection, displacement, refraction);
                    }
                }
                else {
                    this.chunck.Draw(ext, wireframe, camera, projMatrix, viewMatrix, reflection, displacement, refraction);
                }
            };
            return Quadtree;
        }());
        Quadtree_1.Quadtree = Quadtree;
    })(Quadtree = Ocean.Quadtree || (Ocean.Quadtree = {}));
})(Ocean || (Ocean = {}));
