import React from "react";
import { useAppSelector } from "../../hooks";
import { EditorState } from "../../store/reducers/editor-slice";

export function MapViewer() {
    const { map } = useAppSelector<EditorState>(state => state.editor);

    return (
        <>hello world</>
    )
}