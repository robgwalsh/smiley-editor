import { VisualLayerType, MapHeader, MapFile, MapFileVisualLayer } from "./MapFile";

export class SmileyMap {
    constructor(
        public readonly header: MapHeader,
        public readonly idLayer: MapLayer,
        public readonly variableLayer: MapLayer,
        public readonly walkLayer: MapLayer,
        public readonly itemLayer: MapLayer,
        public readonly enemyLayer: MapLayer,
        public readonly visualLayers: VisualMapLayer[]) {
    }

    public toMapFile(): MapFile {
        return {
            header: { ...this.header },
            enemyLayer: {
                dataBase64: this.arrayBufferToBase64(this.enemyLayer.data.buffer)
            },
            idLayer: {
                dataBase64: this.arrayBufferToBase64(this.idLayer.data.buffer)
            },
            itemLayer: {
                dataBase64: this.arrayBufferToBase64(this.itemLayer.data.buffer)
            },
            variableLayer: {
                dataBase64: this.arrayBufferToBase64(this.variableLayer.data.buffer)
            },
            walkLayer: {
                dataBase64: this.arrayBufferToBase64(this.walkLayer.data.buffer)
            },
            visualLayers: this.visualLayers.map((layer, i) => {
                return {
                    dataBase64: this.arrayBufferToBase64(layer.data.buffer),
                    index: i,
                    type: layer.type
                } as MapFileVisualLayer;
            })
        }
    }

    private arrayBufferToBase64(buffer: ArrayBuffer) {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }
}

export class MapLayer {
    constructor(public readonly data: Int16Array) {
    }
}

export class VisualMapLayer extends MapLayer {
    constructor(data: Int16Array, public readonly index: number, public readonly type: VisualLayerType) {
        super(data);
    }
}

let map: SmileyMap;

export function useMap() {
    return map;
}

export function setMap(newMap: SmileyMap) {
    map = newMap;
}
