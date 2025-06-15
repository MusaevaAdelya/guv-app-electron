import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../supabase/client";

export interface Amortization {
  id: string;
  name: string;
  kosten: number;
  dauer: number;
  start_datum: string;
  kategorie: string;
  storniert?: boolean;
  stornierung_datum?: string;
}

interface AmortizationsState {
  data: Amortization[];
  loading: boolean;
}

const initialState: AmortizationsState = {
  data: [],
  loading: false,
};

export const fetchGroupedAmortizations = createAsyncThunk(
  "amortizations/fetchGrouped",
  async () => {
    const { data, error } = await supabase
      .from("abschreibungen")
      .select("id, name, kosten, dauer, start_datum, storniert, stornierung_datum, kategorien:kategorie(name)");

    if (error) throw error;

    return (data ?? []).map((e) => ({
      id: e.id,
      name: e.name,
      kosten: e.kosten,
      dauer: e.dauer,
      start_datum: e.start_datum,
      storniert: e.storniert,
      stornierung_datum: e.stornierung_datum,
      kategorie: e.kategorien?.name ?? "-",
    }));
  }
);

const amortizationsSlice = createSlice({
  name: "amortizations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroupedAmortizations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGroupedAmortizations.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchGroupedAmortizations.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default amortizationsSlice.reducer;
