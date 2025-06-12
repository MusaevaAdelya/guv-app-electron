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
  async () => {

    const [einnahmenRes, ausgabenRes] = await Promise.all([
      supabase
        .from('einnahmen')
        .select('id, title, betrag, umsatzsteuer, datum, kategorien:kategorie(name)'),
      supabase
        .from('ausgaben')
        .select('id, title, betrag, umsatzsteuer, datum, kategorien:kategorie(name)')
    ]);

    const entries: Entry[] = [];

    (einnahmenRes.data || []).forEach(e =>
      entries.push({
        id: e.id,
        title: e.title,
        betrag: Number(e.betrag),
        umsatzsteuer: Number(e.umsatzsteuer),
        datum: e.datum,
        kategorie: e.kategorien?.name || '-',
        type: 'profit',
      })
    );

    (ausgabenRes.data || []).forEach(e =>
      entries.push({
        id: e.id,
        title: e.title,
        betrag: -Number(e.betrag),
        umsatzsteuer: Number(e.umsatzsteuer),
        datum: e.datum,
        kategorie: e.kategorien?.name || '-',
        type: 'loss',
      })
    );

    entries.sort((a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime());

    return {
      entries,
      total: entries.length, // ← теперь реальный totalCount
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
