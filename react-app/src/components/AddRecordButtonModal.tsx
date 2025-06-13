import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import type { TransitionProps } from "@mui/material/transitions";
import { useState, forwardRef, useEffect } from "react";
import { TextField } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { addEntry } from "../redux/entriesSlice";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useAppDispatch, useAppSelector } from "../redux/store";
import dayjs from "dayjs";
import { fetchCategoriesByType } from "../redux/categoriesSlice";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function AddRecordButtonModal() {
  const dispatch = useAppDispatch();
  const { list: categories } = useAppSelector((state) => state.categories);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("einnahmen");
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [tax, setTax] = useState("");
  const [date, setDate] = useState<any>(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    try {
      await dispatch(
        addEntry({
          type: type as "einnahmen" | "ausgaben",
          title,
          betrag: Number(amount),
          umsatzsteuer: Number(tax),
          datum: dayjs(date).format("YYYY-MM-DD"),
          kategorie: category,
        })
      ).unwrap();
      setOpen(false);
      setTitle("");
      setAmount("");
      setTax("");
      setCategory("");
      setType("einnahmen");
      setDate(null);
    } catch (err) {
      console.error("❌ Could not add record:", err);
      console.log({
        type: type as "einnahmen" | "ausgaben",
        title,
        betrag: Number(amount),
        umsatzsteuer: Number(tax),
        datum: dayjs(date).format("YYYY-MM-DD"),
        kategorie: category,
      });
      alert("Failed to add record");
    }
  };

  useEffect(() => {
    if (type) {
      dispatch(fetchCategoriesByType(type));
      setCategory("");
    }
  }, [type, dispatch]);

  return (
    <>
      <button
        className="text-white bg-black py-2 px-4 rounded-2xl font-bold cursor-pointer"
        onClick={handleClickOpen}
      >
        <AddIcon />
        <span className="ml-2">Add Record</span>
      </button>
      <Dialog
        open={open}
        slots={{
          transition: Transition,
        }}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        slotProps={{
          paper: {
            className: "min-w-[50vw] p-4",
          },
        }}
      >
        <DialogTitle>{"Add a new expense record"}</DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-6 mt-4">
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              variant="outlined"
              fullWidth
            />
            <TextField
              type="number"
              label="Amount (€)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              variant="outlined"
              fullWidth
            />

            <FormControl
              variant="outlined"
              className="flex-1"
              sx={{ width: "100%" }}
            >
              <InputLabel id="demo-simple-select-standard-label">
                Type
              </InputLabel>
              <Select
                value={type}
                onChange={(e) => setType(e.target.value)}
                label="Type"
              >
                <MenuItem value="einnahmen">Einnahmen</MenuItem>
                <MenuItem value="ausgaben">Ausgaben</MenuItem>
              </Select>
            </FormControl>

            <div className="flex gap-8">
              <FormControl
                variant="outlined"
                className="flex-1"
                sx={{ width: "100%" }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  Category
                </InputLabel>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  label="Category"
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                type="number"
                label="Umsaztsteuer ($)"
                variant="outlined"
                className="flex-1"
                fullWidth
                value={tax}
                onChange={(e) => setTax(e.target.value)}
              />
            </div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]} sx={{ flex: 1 }}>
                <DatePicker
                  label="Date"
                  value={date}
                  onChange={(value) => setDate(value)}
                  sx={{ width: "100%" }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>
        </DialogContent>
        <DialogActions>
          <button
            onClick={handleClose}
            className="text-black py-2 px-4 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handleSubmit}
            className="bg-accent py-2 px-4 rounded-lg cursor-pointer"
          >
            Submit
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AddRecordButtonModal;
