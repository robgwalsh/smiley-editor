import { Vector } from "../../model/Vector";
import { pan, setMapMousePosition } from "../../store/editor-slice";
import { HtmlUtils, MouseButton } from "../../utils/HtmlUtils";

/**
 * Handles events on the map.
 */
export class MapEventHandler {

    private _dragPoint: Vector | null;

    constructor(private readonly _container: HTMLDivElement, private readonly _dispatch) {
        this.registerEvents();
    }

    private readonly handleMouseMove = (e: PointerEvent) => {
        const p = HtmlUtils.getMousePosition(e);

        if (this._dragPoint) {
            const oldPoint = this._dragPoint;
            this._dragPoint = new Vector(p.x, p.y);
            const diff = oldPoint.subVector(this._dragPoint);
            this._dispatch(pan(diff));
        }

        this._dispatch(setMapMousePosition(p));
    };

    private readonly handleMouseDown = (e: PointerEvent) => {
        const button = HtmlUtils.getMouseButton(e);
        const p = HtmlUtils.getMousePosition(e);

        if (button === MouseButton.Right) {
            this._dragPoint = new Vector(p.x, p.y);
        } else {

        }
    }

    private readonly handleMouseUp = (e: PointerEvent) => {
        const p = HtmlUtils.getMousePosition(e);

        if (this._dragPoint) {
            this._dragPoint = null;
        } else {

        }

        e.preventDefault();
        e.stopPropagation();
    }

    private registerEvents() {
        this._container.addEventListener('mousemove', this.handleMouseMove);
        this._container.addEventListener('mousedown', this.handleMouseDown);
        this._container.addEventListener('mouseup', this.handleMouseUp);
    }

    public dispose() {
        this._container.removeEventListener('mousemove', this.handleMouseMove);
        this._container.removeEventListener('mousedown', this.handleMouseDown);
        this._container.removeEventListener('mouseup', this.handleMouseUp);
    }
}