import { Vector } from "../../model/Vector";
import { assignMapTile, pan, setMapMousePosition } from "../../store/editor-slice";
import { HtmlUtils, MouseButton } from "../../utils/HtmlUtils";

/**
 * Handles events on the map.
 */
export class MapEventHandler {

    private _dragPoint: Vector | null;
    private _draggedAtAll = false;
    private readonly _mouseDown = new Map<MouseButton, boolean>();

    constructor(private readonly _container: HTMLDivElement, private readonly _dispatch) {
        this.registerEvents();
    }

    private readonly handleMouseMove = (e: PointerEvent) => {
        const p = HtmlUtils.getMousePosition(e);

        if (this._mouseDown.get(MouseButton.Left)) {
            this._dispatch(assignMapTile("lmb"));
        } else if (this._mouseDown.get(MouseButton.Right)) {
            // TODO:
            if (this._dragPoint) {
                const oldPoint = this._dragPoint;
                this._dragPoint = new Vector(p.x, p.y);
                const diff = oldPoint.subVector(this._dragPoint);
                this._draggedAtAll = true;
                this._dispatch(pan(diff));
            }
        } else if (this._mouseDown.get(MouseButton.Middle)) {
            this._dispatch(assignMapTile("mmb"));
        }

        this._dispatch(setMapMousePosition(p));
    };

    private readonly handleMouseDown = (e: PointerEvent) => {
        const button = HtmlUtils.getMouseButton(e);
        const p = HtmlUtils.getMousePosition(e);

        this._mouseDown.set(button, true);

        if (button === MouseButton.Left) {
            this._dispatch(assignMapTile("lmb"));
        } else if (button === MouseButton.Right) {
            this._dragPoint = new Vector(p.x, p.y);
        } else if (button === MouseButton.Middle) {
            this._dispatch(assignMapTile("mmb"));
        }
    }

    private readonly handleMouseUp = (e: PointerEvent) => {
        const button = HtmlUtils.getMouseButton(e);
        const p = HtmlUtils.getMousePosition(e);

        if (button === MouseButton.Right) {
            this._dragPoint = null;
            if (this._draggedAtAll) {
                this._draggedAtAll = false;
            } else {
                this._dispatch(assignMapTile("rmb"));
            }
        }

        this._mouseDown.set(button, false);

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