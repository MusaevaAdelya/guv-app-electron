import SearchField from "../components/SearchField";
import ExpensesTable from "../components/ExpensesTable";
import Pagination from "@mui/material/Pagination";
import AddRecordButtonModal from "../components/AddRecordButtonModal";
import AddCategoryButtonModal from "../components/AddCategoryButtonModal";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { setPage } from "../redux/entriesSlice";

function TableSection() {
  const dispatch = useAppDispatch();
  const { page, entries, searchQuery } = useAppSelector(
    (state) => state.entries
  );
  const entriesPerPage = 10;

  // 🔍 Фильтрация
  const filteredEntries = entries.filter((entry) => {
    const query = searchQuery.toLowerCase();
    return (
      entry.title.toLowerCase().includes(query) ||
      entry.kategorie.toLowerCase().includes(query) ||
      entry.betrag.toString().includes(query)
    );
  });

  const totalCount = filteredEntries.length;
  const pageCount = Math.ceil(totalCount / entriesPerPage);
  const paginatedEntries = filteredEntries.slice(
    (page - 1) * entriesPerPage,
    page * entriesPerPage
  );

  return (
    <section className="bg-white shadow-xl min-h-[50vh] my-10 p-9 rounded-3xl">
      <p className="text-2xl  font-bold mb-5">Income and Expenses</p>
      <div className="flex justify-between  mb-7">
        <SearchField />
        <div className=" flex items-center gap-2">
          <AddRecordButtonModal />
          <AddCategoryButtonModal />
        </div>
      </div>
      <ExpensesTable rows={paginatedEntries} />
      <div className=" flex mt-7 justify-between">
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
