import { useState } from "react";
import SearchField from "../components/SearchField";
import ExpensesTable from "../components/ExpensesTable";
import Pagination from "@mui/material/Pagination";
import AddRecordButtonModal from "../components/AddRecordButtonModal";
import AddCategoryButtonModal from "../components/AddCategoryButtonModal";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { setPage } from "../redux/entriesSlice";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const entriesPerPage = 10;

function TableSection() {
  const dispatch = useAppDispatch();
  const { page, entries } = useAppSelector((state) => state.entries);
  const { from, to } = useAppSelector((state) => state.guv);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredEntries = entries.filter((entry) => {
    const entryDate = dayjs(entry.datum);
    const fromDate = from ? dayjs(from) : null;
    const toDate = to ? dayjs(to) : null;
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      entry.title.toLowerCase().includes(query) ||
      entry.kategorie.toLowerCase().includes(query) ||
      entry.betrag.toString().includes(query);

    const matchesDate =
      (!fromDate || entryDate.isSameOrAfter(fromDate, "day")) &&
      (!toDate || entryDate.isSameOrBefore(toDate, "day"));

    return matchesSearch && matchesDate;
  });
  const totalCount = filteredEntries.length;
  const pageCount = Math.ceil(totalCount / entriesPerPage);
  const paginatedEntries = filteredEntries.slice(
    (page - 1) * entriesPerPage,
    page * entriesPerPage
  );

  return (
    <section className="bg-white shadow-xl min-h-[50vh] my-10 p-9 rounded-3xl">
      <p className="text-2xl font-bold mb-5">Ein- und Ausgabenübersicht</p>

      <div className="flex justify-between mb-7">
        <SearchField
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            dispatch(setPage(1)); // сброс страницы при новом поиске
          }}
        />
        <div className="flex items-center gap-2">
          <AddRecordButtonModal />
          <AddCategoryButtonModal />
        </div>
      </div>

      <ExpensesTable rows={paginatedEntries} />

      <div className="flex mt-7 justify-between">
        <p className="text-lg">
          {totalCount > 0
            ? `${(page - 1) * entriesPerPage + 1}–${Math.min(
                page * entriesPerPage,
                totalCount
              )} of ${totalCount} items`
            : "No results found"}
        </p>
        {pageCount > 1 && (
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, value) => dispatch(setPage(value))}
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

export default TableSection;
