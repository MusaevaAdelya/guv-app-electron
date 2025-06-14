import { useState } from "react";
import SearchField from "../components/SearchField";
import AmortizationTable from "../components/AmortizationTable";
import Pagination from "@mui/material/Pagination";
import AddAmortizationButtonModal from "../components/AddAmortizationButtonModal";
import { useAppSelector } from "../redux/store";
import type { Entry } from "../redux/entriesSlice";

const itemsPerPage = 10;

function Amortization() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  // Все амортизационные записи (включая разбиение по месяцам)
  const amortizationEntries = useAppSelector((state) =>
    state.entries.entries.filter((e) => e.type === "amortization")
  );

  // Группировка: по ID до дефиса (например, из "uuid-0", "uuid-1" → "uuid")
  const groupedMap = new Map<string, Entry>();
  for (const entry of amortizationEntries) {
    const baseId = entry.id.split("-")[0];
    if (!groupedMap.has(baseId)) {
      groupedMap.set(baseId, entry);
    }
  }

  const groupedEntries = Array.from(groupedMap.values());

  // Фильтрация по поиску
  const filteredEntries = groupedEntries.filter((entry) => {
    const query = searchQuery.toLowerCase();
    return (
      entry.title.toLowerCase().includes(query) ||
      entry.kategorie.toLowerCase().includes(query) ||
      entry.betrag.toString().includes(query)
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
      <p className="text-2xl font-bold mb-5">Amortization</p>

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
