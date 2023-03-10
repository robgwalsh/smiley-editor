import React from 'react';
import { Vector } from '../../model/Vector';

interface Props {
    position: Vector;
}

export function MapCell(props: Props) {
    return (
        <div style={{ position: "absolute", left: props.position.x, top: props.position.y }}>
            {props.position.x}, {props.position.y}
        </div>
    )
}