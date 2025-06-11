import { createSlice } from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

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
