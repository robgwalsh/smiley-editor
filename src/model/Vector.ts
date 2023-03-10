export class Vector {

    constructor(public readonly x: number, public readonly y: number) { }

    static max(v1: Vector, v2: Vector): Vector {
        return new Vector(Math.max(v1.x, v2.x), Math.max(v1.y, v2.y));
    }

    static min(v1: Vector, v2: Vector): Vector {
        return new Vector(Math.min(v1.x, v2.x), Math.min(v1.y, v2.y));
    }

    public truncate(min: Vector, max: Vector) {
        return new Vector(
            Math.max(min.x, Math.min(max.x, this.x)),
            Math.max(min.y, Math.min(max.y, this.y))
        );
    }

    public clone(): Vector {
        return new Vector(this.x, this.y);
    }

    public round(): Vector {
        return new Vector(Math.round(this.x), Math.round(this.y));
    }

    public floor(): Vector {
        return new Vector(Math.floor(this.x), Math.floor(this.y));
    }

    public equals(v: Vector): boolean {
        return this.x === v.x && this.y === v.y;
    }

    public multVector(v: Vector) {
        return new Vector(this.x * v.x, this.y * v.y);
    }

    public multScalar(s: number) {
        return new Vector(this.x * s, this.y * s);
    }

    public subVector(v: Vector) {
        return new Vector(this.x - v.x, this.y - v.y);
    }

    public subScalar(s: number) {
        return new Vector(this.x - s, this.y - s);
    }

    public toString = (): string => `(${this.x}, ${this.y})`;

    public addVector(v: Vector) {
        return new Vector(this.x + v.x, this.y + v.y);
    }

    public addScalar(s: number) {
        return new Vector(this.x + s, this.y + s);
    }

    public divVector(v: Vector) {
        return new Vector(this.x / v.x, this.y / v.y);
    }

    public divScalar(s: number) {
        return new Vector(this.x / s, this.y / s);
    }

    public min(v: Vector) {
        return new Vector(Math.min(this.x, v.x), Math.min(this.y, v.y));
    }

    public max(v: Vector) {
        return new Vector(Math.max(this.x, v.x), Math.max(this.y, v.y));
    }
}