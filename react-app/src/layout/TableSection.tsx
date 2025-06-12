import SearchField from "../components/SearchField";
import ExpensesTable from "../components/ExpensesTable";
import Pagination from "@mui/material/Pagination";
import AddRecordButtonModal from "../components/AddRecordButtonModal";
import AddCategoryButtonModal from "../components/AddCategoryButtonModal";
import { useAppDispatch, useAppSelector } from '../redux/store';
import { setPage } from '../redux/entriesSlice';

function TableSection() {
  const { page, totalCount } = useAppSelector(state => state.entries);
  const dispatch = useAppDispatch();
  const pageCount = Math.ceil(totalCount / 10);

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
      <ExpensesTable />
      <div className=" flex mt-7 justify-between">
        <p className="text-lg">
          {`${(page - 1) * 10 + 1}–${Math.min(page * 10, totalCount)} of ${totalCount} items`}
        </p>
        <Pagination
          // count={10}
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
      </div>
    </section>
  );
}

export default TableSection;
