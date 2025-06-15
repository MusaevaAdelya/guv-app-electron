import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "../supabase/client";
import dayjs from "dayjs";

type EntryType = "profit" | "loss" | "amortization";

export interface Entry {
  id: string;
  originalId?: string;
  title: string;
  betrag: number;
  umsatzsteuer: number;
  datum: string;
  kategorie: string;
  type: EntryType;
  restwert?: number;
  restdauer?: number;
  start_datum?: string;
  storniert?: boolean;
}


interface EntriesState {
  entries: Entry[];
  page: number;
  totalCount: number;
  loading: boolean;
  statistics: {
    profits: { datum: string; betrag: number }[];
    losses: { datum: string; betrag: number }[];
  };
  categoryStatistics: {
    profitCategories: { label: string; value: number }[];
    lossCategories: { label: string; value: number }[];
  },

}

interface AbschreibungRaw {
  id: string;
  name: string;
  dauer: number;
  kosten: number;
  start_datum: string;
  kategorien?: { name: string };
  storniert?: boolean;
}

const initialState: EntriesState = {
  entries: [],
  page: 1,
  totalCount: 0,
  loading: false,
  statistics: {
    profits: [],
    losses: [],
  },
  categoryStatistics: {
    profitCategories: [],
    lossCategories: [],
  },

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
        .select("id, name, dauer, kosten, start_datum, storniert, kategorien:kategorie(name)")


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

    ((abschreibungenRes.data ?? []) as unknown as AbschreibungRaw[]).forEach((e) => {
      const isStorniert = (e as any).storniert ?? false;
      const monatlicherBetrag = Number(e.kosten) / e.dauer;
      const start = dayjs(e.start_datum);
      const today = dayjs();

      let monthsPassed = today.diff(start, "month");
      if (today.date() >= start.date()) {
        monthsPassed += 1;
      }

      monthsPassed = Math.min(monthsPassed, e.dauer);

      const restdauer = Math.max(0, e.dauer - monthsPassed);
      const restwert = Math.max(0, e.kosten - monatlicherBetrag * monthsPassed);

      for (let i = 0; i < e.dauer; i++) {
        const datum = start.add(i, "month").format("YYYY-MM-DD");

        entries.push({
          id: `${e.id}-${i}`,
          originalId: e.id,
          title: e.name,
          betrag: -Number(monatlicherBetrag.toFixed(2)),
          umsatzsteuer: 0,
          datum,
          start_datum: e.start_datum,
          kategorie: e.kategorien?.name || "-",
          type: "amortization",
          restwert: Number(restwert.toFixed(2)),
          restdauer,
          storniert: isStorniert,

        });
      }

    });

    
    entries.sort(
      (a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime()
    );

    return {
      entries,
      total: entries.length,
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
        return null;
    }

    const { error } = await supabase.from(table).delete().eq('id', entry.id);
    if (error) throw error;

    return entry.id;
  }
);

export const addEntry = createAsyncThunk(
  'entries/addEntry',
  async (
    data: {
      type: "einnahmen" | "ausgaben";
      title: string;
      betrag: number;
      umsatzsteuer: number;
      datum: string;
      kategorie: string;
    },
    { dispatch }
  ) => {
    const { error } = await supabase.from(data.type).insert([
      {
        title: data.title,
        betrag: data.betrag,
        umsatzsteuer: data.umsatzsteuer,
        datum: data.datum,
        kategorie: data.kategorie,
      },
    ]);

    if (error) throw error;

    dispatch(fetchEntries());
  }
);

export const addAmortization = createAsyncThunk(
  'entries/addAmortization',
  async (
    data: {
      name: string;
      kosten: number;
      dauer: number;
      start_datum: string;
      kategorie: string;
    },
    { dispatch }
  ) => {
    const { error } = await supabase.from('abschreibungen').insert([
      {
        name: data.name,
        kosten: data.kosten,
        dauer: data.dauer,
        start_datum: data.start_datum,
        kategorie: data.kategorie,
      },
    ]);

    if (error) {
      console.error("❌ Fehler beim Einfügen der Amortisation:", error);
      throw error;
    }

    dispatch(fetchEntries());
  }
);

export const stornoAmortization = createAsyncThunk(
  "entries/stornoAmortization",
  async (id: string, { rejectWithValue }) => {
    const { error } = await supabase
      .from("abschreibungen")
      .update({ storniert: true }) // или другое поле для отметки
      .eq("id", id);

    if (error) return rejectWithValue(error.message);
    return id;
  }
);

export const fetchStatistics = createAsyncThunk("entries/fetchStatistics", async () => {
  const { data: profits, error: profitError } = await supabase
    .from("einnahmen")
    .select("datum, betrag")
    .order("datum", { ascending: true });

  const { data: losses, error: lossError } = await supabase
    .from("ausgaben")
    .select("datum, betrag")
    .order("datum", { ascending: true });

  if (profitError || lossError) throw profitError || lossError;


  return {
    profits: profits || [],
    losses: (losses || []).map((e) => ({
      ...e,
      betrag: -Math.abs(e.betrag),
    })),
  };
});

export const fetchCategoryStatistics = createAsyncThunk("entries/fetchCategoryStatistics", async () => {
  const [profitsRes, lossesRes] = await Promise.all([
    supabase
      .from("einnahmen")
      .select("betrag, kategorien:kategorie(name)"), // 👈 alias
    supabase
      .from("ausgaben")
      .select("betrag, kategorien:kategorie(name)"),
  ]);

  if (profitsRes.error || lossesRes.error) throw profitsRes.error || lossesRes.error;

  const profitsByCategory: Record<string, number> = {};
  const lossesByCategory: Record<string, number> = {};

  (profitsRes.data as unknown as { betrag: number; kategorien?: { name: string } }[]).forEach((e) => {
    const name = e.kategorien?.name || "-";
    profitsByCategory[name] = (profitsByCategory[name] || 0) + e.betrag;
  });

  (lossesRes.data as unknown as { betrag: number; kategorien?: { name: string } }[]).forEach((e) => {
    const name = e.kategorien?.name || "-";
    lossesByCategory[name] = (lossesByCategory[name] || 0) + e.betrag;
  });


  return {
    profitCategories: Object.entries(profitsByCategory).map(([label, value]) => ({ label, value })),
    lossCategories: Object.entries(lossesByCategory).map(([label, value]) => ({ label, value })),
  };
});




const entriesSlice = createSlice({
  name: "entries",
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
      })
      .addCase(fetchStatistics.fulfilled, (state, action) => {
        state.statistics = action.payload;
      })
      .addCase(fetchCategoryStatistics.fulfilled, (state, action) => {
        state.categoryStatistics = action.payload;
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
