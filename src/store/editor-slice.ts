import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";
import { EditorState, initialEditorState, TileSelection } from "../model/EditorState";
import { IVector, Vector } from "../model/Vector";
import { StateUtils } from "../utils/StateUtils";
import { handleInputImpl } from "./actions/handleInput";
import { loadMapAsync } from "./actions/loadMapAsync"

export const editorSlice = createSlice({
    name: "editor",
    initialState: initialEditorState(),
    reducers: {
        handleInput: handleInputImpl,
        setViewportSize: (state: Draft<EditorState>, action: PayloadAction<IVector>) => {
            state.viewport.width = action.payload.x;
            state.viewport.height = action.payload.y;
        },
        setViewportOffset: (state: Draft<EditorState>, action: PayloadAction<IVector>) => {
            state.viewport.x = action.payload.x;
            state.viewport.y = action.payload.y;
        },
        pan: (state: Draft<EditorState>, action: PayloadAction<IVector>) => {
            state.viewport.x = state.viewport.x + action.payload.x;
            state.viewport.y = state.viewport.y + action.payload.y;
        },
        setActiveLayerName: (state: Draft<EditorState>, action: PayloadAction<string>) => {
            state.selectedLayerName = action.payload;
            if (state.selectedLayerName == "main") {
                // hack!
                state.selectedTextureName = state.map.header.textures[0].name;
                state.selectedTextureIndex = 0;
            } else {
                const texture = state.map.header.textures.find(t => t.name.toLocaleLowerCase() === state.selectedLayerName.toLocaleLowerCase());
                if (texture) {
                    state.selectedTextureName = texture.name;
                    state.selectedTextureIndex = 0;
                }
            }
        },
        setZoom: (state: Draft<EditorState>, action: PayloadAction<number>) => {
            state.zoom = action.payload;
        },
        setMapMousePosition: (state: Draft<EditorState>, action: PayloadAction<IVector | null>) => {
            state.mapMousePosition = action.payload;
        },
        setIsMapLoading: (state: Draft<EditorState>, action: PayloadAction<boolean>) => {
            state.isLoadingMap = action.payload;
        },
        zoomAtMouse: (state: Draft<EditorState>, action: PayloadAction<boolean>) => {
            const scaleFactor = action.payload ? 1.15 : 0.87;
            const newZoom = Math.min(1, Math.max(.05, state.zoom * scaleFactor));
            if (newZoom !== state.zoom) {
                // Center the viewport around the mouse position.
                const mouseP = new Vector(state.mapMousePosition.x + state.viewport.x, state.mapMousePosition.y + state.viewport.y);
                const delta = mouseP.subVector(mouseP.multScalar(newZoom / state.zoom));

                state.viewport.x = state.viewport.x - delta.x;
                state.viewport.y = state.viewport.y - delta.y;
                state.zoom = newZoom;
            }
        },
        setSelectedTexture: (state: Draft<EditorState>, action: PayloadAction<[string, number]>) => {
            state.selectedTextureName = action.payload[0];
            state.selectedTextureIndex = action.payload[1];
        },
        setTilePickerTarget: (state: Draft<EditorState>, action: PayloadAction<IVector | null>) => {
            state.tilePickerGridPosition = action.payload;
        },
        assignTilePickerTarget: (state: Draft<EditorState>, action: PayloadAction<string>) => {
            if (state.tilePickerGridPosition) {
                const selectedTexture = StateUtils.getSelectedTexture(state);
                state.tileSelections[action.payload] = {
                    x: state.tilePickerGridPosition.x,
                    y: state.tilePickerGridPosition.y,
                    layerName: null,
                    textureId: selectedTexture.id,
                    tile: (state.tilePickerGridPosition.x * state.tilePickerGridPosition.y) + state.selectedTextureIndex * (selectedTexture.width / selectedTexture.height)
                };
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadMapAsync.pending, (state, action) => {
                state.isLoadingMap = true;
            })
            .addCase(loadMapAsync.fulfilled, (state, action) => {
                state.isLoadingMap = false;
                state.map = action.payload;
                state.selectedLayerName = state.map.visualLayers[0].name;
                state.selectedTextureName = state.map.header.textures[0].name;
                state.selectedTextureIndex = 0;
            })
            .addCase(loadMapAsync.rejected, (state, action) => {
                state.isLoadingMap = false;
                alert(`ERROR IN PROGRAM ${action.error.message}`);
            });
    },
});

export const {
    setViewportSize, setActiveLayerName, setZoom, setMapMousePosition,
    zoomAtMouse, setIsMapLoading, setViewportOffset, pan, setSelectedTexture,
    handleInput, setTilePickerTarget, assignTilePickerTarget
} = editorSlice.actions;

export default editorSlice.reducer;