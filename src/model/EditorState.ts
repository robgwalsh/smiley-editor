import { SmileyMap } from "./SmileyMap";
import { Viewport } from "./Viewport";

export interface EditorState {
    mapFileName: string;
    activeLayer: LayerState;
    selectedTileIndex: number;
    layers: LayerState[];
    viewport: Viewport;
    cellDiameter: number;
    revision: number;
}


/**
 * The layers in a smiley map. The numeric value is the index of that layer within the save file
 */
export enum Layer {
    Id = 0,
    Variable = 1,
    Main = 2,
    Walk = 3,
    Item = 4,
    Enemy = 5,
}

export interface LayerState {
    layer: Layer;
    name: string;
    displayIndex: number;
    visible: boolean;
    textureName: string;
}
