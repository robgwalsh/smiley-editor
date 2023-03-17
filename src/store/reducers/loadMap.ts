import { Draft, PayloadAction } from "@reduxjs/toolkit";
import { EditorState } from "../../model/EditorState";
import { convertMapFileToState, convertLegacyFileToState } from "../../model/map/converters";
import { MapData, setMapData } from "../../model/map/MapData";
import { MapFile } from "../../model/map/MapFile";
import { MapState } from "../../model/map/MapState";
import { Textures } from "../../model/Textures";
import { TextFile } from "../../utils/HtmlUtils";

export function loadMapImpl(state: Draft<EditorState>, action: PayloadAction<TextFile>) {
    let map: MapState;
    let data: MapData;
    try {
        const mapFile: MapFile = JSON.parse(action.payload.contents);
        [map, data] = convertMapFileToState(mapFile);
    } catch (e) {
        // Maybe its a legacy file
        try {
            [map, data] = convertLegacyFileToState(action.payload.contents);
        } catch (e2) {
            alert(`can't load the map :( ${e.message}`); // show the actual original error
            return;
        }
    }

    // TODO: if any required layers are missing, populate them

    state.activeLayerName = "main"; // TODO:
    state.map = map;

    // Update singletons that dont make sense to put in the store
    setMapData(data);
    for (const texture of map.header.textures){
        Textures.initializeTextures(texture);
    }
}