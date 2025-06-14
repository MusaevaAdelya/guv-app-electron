import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import guvReducer from './guvSlice';
import entriesReducer from './entriesSlice';
import categoriesReducer from './categoriesSlice';
import snackbarReducer from './snackbarSlice';
import type { ThunkAction, Action } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    guv:guvReducer,
    entries: entriesReducer,
    categories: categoriesReducer,
    snackbar: snackbarReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
