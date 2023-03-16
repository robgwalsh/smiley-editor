import { MapHeader } from "./MapFile";

/**
 * Represents the state of the map in the store. Can be converted to and from a MapFile.
 */
export interface MapState {
    header: MapHeader,
    idLayer: LayerState,
    variableLayer: LayerState,
    walkLayer: LayerState,
    itemLayer: LayerState,
    enemyLayer: LayerState,
    visualLayers: LayerState[]
}

export enum LayerType {
    Visual,
    Id,
    Variable,
    Walk,
    Item,
    Enemy,
}

export interface LayerState {
    layer: LayerType;
    name: string;
    visible: boolean;
    textureNames: string[];
}