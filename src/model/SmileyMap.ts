export class SmileyMap {
    constructor(
        public readonly w: number,
        public readonly h: number,
        public readonly idStart: number,
        public readonly idLayer: Int16Array,
        public readonly variableLayer: Int16Array,
        public readonly terrainLayer: Int16Array,
        public readonly enemyLayer: Int16Array,
        public readonly eventLayer: Int16Array) {
    }
}