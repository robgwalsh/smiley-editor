// A good, old-fashioned singleton! It is too big to fit in redux
export interface MapData {
    layers: Map<string, Int16Array>;
}

let mapData: MapData;

export function getMapData(): MapData {
    return mapData;
}

export function setMapData(data: MapData) {
    mapData = data;
}