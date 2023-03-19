import { Vector } from "../../model/Vector";
import { pan, setMousePosition } from "../../store/editor-slice";
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
            const diff = this._dragPoint.subVector(p);
            this._dragPoint = p;
            this._dispatch(pan(diff));
        }

        this._dispatch(setMousePosition(p));
    };

    private readonly handleMouseDown = (e: PointerEvent) => {
        const button = HtmlUtils.getMouseButton(e);
        const p = HtmlUtils.getMousePosition(e);

        if (button === MouseButton.Right) {
            this._dragPoint = p;
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