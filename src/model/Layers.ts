export enum Layer {
    Main,
    Walk,
    Item,
    Enemy,
    Event
}

export interface LayerState {
    type: Layer;
    name: string;
    index: number;
    visible: boolean;
}
