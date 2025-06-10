import SearchField from "../components/SearchField";
import AmortizationTable from "../components/AmortizationTable";
import Pagination from "@mui/material/Pagination";
import AddAmortizationButtonModal from "../components/AddAmortizationButtonModal";

function Amortization() {
  return (
    <section className="bg-white shadow-xl min-h-[50vh] my-10 p-9 rounded-3xl">
      <p className="text-2xl  font-bold mb-5">Amortization</p>
      <div className="flex justify-between  mb-7">
        <SearchField />
        <div className=" flex items-center gap-2">
          <AddAmortizationButtonModal/>
        </div>
      </div>
      <AmortizationTable />
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
  )
}

export default Amortization