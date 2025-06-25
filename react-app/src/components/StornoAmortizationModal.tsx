import { useState, forwardRef } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import type { TransitionProps } from "@mui/material/transitions";
import { showSnackbar } from "../redux/snackbarSlice";
import { stornoAmortization, fetchEntries } from "../redux/entriesSlice";
import { useAppDispatch } from "../redux/store";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const Transition = forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface StornoAmortizationModalProps {
    open: boolean;
    onClose: () => void;
    amortizationId: string | null;
    onStorno: (id: string) => void;
}

export default function StornoAmortizationModal({
    open,
    onClose,
    amortizationId,
    onStorno
}: StornoAmortizationModalProps) {
    const dispatch = useAppDispatch();
    const [submitting, setSubmitting] = useState(false);

    const handleConfirm = async () => {
        if (submitting || !amortizationId) return;
        setSubmitting(true);

        try {
            await dispatch(stornoAmortization(amortizationId)).unwrap();
            onStorno(amortizationId);
            dispatch(
                showSnackbar({
                    message: "Amortisation erfolgreich storniert",
                    severity: "success",
                })
            );
            dispatch(fetchEntries()); 
            onClose();
        } catch (err) {
            console.error("❌ Fehler:", err); // DEBUG лог
            dispatch(
                showSnackbar({
                    message: "Fehler beim Stornieren der Amortisation",
                    severity: "error",
                })
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={onClose}
            aria-describedby="alert-dialog-storno"
            slotProps={{ paper: { className: "min-w-[30vw] p-4" } }}
        >
            <DialogTitle>{"Amortisation stornieren?"}</DialogTitle>

            <DialogContent>
                <div className="flex items-center gap-4 mt-2">
                    <div className="bg-yellow-100 text-yellow-600 rounded-full p-3 flex items-center justify-center">
                        <HelpOutlineIcon style={{ fontSize: 40 }} />
                    </div>
                    <p className="text-lg leading-snug">
                        Sind Sie sicher, dass Sie diese Amortisation<br />stornieren möchten?
                    </p>
                </div>
            </DialogContent>

            <DialogActions>
                <button
                    onClick={onClose}
                    className="text-black py-2 px-4 rounded-lg hover:bg-gray-100 cursor-pointer"
                    disabled={submitting}
                >
                    Nein
                </button>
                <button
                    onClick={handleConfirm}
                    className="bg-accent py-2 px-4 rounded-lg cursor-pointer disabled:opacity-50"
                    disabled={submitting || !amortizationId}
                >
                    Ja, stornieren
                </button>
            </DialogActions>
        </Dialog>
    );
}
