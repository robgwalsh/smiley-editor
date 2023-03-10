export class SmileyMap {
    constructor(
        public readonly w: number,
        public readonly h: number,
        public readonly idStart: number,
        public readonly layers: Int16Array[]) {

        if (layers.length !== 6)
            throw new Error('there should be 6 layers');
    }
}

let map: SmileyMap;

export function useMap() {
    return map;
}

export function setMap(newMap: SmileyMap) {
    map = newMap;
}