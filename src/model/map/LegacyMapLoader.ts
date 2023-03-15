import { VisualLayerType } from "./MapFile";
import { MapLayer, SmileyMap, VisualMapLayer } from "./SmileyMap";

export class LegacyMapLoader {

    private _index = 0;

    private constructor(private readonly _data: string) {
    }

    public static load(data: string): SmileyMap {

        // from Environment::loadArea, https://github.com/robgwalsh/smileysmazehunt/blob/main/src/environment.cpp

        const loader = new LegacyMapLoader(data);

        // First line is the evnt id offset for this area
        const idStart = loader.readInt(1);
        loader.readNewline();

        // Load id layer
        const [width, height] = loader.readSize();
        const idLayer = loader.readLayer(width, height);

        loader.readSize(); // size is repeated before each layer
        const variableLayer = loader.readLayer(width, height);

        loader.readSize();
        const mainLayer = loader.readLayer(width, height); // terrain data

        loader.readSize();
        const walkLayer = loader.readLayer(width, height); // collision data

        loader.readSize();
        const itemLayer = loader.readLayer(width, height);

        loader.readSize();
        const enemyLayer = loader.readLayer(width, height);

        return new SmileyMap(
            {
                width,
                height,
                idStart,
                song: "TODO:"
            },
            new MapLayer(idLayer),
            new MapLayer(variableLayer),
            new MapLayer(walkLayer),
            new MapLayer(itemLayer),
            new MapLayer(enemyLayer),
            [new VisualMapLayer(mainLayer, 0, VisualLayerType.Legacy)]);
    }

    public peakNext(n: number = 20) {
        return this._data.substring(this._index, this._index + n);
    }

    private readSize(): [number, number] {
        const width = this.readInt(3);
        this.readInt(1); // space
        const height = this.readInt(3);
        this.readNewline();

        return [width, height];
    }

    private readLayer(w: number, h: number): Int16Array {
        const result = new Int16Array(w * h);
        for (let row = 0; row < h; row++) {
            for (let col = 0; col < w; col++) {
                result[row * w + col] = this.readInt(3);
            }
            this.readNewline();
        }
        return result;
    }

    private readNewline() {
        this.readInt(2);
    }

    private readInt(digits: number): number {
        const i = this._data.slice(this._index, this._index + digits)
        this._index += digits;
        return Number.parseInt(i);
    }
}