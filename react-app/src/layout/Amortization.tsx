import { useState, useEffect } from "react";
import SearchField from "../components/SearchField";
import AmortizationTable from "../components/AmortizationTable";
import Pagination from "@mui/material/Pagination";
import AddAmortizationButtonModal from "../components/AddAmortizationButtonModal";
import type {  AmortizationEntry } from "../redux/entriesSlice";
import { supabase } from "../supabase/client";

const itemsPerPage = 10;

function Amortization() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [entries, setEntries] = useState<AmortizationEntry[]>([]);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("abschreibungen")
        .select("*, kategorien(name, type)");

      if (error) {
        console.error("Ошибка при получении данных:", error);
      } else {
        const transformed = data?.map((entry) => ({
        id: entry.id,
        dauer: entry.dauer,
        name: entry.name,
        kosten: entry.kosten,
        start_datum: entry.start_datum,
        kategorie: entry.kategorien?.name ?? "",
        type: entry.kategorien?.type ?? "",
        storniert: entry.storniert,
        stornierung_datum: entry.stornierung_datum,
      }));

      setEntries(transformed || []);
      }
    }

    fetchData();
    
  }, []);

  

  // Фильтрация по поиску
  const filteredEntries = entries.filter((entry) => {
    const query = searchQuery.toLowerCase();
    return (
      entry.name.toLowerCase().includes(query) ||
      entry.kategorie.toLowerCase().includes(query) ||
      entry.kosten.toString().includes(query)
    );
  });

  // Пагинация
  const totalCount = filteredEntries.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const paginatedEntries = filteredEntries.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <section className="bg-white shadow-xl min-h-[50vh] my-10 p-9 rounded-3xl">
      <p className="text-2xl font-bold mb-5">Abschreibungen</p>

      <div className="flex justify-between mb-7">
        <SearchField
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
        />
        <div className="flex items-center gap-2">
          <AddAmortizationButtonModal />
        </div>
      </div>

      <AmortizationTable rows={paginatedEntries} />

      <div className="flex mt-7 justify-between">
        <p className="text-lg">
          {totalCount > 0
            ? `${(page - 1) * itemsPerPage + 1}–${Math.min(
                page * itemsPerPage,
                totalCount
              )} of ${totalCount} items`
            : "No results found"}
        </p>
        {totalPages > 1 && (
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            sx={{
              "& .MuiPaginationItem-root": {
                fontSize: "1.2rem",
              },
              "& .MuiPaginationItem-root.Mui-selected": {
                backgroundColor: "black",
                color: "white",
                "&:hover": {
                  backgroundColor: "#333",
                },
              },
            }}
          />
        )}
      </div>
    </section>
  );
}

export default Amortization;
