import { EditorState, Layer, LayerState } from "./EditorState";

export class EditorStateFactory {
    static initialState() {
        const initialState: EditorState = {
            activeLayer: null,
            mapFileName: null,
            selectedTileIndex: 1,
            revision: 0,
            cellDiameter: 64,
            windowHeight: 0,
            windowWidth: 0,
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
                    textureName: "enemylayer.PNG", // TODO:
                    displayIndex: 5,
                    name: "Id",
                    visible: true
                },
                {
                    layer: Layer.Variable,
                    textureName: "enemylayer.PNG", // TODO:
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
}