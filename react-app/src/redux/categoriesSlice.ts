// redux/categoriesSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../supabase/client";

interface CategoriesState {
  list: Category[];
  loading: boolean;
  error: string | null;
}

interface Category {
  id: string;
  name: string;
}

const initialState: CategoriesState = {
  list: [],
  loading: false,
  error: null,
};

// AsyncThunk для загрузки категорий по типу
export const fetchCategoriesByType = createAsyncThunk(
  "categories/fetchByType",
  async (type: string) => {
    const { data, error } = await supabase
      .from("kategorien")
      .select("id, name")
      .eq("type", type);

    if (error) throw new Error(error.message);
    return data;
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoriesByType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesByType.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchCategoriesByType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch categories";
      });
  },
});

export default categoriesSlice.reducer;
