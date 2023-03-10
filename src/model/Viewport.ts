// import { Vector } from "./Vector";

export interface Viewport {
    x: number;
    y: number;
    width: number;
    height: number;
    zoom: number;
}

// export class Viewport {

//     private _size: Vector = new Vector(0, 0);

//     /**
//      * Top left corner of the viewport relative to the top left of the map, in screen pixels.
//      */
//     public offset: Vector = new Vector(0, 0);
//     /**
//      * Size of the viewport in screen pixels.
//      */
//     public get size() { return this._size; }
//     public zoom: number = 1;
//     public cellDiameter = 64;

//     constructor() {
//     }

//     public getCellTopLeft(v: Vector): Vector {
//         const absolute = new Vector(v.x * this.cellDiameter, v.y * this.cellDiameter * this.zoom);
//         return absolute.subVector(this.offset);
//     }

//     // public forEachVisibleCell(func: (cell: Vector) => any) {
//     //     for (const cell in this.getVisibleCells()) {

//     //     }
//     // }

//     public setSize(size: Vector) {
//         this._size = size;
//     }

//     public getVisibleCells(): Vector[] {
//         const cells: Vector[] = [];

//         const leftTile = this.offset.x / this.cellDiameter;
//         const rightTile = (this.offset.x + this.size.x) / this.cellDiameter;
//         const topTile = this.offset.y / this.cellDiameter;
//         const bottomTile = (this.offset.y + this.size.y) / this.cellDiameter;

//         for (let x = leftTile; x <= rightTile; x++) {
//             for (let y = topTile; y <= bottomTile; y++) {
//                 cells.push(new Vector(x, y));
//             }
//         }
//         return cells;
//     }
// }