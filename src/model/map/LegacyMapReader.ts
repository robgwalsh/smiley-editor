export class LegacyMapReader {

    private _index = 0;

    constructor(private readonly _data: string) {
    }

    public peakNext(n: number = 20) {
        return this._data.substring(this._index, this._index + n);
    }

    public readSize(): [number, number] {
        const width = this.readInt(3);
        this.readInt(1); // space
        const height = this.readInt(3);
        this.readNewline();

        return [width, height];
    }

    public readLayer(textureId: number, w: number, h: number): Int16Array {
        const result = new Int16Array(w * h * 2);
        for (let row = 0; row < h; row++) {
            for (let col = 0; col < w; col++) {
                const i = row * w + col;
                result[i * 2] = textureId;
                result[i * 2 + 1] = this.readInt(3);
            }
            this.readNewline();
        }
        return result;
    }

    public readNewline() {
        this.readInt(2);
    }

    public readInt(digits: number): number {
        const i = this._data.slice(this._index, this._index + digits)
        this._index += digits;
        return Number.parseInt(i);
    }
}