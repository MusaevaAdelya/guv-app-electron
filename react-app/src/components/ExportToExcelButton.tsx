import { TableCellsIcon } from "@heroicons/react/24/outline";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import dayjs from "dayjs";
import { useAppSelector } from "../redux/store";

function ExportToExcelButton() {
  const { entries } = useAppSelector((state) => state.entries);
  const { from, to } = useAppSelector((state) => state.guv);

  const fromDate = from ? dayjs(from) : null;
  const toDate = to ? dayjs(to) : null;

  const filtered = entries.filter((entry) => {
    const entryDate = dayjs(entry.datum);
    const afterFrom = !fromDate || entryDate.isSameOrAfter(fromDate, "day");
    const beforeTo = !toDate || entryDate.isSameOrBefore(toDate, "day");
    return afterFrom && beforeTo;
  });

  function exportToExcel(data: typeof filtered) {
    const rows = data.map((entry) => ({
      Titel: entry.title,
      Betrag: entry.betrag,
      Kategorie: entry.kategorie,
      Typ: entry.type,
      Datum: dayjs(entry.datum).format("DD.MM.YYYY"),
      USt: entry.umsatzsteuer ?? 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Einnahmen & Ausgaben");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `guv-export-${dayjs().format("YYYY-MM-DD")}.xlsx`);
  }
  return (
    <button onClick={() => exportToExcel(filtered)} className=" rounded-2xl px-4 hover:cursor-pointer bg-green-400 font-bold transition duration-200 flex items-center gap-3 hover:bg-green-300">
      <TableCellsIcon className="w-6" /> <span>Export to Excel</span>
    </button>
  );
}

export default ExportToExcelButton;
