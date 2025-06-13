import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "../supabase/client";
import dayjs from "dayjs";

type EntryType = "profit" | "loss" | "amortization";

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
  "entries/fetchEntries",
  async () => {
    const [einnahmenRes, ausgabenRes, abschreibungenRes] = await Promise.all([
      supabase
        .from("einnahmen")
        .select(
          "id, title, betrag, umsatzsteuer, datum, kategorien:kategorie(name)"
        ),
      supabase
        .from("ausgaben")
        .select(
          "id, title, betrag, umsatzsteuer, datum, kategorien:kategorie(name)"
        ),
      supabase
        .from("abschreibungen")
        .select(
          "id, name, dauer ,kosten, start_datum, kategorien:kategorie(name)"
        ),
    ]);

    const entries: Entry[] = [];

    (einnahmenRes.data || []).forEach((e) =>
      entries.push({
        id: e.id,
        title: e.title,
        betrag: Number(e.betrag),
        umsatzsteuer: Number(e.umsatzsteuer),
        datum: e.datum,
        kategorie: e.kategorien?.name || "-",
        type: "profit",
      })
    );

    (ausgabenRes.data || []).forEach((e) =>
      entries.push({
        id: e.id,
        title: e.title,
        betrag: -Number(e.betrag),
        umsatzsteuer: Number(e.umsatzsteuer),
        datum: e.datum,
        kategorie: e.kategorien?.name || "-",
        type: "loss",
      })
    );

    (abschreibungenRes.data || []).forEach((e) => {
      const monatlicherBetrag = Number(e.kosten) / e.dauer;
      const start = dayjs(e.start_datum);

      for (let i = 0; i < e.dauer; i++) {
        const datum = start.add(i, "month").format("YYYY-MM-DD");

        entries.push({
          id: `${e.id}-${i}`, // уникальный id
          title: e.name,
          betrag: -Number(monatlicherBetrag.toFixed(2)),
          umsatzsteuer: 0,
          datum,
          kategorie: e.kategorien?.name || "-",
          type: "amortization",
        });
      }
    });

    entries.sort(
      (a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime()
    );

    return {
      entries,
      total: entries.length, // ← теперь реальный totalCount
    };
  }
);

export const deleteEntry = createAsyncThunk(
  'entries/deleteEntry',
  async (entry: Entry) => {
    let table;
    switch (entry.type) {
      case 'profit':
        table = 'einnahmen';
        break;
      case 'loss':
        table = 'ausgaben';
        break;
      case 'amortization':
        // амортизация нельзя удалить по частям (т.к. ты генерируешь их вручную)
        return null;
    }

    const { error } = await supabase.from(table).delete().eq('id', entry.id);
    if (error) throw error;

    return entry.id;
  }
);


const entriesSlice = createSlice({
  name: "entries",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
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
      })
      .addCase(deleteEntry.fulfilled, (state, action) => {
        if (action.payload) {
          state.entries = state.entries.filter(e => e.id !== action.payload);
          state.totalCount -= 1;
        }
      });
  },
});

export const { setPage } = entriesSlice.actions;
export default entriesSlice.reducer;
