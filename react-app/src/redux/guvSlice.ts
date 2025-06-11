import { createSlice } from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import type { AppDispatch } from './store';

interface GuvState {
  from: string | null;
  to: string | null;
}

const initialState: GuvState = {
  from: null,
  to: null,
};

const guvSlice = createSlice({
  name: 'guv',
  initialState,
  reducers: {
    setFrom: (state, action: PayloadAction<string | null>) => {
      state.from = action.payload;
    },
    setTo: (state, action: PayloadAction<string | null>) => {
      state.to = action.payload;
    },
  },
});

export const { setFrom, setTo } = guvSlice.actions;
export default guvSlice.reducer;

export const setDateFrom = (date: string | null) => (dispatch: AppDispatch) => {
  dispatch(setFrom(date));
};

export const setDateTo = (date: string | null) => (dispatch: AppDispatch) => {
  dispatch(setTo(date));
};
