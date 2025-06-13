import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TrashIcon } from "@heroicons/react/24/outline";
import TableCellTitle from "./TableCellTitle";
import TableCellCategory from "./TableCellCategory";
import { useAppDispatch } from '../redux/store';
import { useEffect } from 'react';
import { fetchEntries,deleteEntry } from '../redux/entriesSlice';
import dayjs from 'dayjs';
import type { Entry } from '../redux/entriesSlice';

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

type ExpensesTableProps = {
  rows: Entry[];
};


function ExpensesTable({ rows }: ExpensesTableProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchEntries());
  }, [dispatch]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Title</StyledTableCell>
            <StyledTableCell align="right">Category</StyledTableCell>
            <StyledTableCell align="right">Amount</StyledTableCell>
            <StyledTableCell align="right">Steuer</StyledTableCell>
            <StyledTableCell align="right">Datum</StyledTableCell>
            <StyledTableCell align="right">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.id}>
              <StyledTableCell component="th" scope="row">
                <TableCellTitle title={row.title} type={row.type} />
              </StyledTableCell>
              <StyledTableCell align="right">
                <TableCellCategory title={row.kategorie} type={row.type} />
              </StyledTableCell>
              <StyledTableCell align="right">{row.betrag}</StyledTableCell>
              <StyledTableCell align="right">{row.umsatzsteuer}</StyledTableCell>
              <StyledTableCell align="right">{dayjs(row.datum).format('DD.MM.YYYY')}</StyledTableCell>
              <StyledTableCell align="right">
                <div className="flex gap-4 justify-end">
                  {row.type!=="amortization" && (<TrashIcon className="w-6 cursor-pointer hover:text-rose-500" onClick={() => dispatch(deleteEntry(row))} />)}
                </div>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ExpensesTable;
