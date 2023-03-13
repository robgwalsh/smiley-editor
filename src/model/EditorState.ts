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
    mouseX: number;
    mouseY: number;
    mouseOnMap: boolean;
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

export function initialEditorState() {
    const initialState: EditorState = {
        activeLayer: null,
        mapFileName: null,
        mouseOnMap: false,
        mouseX: 0,
        mouseY: 0,
        selectedTileIndex: 1,
        revision: 0,
        cellDiameter: 64,
        viewport: {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            zoom: 1
        },
        layers: [
            {
                layer: Layer.Id,
                textureName: "",
                displayIndex: 5,
                name: "Id",
                visible: true
            },
            {
                layer: Layer.Variable,
                textureName: "",
                displayIndex: 4,
                name: "Variable",
                visible: true
            },
            {
                layer: Layer.Main,
                textureName: "mainlayer.png",
                displayIndex: 0,
                name: "Main",
                visible: true
            },
            {
                layer: Layer.Walk,
                textureName: "walklayer.PNG",
                displayIndex: 1,
                name: "Walk",
                visible: true
            },
            {
                layer: Layer.Item,
                textureName: "itemlayer1.png", // TODO: multiple textures
                displayIndex: 2,
                name: "Item",
                visible: true
            },
            {
                layer: Layer.Enemy,
                textureName: "enemylayer.PNG",
                displayIndex: 3,
                name: "Enemy",
                visible: true
            },
        ]
    };

    initialState.activeLayer = initialState.layers[+Layer.Main];

    return initialState;
}