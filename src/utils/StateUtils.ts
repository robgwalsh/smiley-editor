import { Box, EditorState } from "../model/EditorState";
import { getMapData as getMapData } from "../model/map/MapData";
import { LayerState, LayerType } from "../model/map/MapState";
import { Vector } from "../model/Vector";

/**
 * Utilities for deriving values from state
 */
export class StateUtils {

    public static getMousedOverCell(state: EditorState): Vector {
        return new Vector(
            Math.floor((state.mouseX + state.viewport.x) / state.zoom / state.map.header.tileWidth),
            Math.floor((state.mouseY + state.viewport.y) / state.zoom / state.map.header.tileHeight)
        );
    }

    /**
     * Gets all map layers in their render order
     */
    public static getLayers(state: EditorState): LayerState[] {
        return [
            ...state.map.visualLayers,
            state.map.walkLayer,
            state.map.itemLayer,
            state.map.enemyLayer,
            state.map.variableLayer
        ];
    }

    public static getLayer(state: EditorState, name: string): LayerState {
        return this.getLayers(state).find(s => s.name === name);
    }

    /**
     * Returns the 2 values at the specified position within the specified layer
     * @param layer
     * @param index
     */
    public static getLayerValue(state: EditorState, layerName: string, x: number, y: number): [number, number] {
        const mapData = getMapData();
        const layerData = mapData.layers.get(layerName);
        const i = (y * state.map.header.width + x) * 2;
        return [
            layerData[i],
            layerData[i + 1],
        ];
    }

    public static getMousedOverCellScreenBox(state: EditorState): Box {
        const cell = this.getMousedOverCell(state);

        return {
            x: cell.x * state.map.header.tileWidth * state.zoom - state.viewport.x,
            y: cell.y * state.map.header.tileHeight * state.zoom - state.viewport.y,
            width: state.map.header.tileWidth * state.zoom,
            height: state.map.header.tileHeight * state.zoom
        };
    }
}