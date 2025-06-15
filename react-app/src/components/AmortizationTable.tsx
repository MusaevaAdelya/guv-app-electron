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
import type { Entry } from "../redux/entriesSlice";
import dayjs from "dayjs";
import StornoAmortizationModal from "./StornoAmortizationModal";
import TableCellCategory from "./TableCellCategory";

type AmortizationTableProps = {
  rows: Entry[];
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

  useEffect(() => {
    dispatch(fetchEntries());
  }, [dispatch]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell align="right">Kosten (Monat)</StyledTableCell>
            <StyledTableCell align="right">Startdatum</StyledTableCell>
            <StyledTableCell align="right">Kategorie</StyledTableCell>
            <StyledTableCell align="right">Datum</StyledTableCell>
            <StyledTableCell align="right">Restwert</StyledTableCell>
            <StyledTableCell align="right">Restdauer</StyledTableCell>
            <StyledTableCell align="right">Aktion</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow
              key={row.id}
              sx={{
                opacity: row.storniert ? 0.4 : 1,
                textDecoration: row.storniert ? "line-through" : "none",
              }}
            >
              <StyledTableCell component="th" scope="row">
                {row.title}
              </StyledTableCell>
              <StyledTableCell align="right">
                {Math.abs(row.betrag)} €
              </StyledTableCell>
              <StyledTableCell align="right">
                {dayjs(row.start_datum).format("DD.MM.YYYY")}
              </StyledTableCell>
              <StyledTableCell align="right">
                <TableCellCategory title={row.kategorie} type={row.type} />
              </StyledTableCell>
              <StyledTableCell align="right">
                {dayjs(row.datum).format("DD.MM.YYYY")}
              </StyledTableCell>
              <StyledTableCell align="right">
                {row.restwert?.toFixed(2)} €
              </StyledTableCell>
              <StyledTableCell align="right">{row.restdauer}</StyledTableCell>
              <StyledTableCell align="right">
                <div className="flex gap-4 justify-end">
                  <TrashIcon
                    className={`w-6 cursor-pointer hover:text-rose-500 ${row.storniert ? "pointer-events-none text-gray-400" : ""
                      }`}
                    onClick={() => {
                      if (row.originalId && !row.storniert) {
                        setSelectedId(row.originalId);
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
        />
      )}
    </TableContainer>
  );
}

export default AmortizationTable;
