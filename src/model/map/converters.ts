import { LegacyMapReader } from "./LegacyMapReader";
import { MapData } from "./MapData";
import { MapFile, MapFileVisualLayer, MapFileHeader, TextureType, MapFileTexture } from "./MapFile";
import { LayerType, MapState } from "./MapState";

export function convertMapFileToState(map: MapFile): [MapState, MapData] {

    const state: MapState = createDefaultState(map.header);
    state.visualLayers = map.visualLayers.map((visualLayer, i) => {
        return {
            layer: LayerType.Visual,
            name: `Visual ${i}`,
            visible: true,
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
        tileWidth: 64,
        tileHeight: 64,
        idStart,
        song: "TODO:",
        textures: createCoreTextures()
    });
    state.visualLayers.push({
        layer: LayerType.Visual,
        name: "Visual 1",
        visible: true
    })

    const data: MapData = { layers: new Map<string, Int16Array>() }

    // The layers are matrices of 3 digit ascii numbers, with the width/height repeated before each
    data.layers.set(state.idLayer.name, loader.readLayer(0, width, height));
    loader.readSize();
    data.layers.set(state.variableLayer.name, loader.readLayer(0, width, height));
    loader.readSize();
    data.layers.set(state.visualLayers[0].name, loader.readLayer(0, width, height)); // terrain data
    loader.readSize();
    data.layers.set(state.walkLayer.name, loader.readLayer(1, width, height)); // collision data
    loader.readSize();
    data.layers.set(state.itemLayer.name, loader.readLayer(2, width, height));
    loader.readSize();
    data.layers.set(state.enemyLayer.name, loader.readLayer(3, width, height));

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

function createDefaultState(header: MapFileHeader): MapState {
    return {
        header,
        idLayer: {
            layer: LayerType.Id,
            name: "id",
            visible: true
        },
        enemyLayer: {
            layer: LayerType.Enemy,
            name: "Enemy",
            visible: true
        },
        itemLayer: {
            layer: LayerType.Item,
            name: "Item",
            visible: true
        },
        variableLayer: {
            layer: LayerType.Variable,
            name: "Variable",
            visible: true
        },
        walkLayer: {
            layer: LayerType.Walk,
            name: "Walk",
            visible: true
        },
        visualLayers: []
    };
}

/**
 * Creates texture definitions for the textures in the core game.
 * @returns
 */
function createCoreTextures(): MapFileTexture[] {
    return [
        createCoreTexture(0, "main", ["https://smiley-editor.s3.amazonaws.com/mainlayer.png"]),
        createCoreTexture(1, "walk", ["https://smiley-editor.s3.amazonaws.com/walklayer.PNG"]),
        createCoreTexture(2, "item", ["https://smiley-editor.s3.amazonaws.com/itemlayer1.png", "https://smiley-editor.s3.amazonaws.com/itemlayer2.png"]),
        createCoreTexture(3, "enemy", ["https://smiley-editor.s3.amazonaws.com/enemylayer.PNG"])
    ];
}

function createCoreTexture(id: number, name: string, urls: string[]): MapFileTexture {
    return {
        name: name,
        textureType: TextureType.Normal,
        tilesetPaths: urls,
        width: 1024, height: 1024,
        tileWidth: 64, tileHeight: 64,
        id
    };
}