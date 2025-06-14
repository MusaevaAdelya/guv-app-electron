import { useState } from "react";
import SearchField from "../components/SearchField";
import AmortizationTable from "../components/AmortizationTable";
import Pagination from "@mui/material/Pagination";
import AddAmortizationButtonModal from "../components/AddAmortizationButtonModal";
import { useAppSelector } from "../redux/store";

function Amortization() {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const amortizationCount = useAppSelector(
    (state) => state.entries.entries.filter(e => e.type === "amortization").length
  );
  const totalPages = Math.ceil(amortizationCount / itemsPerPage);

  return (
    <section className="bg-white shadow-xl min-h-[50vh] my-10 p-9 rounded-3xl">
      <p className="text-2xl  font-bold mb-5">Amortization</p>
      <div className="flex justify-between  mb-7">
        <SearchField />
        <div className=" flex items-center gap-2">
          <AddAmortizationButtonModal />
        </div>
      </div>

      {/* Таблица с текущей страницей */}
      <AmortizationTable page={page} itemsPerPage={itemsPerPage} />

      <div className=" flex mt-7 justify-between">
        <p className="text-lg">
          {itemsPerPage * (page - 1) + 1}–{Math.min(page * itemsPerPage, amortizationCount)} of {amortizationCount} items
        </p>
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
      </div>
    </section>
  );
}

export default Amortization;
