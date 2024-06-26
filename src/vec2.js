export var Vec2;
(function (Vec2) {
    Vec2.zero = { x: 0, y: 0 };
    function add(v1, v2) {
        return {
            x: v1.x + v2.x,
            y: v1.y + v2.y
        };
    }
    Vec2.add = add;
    function sub(v1, v2) {
        return {
            x: v1.x - v2.x,
            y: v1.y - v2.y
        };
    }
    Vec2.sub = sub;
    function mul(v1, v) {
        return {
            x: v1.x * v,
            y: v1.y * v
        };
    }
    Vec2.mul = mul;
    function div(v1, v) {
        return {
            x: v1.x / v,
            y: v1.y / v
        };
    }
    Vec2.div = div;
    function length(v) {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    }
    Vec2.length = length;
    function lengthSqr(v) {
        return v.x * v.x + v.y * v.y;
    }
    Vec2.lengthSqr = lengthSqr;
})(Vec2 || (Vec2 = {}));
