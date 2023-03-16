import { LegacyMapReader } from "./LegacyMapReader";
import { MapData } from "./MapData";
import { MapFile, MapFileVisualLayer, MapHeader } from "./MapFile";
import { LayerType, MapState } from "./MapState";

export function convertMapFileToState(map: MapFile): [MapState, MapData] {

    const state: MapState = createDefaultState(map.header);
    state.visualLayers = map.visualLayers.map((visualLayer, i) => {
        return {
            layer: LayerType.Visual,
            name: `Visual ${i}`,
            textureNames: ["mainlayer.png"], // TODO:
            visible: true
        }
    });

    const data: MapData = {
        layers: new Map<string, Int16Array>()
    };

    data.layers[state.enemyLayer.name] = base64ToArrayBuffer(map.enemyLayer.dataBase64);
    data.layers[state.idLayer.name] = base64ToArrayBuffer(map.idLayer.dataBase64);
    data.layers[state.itemLayer.name] = base64ToArrayBuffer(map.itemLayer.dataBase64);
    data.layers[state.variableLayer.name] = base64ToArrayBuffer(map.variableLayer.dataBase64);
    data.layers[state.walkLayer.name] = base64ToArrayBuffer(map.walkLayer.dataBase64);
    data.layers[state.idLayer.name] = base64ToArrayBuffer(map.idLayer.dataBase64);

    for (const visualLayer of map.visualLayers) {
        data.layers[`Visual ${visualLayer.index}`] = base64ToArrayBuffer(visualLayer.dataBase64);
    }

    return [state, data]
}

export function convertMapStateToFile(map: MapState, data: MapData): MapFile {
    return {
        header: { ...map.header },
        enemyLayer: {
            dataBase64: arrayBufferToBase64(data.layers[map.enemyLayer.name])
        },
        idLayer: {
            dataBase64: arrayBufferToBase64(data.layers[map.idLayer.name])
        },
        itemLayer: {
            dataBase64: arrayBufferToBase64(data.layers[map.itemLayer.name])
        },
        variableLayer: {
            dataBase64: arrayBufferToBase64(data.layers[map.variableLayer.name])
        },
        walkLayer: {
            dataBase64: arrayBufferToBase64(data.layers[map.walkLayer.name])
        },
        visualLayers: map.visualLayers.map((layer, i) => {
            return {
                dataBase64: arrayBufferToBase64(data.layers[layer.name]),
                index: i,
            } as MapFileVisualLayer;
        })
    }
}

export function convertLegacyFileToState(legacyFileContents: string): [MapState, MapData] {
    // from Environment::loadArea, https://github.com/robgwalsh/smileysmazehunt/blob/main/src/environment.cpp

    const loader = new LegacyMapReader(legacyFileContents);

    // First line is the evnt id offset for this area
    const idStart = loader.readInt(1);
    loader.readNewline();
    const [width, height] = loader.readSize();

    if (width < 1 || width > 999 || height < 1 || height > 999)
        throw new Error('not a valid legacy .smh file!');

    const state: MapState = createDefaultState({
        width,
        height,
        idStart,
        song: "TODO:",
        textures: [] // TODO:
    });
    const data: MapData = { layers: new Map<string, Int16Array>() }

    // The layers are matrices of 3 digit ascii numbers, with the width/height repeated before each
    data.layers[state.idLayer.name] = loader.readLayer(width, height);
    loader.readSize();
    data.layers[state.variableLayer.name] = loader.readLayer(width, height);
    loader.readSize();
    data.layers["Visual 0"] = loader.readLayer(width, height); // terrain data
    loader.readSize();
    data.layers[state.walkLayer.name] = loader.readLayer(width, height); // collision data
    loader.readSize();
    data.layers[state.itemLayer.name] = loader.readLayer(width, height);
    loader.readSize();
    data.layers[state.enemyLayer.name] = loader.readLayer(width, height);

    return [state, data];
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

function base64ToArrayBuffer(base64: string) {
    var binaryString = window.atob(base64);
    var len = binaryString.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

function createDefaultState(header: MapHeader): MapState {
    return {
        header: { ...header },
        idLayer: {
            layer: LayerType.Id,
            textureNames: [],
            name: "id",
            visible: true
        },
        enemyLayer: {
            layer: LayerType.Enemy,
            textureNames: ["enemylayer.PNG"],
            name: "Enemy",
            visible: true
        },
        itemLayer: {
            layer: LayerType.Item,
            textureNames: ["itemlayer1.png", "itemlayer2.png"],
            name: "Item",
            visible: true
        },
        variableLayer: {
            layer: LayerType.Variable,
            textureNames: [],
            name: "Variable",
            visible: true
        },
        walkLayer: {
            layer: LayerType.Walk,
            textureNames: ["walklayer.PNG"],
            name: "Walk",
            visible: true
        },
        visualLayers: []
    };
}