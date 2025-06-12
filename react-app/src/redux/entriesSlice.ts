import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import { supabase } from '../supabase/client';

type EntryType = 'profit' | 'loss' | 'amortization';

export interface Entry {
  id: string;
  title: string;
  betrag: number;
  umsatzsteuer: number;
  datum: string;
  kategorie: string;
  type: EntryType;
}

interface EntriesState {
  entries: Entry[];
  page: number;
  totalCount: number;
  loading: boolean;
}

const initialState: EntriesState = {
  entries: [],
  page: 1,
  totalCount: 0,
  loading: false,
};

export const fetchEntries = createAsyncThunk(
  'entries/fetchEntries',
  async (page: number = 1) => {
    const perPage = 10;
    const offset = (page - 1) * perPage;

    const [einnahmenRes, ausgabenRes, abschreibungenRes] = await Promise.all([
      supabase.from('einnahmen').select('*').range(offset, offset + perPage - 1),
      supabase.from('ausgaben').select('*').range(offset, offset + perPage - 1),
      supabase.from('abschreibungen').select('*').range(offset, offset + perPage - 1),
    ]);

    const entries: Entry[] = [];

    (einnahmenRes.data || []).forEach(e => entries.push({
      id: e.id,
      title: e.title,
      betrag: Number(e.betrag),
      umsatzsteuer: Number(e.umsatzsteuer),
      datum: e.datum,
      kategorie: e.kategorie,
      type: 'profit'
    }));

    (ausgabenRes.data || []).forEach(e => entries.push({
      id: e.id,
      title: e.title,
      betrag: Number(e.betrag),
      umsatzsteuer: Number(e.umsatzsteuer),
      datum: e.datum,
      kategorie: e.kategorie,
      type: 'loss'
    }));

    (abschreibungenRes.data || []).forEach(e => entries.push({
      id: e.id,
      title: e.name,
      betrag: Number(e.kosten),
      umsatzsteuer: 0,
      datum: e.start_datum,
      kategorie: e.kategorie,
      type: 'amortization'
    }));

    return {
      entries,
      total: 456 // пока временно фиксированное значение
    };
  }
);

const entriesSlice = createSlice({
  name: 'entries',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEntries.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEntries.fulfilled, (state, action) => {
        state.entries = action.payload.entries;
        state.totalCount = action.payload.total;
        state.loading = false;
      })
      .addCase(fetchEntries.rejected, (state) => {
        state.loading = false;
      });
  }
});

export const { setPage } = entriesSlice.actions;
export default entriesSlice.reducer;
