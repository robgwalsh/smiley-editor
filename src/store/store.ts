import { configureStore } from "@reduxjs/toolkit";
import editor from "./editor-slice";

export const store = configureStore({
    reducer: {
        editor
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                //ignoredActions: ['your/action/type'],
                // Ignore these field paths in all actions
                ignoredActionPaths: ['payload', 'editor'],
                // Ignore these paths in the state
                //ignoredPaths: ['items.dates'],
              },

        }),
    devTools: true,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;