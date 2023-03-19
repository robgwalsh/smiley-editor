import { EditorState } from "../../model/EditorState";
import { MapData } from "../../model/map/MapData";
import { MapError } from "../../model/map/MapError";
import { LayerType } from "../../model/map/MapState";
import { Texture, Textures } from "../../model/Textures";
import { StateUtils } from "../../utils/StateUtils";

/**
 * Performs direct canvas rendering for the MapViewer
 */
export class MapRenderer {

    private readonly _cx: CanvasRenderingContext2D;

    constructor(private readonly _canvas: HTMLCanvasElement) {
        this._cx = this._canvas.getContext('2d');
    }

    public render(state: EditorState, mapData: MapData) {

        // You have to set this every time
        this._cx.imageSmoothingEnabled = false;

        this._cx.clearRect(0, 0, state.viewport.width, state.viewport.height);

        for (const visualLayer of state.map.visualLayers) {
            this.renderLayer(this._cx, state, mapData.layers.get(visualLayer.name), LayerType.Visual);
        }
        this.renderLayer(this._cx, state, mapData.layers.get(state.map.walkLayer.name), LayerType.Walk);
        this.renderLayer(this._cx, state, mapData.layers.get(state.map.itemLayer.name), LayerType.Item);
        this.renderLayer(this._cx, state, mapData.layers.get(state.map.enemyLayer.name), LayerType.Enemy);

        // Draw the moused over cell
        if (state.mouseOnMap) {
            const box = StateUtils.getMousedOverCellScreenBox(state);

            this._cx.strokeStyle = "red";
            this._cx.lineWidth = 3;
            this._cx.strokeRect(box.x, box.y, box.width, box.height);
        }
    }

    private renderLayer(cx: CanvasRenderingContext2D, state: EditorState, layer: Int16Array, layerType: LayerType) {
        if (!layer) {
            throw new Error("'layer' cant be null");
        }
        if (state.viewport.width <= 0 || state.viewport.height <= 0)
            return;

        const vp = state.viewport;

        const tileWidth = state.map.header.tileWidth;
        const tileHeight = state.map.header.tileHeight;

        const leftTile = Math.max(0, Math.floor(vp.x / state.zoom / tileWidth) - 1);
        const rightTile = Math.min(state.map.header.width - 1, Math.ceil((vp.x + vp.width) / state.zoom / tileWidth));
        const topTile = Math.max(0, Math.floor(vp.y / state.zoom / tileHeight) - 1);
        const bottomTile = Math.min(state.map.header.height - 1, Math.ceil((vp.y + vp.height) / state.zoom / tileHeight));

        for (let tileX = leftTile; tileX <= rightTile; tileX++) {
            for (let tileY = topTile; tileY <= bottomTile; tileY++) {
                const index = tileY * state.map.header.width + tileX;

                // Each cell in the matrix has 2 int16s: the first is the id of the texture, the second
                // is the index of the tile within that texture.
                const textureId = layer[index * 2];
                const tile = layer[index * 2 + 1];
                if (tile > 0) {
                    const textureInfo = state.map.header.textures.find(t => t.id === textureId);
                    if (!textureInfo)
                        throw new MapError(`${layerType} layer ${tileX}, ${tileY} points to texture ${textureId} which doesn't exist`);

                    const texture: Texture = Textures.getTexture(state.map.header.textures[textureId].name);
                    texture.drawTile(cx, tile,
                        state.zoom * (tileX * tileWidth) - vp.x,
                        state.zoom * (tileY * tileHeight) - vp.y,
                        state.zoom
                    );
                }
            }
        }
    }
}