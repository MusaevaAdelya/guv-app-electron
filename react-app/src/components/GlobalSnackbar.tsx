import { useAppDispatch, useAppSelector } from "../redux/store";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { hideSnackbar } from "../redux/snackbarSlice";

function GlobalSnackbar() {
  const dispatch = useAppDispatch();
  const { open, message, severity } = useAppSelector((state) => state.snackbar);

  const handleClose = () => {
    dispatch(hideSnackbar());
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert onClose={handleClose} severity={severity} variant="filled" sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default GlobalSnackbar;
