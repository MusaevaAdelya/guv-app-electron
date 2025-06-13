import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import guvReducer from './guvSlice';
import entriesReducer from './entriesSlice';
import categoriesReducer from './categoriesSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    guv:guvReducer,
    entries: entriesReducer,
    categories: categoriesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
