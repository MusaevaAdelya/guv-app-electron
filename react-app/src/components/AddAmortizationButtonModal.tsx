import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import type { TransitionProps } from "@mui/material/transitions";
import * as React from "react";
import { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { fetchCategoriesByType } from "../redux/categoriesSlice";
import { addAmortization } from "../redux/entriesSlice";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { showSnackbar } from "../redux/snackbarSlice";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function AddAmortizationButtonModal() {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [kosten, setKosten] = useState<string>("");
  const [dauer, setDauer] = useState<string>("");
  const [kategorie, setKategorie] = useState("");
  const [startDatum, setStartDatum] = useState<dayjs.Dayjs | null>(dayjs());

  const kategorien = useAppSelector((state) => state.categories.list);

  useEffect(() => {
    dispatch(fetchCategoriesByType("abschreibungen"));
  }, [dispatch]);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const resetForm = () => {
    setName("");
    setKosten("");
    setDauer("");
    setKategorie("");
    setStartDatum(dayjs());
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      if (!name || !kosten || !dauer || !kategorie || !startDatum) {
        dispatch(showSnackbar({ message: "Bitte alle Felder ausfüllen", severity: "warning" }));
        setSubmitting(false);
        return;
      }

      await dispatch(
        addAmortization({
          name,
          kosten: Number(kosten),
          dauer: Number(dauer),
          kategorie,
          start_datum: startDatum.format("YYYY-MM-DD"),
        })
      ).unwrap();

      dispatch(
        showSnackbar({
          message: "Amortization erfolgreich hinzugefügt",
          severity: "success",
        })
      );

      handleClose();
      resetForm();
    } catch (err) {
      console.error("❌ Fehler beim Hinzufügen der Amortization:", err);
      dispatch(showSnackbar({ message: "Fehler beim Speichern", severity: "error" }));
    } finally {
      setSubmitting(false);
    }
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
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        slotProps={{
          paper: { className: "min-w-[50vw] p-4" },
        }}
      >
        <DialogTitle>{"Add a new amortization"}</DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-6">
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="flex gap-6">
              <TextField
                type="number"
                label="Kosten (€)"
                variant="outlined"
                value={kosten}
                onChange={(e) => setKosten(e.target.value)}
                inputProps={{
                  inputMode: "numeric",
                  style: { MozAppearance: "textfield" },
                }}
                sx={{
                  '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                    WebkitAppearance: 'none',
                    margin: 0,
                  },
                  flex: 1,
                }}
              />
              <FormControl variant="outlined" sx={{ flex: 1 }}>
                <InputLabel>Kategorie</InputLabel>
                <Select
                  value={kategorie}
                  onChange={(e) => setKategorie(e.target.value)}
                  label="Kategorie"
                  required
                >
                  {kategorien.map((kat) => (
                    <MenuItem key={kat.id} value={kat.id}>
                      {kat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="flex gap-6">
              <TextField
                type="number"
                label="Dauer (Monate)"
                value={dauer}
                onChange={(e) => setDauer(e.target.value)}
                variant="outlined"
                inputProps={{
                  inputMode: "numeric",
                  style: { MozAppearance: "textfield" },
                }}
                sx={{
                  '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                    WebkitAppearance: 'none',
                    margin: 0,
                  },
                  flex: 1,
                }}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Startdatum"
                  value={startDatum}
                  onChange={setStartDatum}
                  sx={{ flex: 1, width: "100%" }}
                />
              </LocalizationProvider>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <button
            onClick={handleClose}
            className="text-black py-2 px-4 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            Discard
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

export default AddAmortizationButtonModal;
