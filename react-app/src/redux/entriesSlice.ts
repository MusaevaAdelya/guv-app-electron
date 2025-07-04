import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "../supabase/client";
import dayjs from "dayjs";
import type { RootState } from "./store";

type EntryType = "profit" | "loss" | "amortization";

export interface Entry {
  id: string;
  originalId?: string;
  title: string;
  betrag: number;
  gesamtKosten?: number;
  umsatzsteuer: number;
  datum: string;
  kategorie: string;
  type: EntryType;
  restwert?: number;
  restdauer?: number;
  start_datum?: string;
  storniert?: boolean;
}

export interface AmortizationEntry {
  id: string;
  dauer: number;
  name: string;
  kosten: number;
  start_datum: string;
  kategorie: string;
  type: "profit" | "loss" | "amortization";
  storniert: boolean;
  stornierung_datum?: string;
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
  };
}

interface AbschreibungRaw {
  id: string;
  name: string;
  dauer: number;
  kosten: number;
  start_datum: string;
  kategorien?: { name: string };
  storniert?: boolean;
  stornierung_datum?:string;
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
        .select(
          "id, name, dauer, kosten, start_datum, storniert, kategorien:kategorie(name), stornierung_datum"
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
        // @ts-expect-error kategorien might be null or undefined from Supabase
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
        // @ts-expect-error kategorien might be null or undefined from Supabase
        kategorie: e.kategorien?.name || "-",
        type: "loss",
      })
    );

    ((abschreibungenRes.data ?? []) as unknown as AbschreibungRaw[]).forEach(
      (e) => {
        const isStorniert = e.storniert ?? false;
        const monatlicherBetrag = Number(e.kosten) / e.dauer;
        const start = dayjs(e.start_datum);
        const today = dayjs();

        let monthsPassed = 0;
        for (let i = 0; i < e.dauer; i++) {
          const paymentDate = dayjs(e.start_datum).add(i, "month");
          if (
            paymentDate.isBefore(today, "day") ||
            paymentDate.isSame(today, "day")
          ) {
            monthsPassed += 1;
          }
        }

        monthsPassed = Math.min(monthsPassed, e.dauer);

        const restdauer = Math.max(0, e.dauer - monthsPassed);
        const restwert = Math.max(
          0,
          e.kosten - monatlicherBetrag * monthsPassed
        );

        for (let i = 0; i < e.dauer; i++) {
          const datum = start.add(i, "month");
          const formattedDatum = datum.format("YYYY-MM-DD");

          if (
            isStorniert &&
            e.stornierung_datum &&
            datum.isAfter(dayjs(e.stornierung_datum), "day")
          ) {
            continue;
          }

          entries.push({
            id: `${e.id}-${i}`,
            originalId: e.id,
            title: e.name,
            betrag: -Number(monatlicherBetrag.toFixed(2)),
            gesamtKosten: e.kosten,
            umsatzsteuer: 0,
            datum: formattedDatum,
            start_datum: e.start_datum,
            kategorie: e.kategorien?.name || "-",
            type: "amortization",
            restwert: Number(restwert.toFixed(2)),
            restdauer,
            storniert: isStorniert,
          });
        }
      }
    );

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
  "entries/deleteEntry",
  async (entry: Entry) => {
    let table;
    switch (entry.type) {
      case "profit":
        table = "einnahmen";
        break;
      case "loss":
        table = "ausgaben";
        break;
      case "amortization":
        return null;
    }

    const { error } = await supabase.from(table).delete().eq("id", entry.id);
    if (error) throw error;

    return entry.id;
  }
);

export const addEntry = createAsyncThunk(
  "entries/addEntry",
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
  "entries/addAmortization",
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
    const { error } = await supabase.from("abschreibungen").insert([
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
      .update({
        storniert: true,
        stornierung_datum: dayjs().format("YYYY-MM-DD"),
      })
      .eq("id", id);

    if (error) return rejectWithValue(error.message);
    return id;
  }
);

export const fetchStatistics = createAsyncThunk(
  "entries/fetchStatistics",
  async () => {
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
  }
);

export const fetchCategoryStatistics = createAsyncThunk(
  "entries/fetchCategoryStatistics",
  async (_, { getState }) => {
    // @ts-expect-error valid cast
    const state: RootState = getState();
    const { entries } = state.entries;
    const { from, to } = state.guv;

    const fromDate = from ? dayjs(from) : null;
    const toDate = to ? dayjs(to) : null;

    const filtered = entries.filter((entry) => {
      const entryDate = dayjs(entry.datum);
      const afterFrom = !fromDate || entryDate.isSameOrAfter(fromDate, "day");
      const beforeTo = !toDate || entryDate.isSameOrBefore(toDate, "day");
      return afterFrom && beforeTo;
    });

    const profitsByCategory: Record<string, number> = {};
    const lossesByCategory: Record<string, number> = {};

    filtered.forEach((entry) => {
      const name = entry.kategorie || "-";
      if (entry.type === "profit") {
        profitsByCategory[name] = (profitsByCategory[name] || 0) + entry.betrag;
      } else if (entry.type === "loss" || entry.type === "amortization") {
        lossesByCategory[name] =
          (lossesByCategory[name] || 0) + Math.abs(entry.betrag);
      }
    });

    const totalProfit = Object.values(profitsByCategory).reduce(
      (sum, val) => sum + val,
      0
    );
    const totalLoss = Object.values(lossesByCategory).reduce(
      (sum, val) => sum + val,
      0
    );

    const profitCategories = Object.entries(profitsByCategory).map(
      ([label, value]) => ({
        label,
        value: Math.round((value / totalProfit) * 100),
      })
    );

    const lossCategories = Object.entries(lossesByCategory).map(
      ([label, value]) => ({
        label,
        value: Math.round((value / totalLoss) * 100),
      })
    );

    return { profitCategories, lossCategories };
  }
);

const entriesSlice = createSlice({
  name: "entries",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setCategoryStatistics: (
      state,
      action: PayloadAction<EntriesState["categoryStatistics"]>
    ) => {
      state.categoryStatistics = action.payload;
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
      .addCase(fetchStatistics.fulfilled, (state, action) => {
        state.statistics = action.payload;
      })
      .addCase(fetchCategoryStatistics.fulfilled, (state, action) => {
        state.categoryStatistics = action.payload;
      })

      .addCase(deleteEntry.fulfilled, (state, action) => {
        if (action.payload) {
          state.entries = state.entries.filter((e) => e.id !== action.payload);
          state.totalCount -= 1;
        }
      })
      .addCase(stornoAmortization.fulfilled, (state, action) => {
        const id = action.payload;
        state.entries = state.entries.map((entry) =>
          entry.originalId === id ? { ...entry, storniert: true } : entry
        );
      });
  },
});

export const { setPage } = entriesSlice.actions;
export default entriesSlice.reducer;
