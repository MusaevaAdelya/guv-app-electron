import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import type { TransitionProps } from "@mui/material/transitions";
import * as React from "react";
import { TextField } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function AddRecordButtonModal() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [age, setAge] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };

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
            <FormControl variant="outlined" sx={{}}>
              <InputLabel id="demo-simple-select-standard-label">
                Type
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={age}
                onChange={handleChange}
                label="Age"
                required
              >
                <MenuItem value={10}>Einnahmen</MenuItem>
                <MenuItem value={20}>Ausgaben</MenuItem>
              </Select>
            </FormControl>
            <TextField
              id="standard-basic"
              label="Title"
              variant="outlined"
              fullWidth
            />
            <TextField
              id="standard-basic"
              type="number"
              label="Amount (€)"
              variant="outlined"
              fullWidth
            />
            <div className="flex gap-8 mb-6">
              <FormControl
                variant="outlined"
                className="flex-1"
                sx={{ width: "100%" }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  Category
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={age}
                  onChange={handleChange}
                  label="Age"
                  required
                >
                  <MenuItem value={10}>Möbel</MenuItem>
                  <MenuItem value={20}>Miete</MenuItem>
                </Select>
              </FormControl>
              <TextField
                id="standard-basic"
                type="number"
                label="Umsaztsteuer ($)"
                variant="outlined"
                className="flex-1"
                fullWidth
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <button
            onClick={handleClose}
            className="text-black py-2 px-4 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            Discharge
          </button>
          <button
            onClick={handleClose}
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
