import SearchField from "../components/SearchField";
import AddIcon from "@mui/icons-material/Add";
import ExpensesTable from "../components/ExpensesTable";
import Pagination from "@mui/material/Pagination";

function TableSection() {
  return (
    <section className="bg-white shadow-xl min-h-[50vh] my-10 p-9 rounded-3xl">
      <p className="text-2xl  font-bold mb-5">Income and Expenses</p>
      <div className="flex justify-between  mb-7">
        <SearchField />
        <div className=" flex items-center gap-2">
          <button className="text-white bg-black py-2 px-4 rounded-2xl font-bold">
            <AddIcon />
            <span className="ml-2">Add Record</span>
          </button>
          <button className="text-white bg-black py-2 px-4 rounded-2xl font-bold ">
            <AddIcon />
            <span className="ml-2">Add Category</span>
          </button>
        </div>
      </div>
      <ExpensesTable />
      <div className=" flex mt-7 justify-between">
        <p className="text-lg">10 of 456 items</p>
        <Pagination
          count={10}
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
