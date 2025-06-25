import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useAppDispatch } from "../redux/store";
import { fetchEntries } from "../redux/entriesSlice";
import type { AmortizationEntry } from "../redux/entriesSlice";
import dayjs from "dayjs";
import StornoAmortizationModal from "./StornoAmortizationModal";
import TableCellCategory from "./TableCellCategory";

type AmortizationTableProps = {
  rows: AmortizationEntry[];
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontSize: 18,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 18,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function AmortizationTable({ rows }: AmortizationTableProps) {
  const dispatch = useAppDispatch();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [localRows, setLocalRows] = useState(rows);

  useEffect(() => {
    dispatch(fetchEntries());
  }, [dispatch]);

  useEffect(() => setLocalRows(rows), [rows]);

  const handleStornoUpdate = (id: string) => {
  const updated = rows.map((row) =>
    row.id === id ? { ...row, storniert: true } : row
  );
  setLocalRows(updated);
};

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Titel</StyledTableCell>
            <StyledTableCell align="right">Kategorie</StyledTableCell>
            <StyledTableCell align="right">Gesamtkosten (€)</StyledTableCell>
            <StyledTableCell align="right">
              Monatliche Kosten (€)
            </StyledTableCell>
            <StyledTableCell align="right">Restwert (€)</StyledTableCell>
            <StyledTableCell align="right">Startdatum</StyledTableCell>
            <StyledTableCell align="right">Enddatum</StyledTableCell>
            <StyledTableCell align="right">Restdauer (Monate)</StyledTableCell>
            <StyledTableCell align="right">Aktion</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {localRows.map((row) => (
            <StyledTableRow
              key={row.id}
              sx={{
                opacity: row.storniert ? 0.4 : 1,
                textDecoration: row.storniert ? "line-through" : "none",
              }}
            >
              <StyledTableCell component="th" scope="row">
                {row.name}
              </StyledTableCell>
              <StyledTableCell align="right">
                <TableCellCategory title={row.kategorie} type={row.type} />
              </StyledTableCell>
              <StyledTableCell align="right">{row.kosten} €</StyledTableCell>
              <StyledTableCell align="right">
                {(row.kosten / row.dauer).toFixed(2)} €
              </StyledTableCell>
              <StyledTableCell align="right">
                {(() => {
                  const heute = dayjs(); // сегодняшняя дата
                  const start = dayjs(row.start_datum);
                  const monateVergangen = heute.diff(start, "month");
                  const restwert = Math.max(
                    0,
                    row.kosten - (row.kosten / row.dauer) * monateVergangen
                  );
                  return restwert.toFixed(2) + " €";
                })()}
              </StyledTableCell>
              <StyledTableCell align="right">
                {dayjs(row.start_datum).format("DD.MM.YYYY")}
              </StyledTableCell>
              <StyledTableCell align="right">
                {dayjs(row.start_datum)
                  .add(row.dauer, "month")
                  .format("DD.MM.YYYY")}
              </StyledTableCell>

              <StyledTableCell align="right">
                {(() => {
                  const heute = dayjs();
                  const start = dayjs(row.start_datum);
                  const monateVergangen = heute.diff(start, "month");
                  const restdauer = Math.max(0, row.dauer - monateVergangen);
                  return restdauer;
                })()}
              </StyledTableCell>
              <StyledTableCell align="right">
                <div className="flex gap-4 justify-end">
                  <TrashIcon
                    className={`w-6 cursor-pointer hover:text-rose-500 ${
                      row.storniert ? "pointer-events-none text-gray-400" : ""
                    }`}
                    onClick={() => {
                      if (row.id && !row.storniert) {
                        setSelectedId(row.id);
                        setModalOpen(true);
                      }
                    }}
                  />
                </div>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
      {selectedId && (
        <StornoAmortizationModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          amortizationId={selectedId}
          onStorno={handleStornoUpdate}
        />
      )}
    </TableContainer>
  );
}

export default AmortizationTable;
