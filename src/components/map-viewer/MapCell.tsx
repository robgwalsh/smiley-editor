import React from 'react';
import { SmileyMap, useMap } from '../../model/SmileyMap';
import { Vector } from '../../model/Vector';

interface Props {
    position: Vector;
}

export function MapCell(props: Props) {

    const map: SmileyMap = useMap();

    for (let i = 0; i < map.layers.length; i++) {

    }
    //map.layers

    return (
        <div style={{ position: "absolute", left: props.position.x, top: props.position.y }}>
            {props.position.x}, {props.position.y}
        </div>
    )
}