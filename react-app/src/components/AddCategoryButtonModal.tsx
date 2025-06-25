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
import { supabase } from "../supabase/client";
import { showSnackbar } from "../redux/snackbarSlice";
import { useAppDispatch } from "../redux/store";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function AddCategoryButtonModal() {
  const [open, setOpen] = React.useState(false);
  const [type, setType] = React.useState("einnahmen");
  const [name, setName] = React.useState("");
  const dispatch = useAppDispatch();

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    try {
      const { error } = await supabase.from("kategorien").insert([
        {
          name,
          type,
        },
      ]);

      if (error) {
      throw new Error(error.message);
    }

      setName("");
      setType("einnahmen");
      setOpen(false);
      dispatch(
        showSnackbar({
          message: "New record was successfuly added",
          severity: "success",
        })
      );
    } catch (err) {
      console.error("❌ Could not add category:", err);
      dispatch(
        showSnackbar({ message: "Failed to add category", severity: "error" })
      );
    }
  };

  return (
    <>
      <button
        className="text-white bg-black py-2 px-4 rounded-2xl font-bold cursor-pointer"
        onClick={() => {
          setOpen(true);
        }}
      >
        <AddIcon />
        <span className="ml-2">Add Category</span>
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
        <DialogTitle>{"Add a new category"}</DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-6">
            <FormControl variant="standard" sx={{}}>
              <InputLabel id="type-label">Type</InputLabel>
              <Select
                labelId="type-label"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              >
                <MenuItem value="einnahmen">Einnahmen</MenuItem>
                <MenuItem value="ausgaben">Ausgaben</MenuItem>
                <MenuItem value="abschreibung">Abschreibungen</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Name"
              variant="standard"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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

export default AddCategoryButtonModal;
