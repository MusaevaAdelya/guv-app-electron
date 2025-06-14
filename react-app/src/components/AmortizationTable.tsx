import { useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { PencilIcon } from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { fetchEntries } from "../redux/entriesSlice";
import type { Entry } from "../redux/entriesSlice";
import dayjs from "dayjs";

type AmortizationTableProps = {
  page: number;
  itemsPerPage: number;
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

function AmortizationTable({ page, itemsPerPage }: AmortizationTableProps) {
  const dispatch = useAppDispatch();
  const rows: Entry[] = useAppSelector((state) =>
    state.entries.entries.filter((e) => e.type === "amortization")
  );

  useEffect(() => {
    dispatch(fetchEntries());
  }, [dispatch]);

  const paginatedRows = rows.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

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
            <StyledTableCell align="right">Aktion</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedRows.map((row) => (
            <StyledTableRow key={row.id}>
              <StyledTableCell component="th" scope="row">
                {row.title}
              </StyledTableCell>
              <StyledTableCell align="right">{row.betrag}</StyledTableCell>
              <StyledTableCell align="right">
                {dayjs(row.datum)
                  .subtract(Number(row.id.split("-")[1]), "month")
                  .format("DD.MM.YYYY")}
              </StyledTableCell>
              <StyledTableCell align="right">{row.kategorie}</StyledTableCell>
              <StyledTableCell align="right">
                {dayjs(row.datum).format("DD.MM.YYYY")}
              </StyledTableCell>
              <StyledTableCell align="right">
                <div className="flex gap-4 justify-end">
                  <PencilIcon className="w-6 cursor-pointer hover:text-purple-500" />
                </div>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default AmortizationTable;
