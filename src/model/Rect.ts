import { Vector } from './Vector';

/**
 * A rectangle.
 */
export class Rect {

    /**
     * Constructs a new Rect.
     *
     * @param x x coordinate of the top left corner
     * @param y y coordinate of the top left corner
     * @param w width of the rectangle
     * @param h height of the rectangle
     */
    constructor(public x: number, public y: number, public w: number, public h: number) { }

    /**
     * Creates the Rect formed by 2 opposing corner points
     * @param c1 a corner
     * @param c2 the corner opposite c1
     */
    public static fromCorners(c1: Vector, c2: Vector) {
        return new Rect(
            Math.min(c1.x, c2.x),
            Math.min(c1.y, c2.y),
            Math.abs(c1.x - c2.x),
            Math.abs(c1.y - c2.y));
    }

    /**
     * Returns an array of Vectors containing the Rect's 4 corner points. They are
     * ordered: top left, top right, bottom right, bottom left
     * @returns
     */
    public toCornerPoints(): Vector[] {
        return [
            new Vector(this.x, this.y),
            new Vector(this.right, this.y),
            new Vector(this.right, this.bottom),
            new Vector(this.x, this.bottom)
        ];
    }

    /**
     * Returns the center of the rectangle
     */
    public center(): Vector {
        return new Vector(this.x + this.w / 2, this.y + this.h / 2);
    }

    /**
     * Returns whether or not the Rect contains the given point.
     */
    public containsPoint(p: Vector): boolean {
        return p.x >= this.x && p.x <= this.x + this.w && p.y >= this.y && p.y <= this.y + this.h;
    }

    /**
     * Returns the union of this Rect and another
     */
    public union(rect: Rect): Rect {

        const left = Math.min(this.x, rect.x);
        const top = Math.min(this.y, rect.y);
        const right = Math.max(this.right, rect.right);
        const bottom = Math.max(this.bottom, rect.bottom);

        return new Rect(left, top, right - left, bottom - top);
    }

    /**
     * Returns the intersection of this Rect and another
     */
    public intersection(rect: Rect): Rect {
        const left = Math.max(this.x, rect.x);
        const top = Math.max(this.y, rect.y);
        const right = Math.min(this.right, rect.right);
        const bottom = Math.min(this.bottom, rect.bottom);

        return new Rect(left, top, right - left, bottom - top);
    }

    /**
     * Returns whether or not the given rect intersects this one.
     */
    public intersects(rect: Rect): boolean {
        const a = this;
        const b = rect;

        return a.x < b.right && a.right > b.x &&
            a.y < b.bottom && a.bottom > b.y;
    }

    /**
     * Returns a new Rect that is this Rect multiplied by the given vector
     */
    public mul(v: Vector): Rect {
        return new Rect(
            this.x * v.x,
            this.y * v.y,
            this.w * v.x,
            this.h * v.y
        );
    }

    /**
     * Returns a new Rect that is this Rect multiplied by a scalar.
     */
    public mulScalar(s: number): Rect {
        return new Rect(
            this.x * s,
            this.y * s,
            this.w * s,
            this.h * s
        );
    }

    /**
     * Returns a new rect that is this Rect plus the given vector.
     */
    public add(v: Vector): Rect {
        return new Rect(this.x + v.x, this.y + v.y, this.w, this.h);
    }

    /**
     * Returns a new rect that is this Rect minus the given vector.
     */
    public div(v: Vector): Rect {
        return new Rect(
            this.x / v.x,
            this.y / v.y,
            this.w / v.x,
            this.h / v.y
        );
    }

    /**
     * Returns a Rect grown the specified amount in each direction
     */
    public grow(left: number, top: number, right: number, bottom: number): Rect {
        return new Rect(
            this.x - left,
            this.y - top,
            this.w + left + right,
            this.h + top + bottom
        );
    }

    /**
     * Returns whether or not the given rect is fully contained within this Rect. The borders
     * of the rects can overlap
     */
    public containsRect(rect: Rect): boolean {
        return rect.x >= this.x && rect.right <= this.right && rect.y >= this.y && rect.bottom <= this.bottom;
    }

    public clone(): Rect {
        return new Rect(this.x, this.y, this.w, this.h);
    }

    public get leftMiddle(): Vector {
        return new Vector(this.x, this.y + this.h / 2);
    }

    public get topMiddle(): Vector {
        return new Vector(this.x + this.w / 2, this.y);
    }

    public get rightMiddle(): Vector {
        return new Vector(this.right, this.y + this.h / 2);
    }

    public get bottomMiddle(): Vector {
        return new Vector(this.x + this.w / 2, this.bottom);
    }

    public getCorner(corner: Corner): Vector {
        switch (corner) {
            case Corner.TopLeft:
                return this.topLeft;
            case Corner.TopRight:
                return this.topRight;
            case Corner.BottomRight:
                return this.bottomRight;
            case Corner.BottomLeft:
                return this.bottomLeft;
            default:
                throw new Error(`invalid corner value: ${corner}`);
        }
    }

    public get right(): number { return this.x + this.w; }

    public get bottom(): number { return this.y + this.h; }

    public get topLeft(): Vector { return new Vector(this.x, this.y); }

    public get topRight(): Vector { return new Vector(this.right, this.y); }

    public get bottomRight(): Vector { return new Vector(this.right, this.bottom); }

    public get bottomLeft(): Vector { return new Vector(this.x, this.bottom); }
}

export enum Corner {
    TopLeft = 0,
    TopRight = 1,
    BottomRight = 2,
    BottomLeft = 3
}