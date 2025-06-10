import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import TableCellCategory from "./TableCellCategory";

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

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
  type: "profit" | "loss" | "amortization"
) {
  return { name, calories, fat, carbs, protein, type };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0, "amortization"),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3, "loss"),
  createData("Eclair", 262, 16.0, 24, 6.0, "profit"),
  createData("Cupcake", 305, 3.7, 67, 4.3, "profit"),
  createData("Gingerbread", 356, 16.0, 49, 3.9, "loss"),
];

function AmortizationTable() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell align="right">Kosten</StyledTableCell>
            <StyledTableCell align="right">Dauer</StyledTableCell>
            <StyledTableCell align="right">Start Datum</StyledTableCell>
            <StyledTableCell align="right">Restwert</StyledTableCell>
            <StyledTableCell align="right">Restdauer (Monate)</StyledTableCell>
            <StyledTableCell align="right">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell component="th" scope="row">
                {row.name}
              </StyledTableCell>
              <StyledTableCell align="right">
                <TableCellCategory
                  title={row.calories.toString()}
                  type={row.type}
                />
              </StyledTableCell>
              <StyledTableCell align="right">{row.fat}</StyledTableCell>
              <StyledTableCell align="right">{row.carbs}</StyledTableCell>
              <StyledTableCell align="right">{row.protein}</StyledTableCell>
              <StyledTableCell align="right">{row.protein}</StyledTableCell>
              <StyledTableCell align="right">
                <div className="flex gap-4 justify-end">
                  <PencilIcon className="w-6 cursor-pointer hover:text-purple-500" />
                  <TrashIcon className="w-6 cursor-pointer hover:text-rose-500" />
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
