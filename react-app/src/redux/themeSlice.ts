import { createSlice } from '@reduxjs/toolkit';

export interface ThemeState {
  darkMode: boolean;
}

const getInitialTheme = (): boolean => {
  const saved = localStorage.getItem('darkMode');
  return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const initialState: ThemeState = {
  darkMode: getInitialTheme(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', JSON.stringify(state.darkMode));
    },
    setTheme(state, action) {
      state.darkMode = action.payload;
      localStorage.setItem('darkMode', JSON.stringify(state.darkMode));
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
