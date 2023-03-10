import { Rect } from "../model/Rect";
import { Vector } from "../model/Vector";

export class Utils {

    public static distance(p1: Vector, p2: Vector): number {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    }

    /**
     * Returns a number truncated to the given range (inclusive)
     */
    public static truncate(value: number, min: number, max: number) {
        return Math.min(max, Math.max(min, value));
    }

    /**
     * Returns the angle between (x1,y1) and (x2,y2)
     */
    public static getAngleBetween(p1: Vector, p2: Vector): number {
        if (p1.x === p2.x) {
            if (p1.y > p2.y) {
                return 3.0 * Math.PI / 2.0;
            } else {
                return Math.PI / 2.0;
            }
        } else {
            let angle = Math.atan((p2.y - p1.y) / (p2.x - p1.x));
            if (p1.x - p2.x > 0) angle += Math.PI;
            return angle;
        }
    }

    public static polygonContains(polygon: Vector[], p: Vector): boolean {
        let c = false;
        let i: number;
        let j: number;

        for (i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            if (((polygon[i].y > p.y) !== (polygon[j].y > p.y)) &&
                (p.x < (polygon[j].x - polygon[i].x) * (p.y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x))
                c = !c;
        }

        return c;
    }

    /**
     * Returns the location of a point rotated the given angle around the given origin.
     *
     * @param p The point to rotate
     * @param center The center point around which to rotate
     * @param angle The angle (in radians) to rotate the point
     */
    public static getRotatedPoint(p: Vector, center: Vector, angle: number) {

        if (angle === 0)
            return p;

        // Translate to origin
        const tempX = p.x - center.x;
        const tempY = p.y - center.y;

        // Rotate
        const rotatedX = tempX * Math.cos(angle) - tempY * Math.sin(angle);
        const rotatedY = tempX * Math.sin(angle) + tempY * Math.cos(angle);

        // Translate back
        return new Vector(
            rotatedX + center.x,
            rotatedY + center.y);
    }

    public static getBoundingBox(polygon: Vector[]): Rect {
        let left = Number.MAX_VALUE;
        let right = 0;
        let top = Number.MAX_VALUE;
        let bottom = 0;
        polygon.forEach(p => {
            left = Math.min(p.x, left);
            right = Math.max(p.x, right);
            top = Math.min(p.y, top);
            bottom = Math.max(p.y, bottom);
        });

        return new Rect(left, top, right - left, bottom - top);
    }

    public static polygonIntersects(polygon: Vector[], rect: Rect): boolean {

        // Simple case - test if the polygon is totally contained in the rect
        if (rect.containsRect(this.getBoundingBox(polygon)))
            return true;

        // Otherwise see if any of the edges of the rectangle intersect any of the edges of the polygon.
        for (let i = 0; i < polygon.length; i++) {
            const l1 = new Vector(polygon[i].x, polygon[i].y);
            let l2;
            if (i === polygon.length - 1)
                l2 = new Vector(polygon[0].x, polygon[0].y);
            else
                l2 = new Vector(polygon[i + 1].x, polygon[i + 1].y);

            if (this.doLinesIntersect(new Vector(rect.x, rect.y), new Vector(rect.x + rect.w, rect.y), l1, l2))
                return true;
            if (this.doLinesIntersect(new Vector(rect.x + rect.w, rect.y), new Vector(rect.x + rect.w, rect.y + rect.h), l1, l2))
                return true;
            if (this.doLinesIntersect(new Vector(rect.x + rect.w, rect.y + rect.h), new Vector(rect.x, rect.y + rect.h), l1, l2))
                return true;
            if (this.doLinesIntersect(new Vector(rect.x, rect.y), new Vector(rect.x, rect.y + rect.h), l1, l2))
                return true;
        }

        return false;
    }

    /**
     * Returns whether or not 2 integer ranges overlap
     *
     * @param x1 start of range1
     * @param x2 end of range1
     * @param y1 start of range2
     * @param y2 end of range2
     * @returns
     */
    public static rangesOverlap(x1: number, x2: number, y1: number, y2: number) {
        return x1 <= y2 && y1 <= x2;
    }

    /**
     * Returns the point 2 line segments intersect
     *
     * @param start1 start of first line
     * @param end1 end of first line
     * @param start2 start of second line
     * @param end2 end of second line
     */
    public static findIntersection(start1: Vector, end1: Vector, start2: Vector, end2: Vector) {
        const a1 = end1.y - start1.y;
        const b1 = start1.x - end1.x;
        const c1 = a1 * start1.x + b1 * start1.y;

        const a2 = end2.y - start2.y;
        const b2 = start2.x - end2.x;
        const c2 = a2 * start2.x + b2 * start2.y;

        const delta = a1 * b2 - a2 * b1;

        //If lines are parallel, the result will be (NaN, NaN).
        if (delta === 0)
            return null;

        return new Vector((b2 * c1 - b1 * c2) / delta, (a1 * c2 - a2 * c1) / delta);
    }

    // Given three colinear points p, q, r, the function checks if
    // point q lies on line segment 'pr'
    private static isOnLineSegment(p: Vector, q: Vector, r: Vector): boolean {
        if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
            q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y))
            return true;

        return false;
    }

    // To find orientation of ordered triplet (p, q, r).
    // The function returns following values
    // 0 --> p, q and r are colinear
    // 1 --> Clockwise
    // 2 --> Counterclockwise
    private static getLineOrientation(p: Vector, q: Vector, r: Vector): number {
        // See https://www.geeksforgeeks.org/orientation-3-ordered-points/
        // for details of below formula.
        const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);

        if (val === 0) return 0;  // colinear

        return (val > 0) ? 1 : 2; // clock or counterclock wise
    }

    // The main function that returns true if line segment 'p1q1'
    // and 'p2q2' intersect.
    private static doLinesIntersect(p1: Vector, q1: Vector, p2: Vector, q2: Vector): boolean {
        // Find the four orientations needed for general and
        // special cases
        const o1 = this.getLineOrientation(p1, q1, p2);
        const o2 = this.getLineOrientation(p1, q1, q2);
        const o3 = this.getLineOrientation(p2, q2, p1);
        const o4 = this.getLineOrientation(p2, q2, q1);

        // General case
        if (o1 !== o2 && o3 !== o4)
            return true;

        // Special Cases
        // p1, q1 and p2 are colinear and p2 lies on segment p1q1
        if (o1 === 0 && this.isOnLineSegment(p1, p2, q1)) return true;

        // p1, q1 and q2 are colinear and q2 lies on segment p1q1
        if (o2 === 0 && this.isOnLineSegment(p1, q2, q1)) return true;

        // p2, q2 and p1 are colinear and p1 lies on segment p2q2
        if (o3 === 0 && this.isOnLineSegment(p2, p1, q2)) return true;

        // p2, q2 and q1 are colinear and q1 lies on segment p2q2
        if (o4 === 0 && this.isOnLineSegment(p2, q1, q2)) return true;

        return false; // Doesn't fall in any of the above cases
    }
}