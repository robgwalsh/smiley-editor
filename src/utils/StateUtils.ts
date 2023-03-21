import { Box, EditorState } from "../model/EditorState";
import { getMapData as getMapData } from "../model/map/MapData";
import { MapFileTexture } from "../model/map/MapFile";
import { LayerState, LayerType } from "../model/map/MapState";
import { IVector } from "../model/Vector";

/**
 * Utilities for deriving values from state
 */
export class StateUtils {

    public static getMousedOverCell(state: EditorState): IVector {
        if (!state.mapMousePosition)
            return { x: 0, y: 0 };

        return {
            x: Math.floor((state.mapMousePosition.x + state.viewport.x) / state.zoom / state.map.header.tileWidth),
            y: Math.floor((state.mapMousePosition.y + state.viewport.y) / state.zoom / state.map.header.tileHeight)
        };
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

    public static setLayerValue(state: EditorState, layerName: string, x: number, y: number, v1: number, v2: number) {
        const mapData = getMapData();
        const layerData = mapData.layers.get(layerName);
        const i = (y * state.map.header.width + x) * 2;
        layerData[i] = v1;
        layerData[i + 1] = v2;
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

    public static getSelectedTexture(state: EditorState): MapFileTexture {
        return state.map.header.textures.find(t => t.name === state.selectedTextureName);
    }

    public static getSpritePickerMousedOverSpriteIndex(state: EditorState) {
        const texture = this.getSelectedTexture(state);
        const tilesWide = texture.width / texture.tileWidth;
        const tilesHigh = texture.height / texture.tileHeight;
        const n = tilesWide * tilesHigh;
        return state.tilePickerGridPosition.y * tilesWide + state.tilePickerGridPosition.x + state.selectedTextureIndex * n;
    }
}