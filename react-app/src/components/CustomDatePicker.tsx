import { DatePicker } from "@mui/x-date-pickers";

type CustomDatePickerProps = {
  borderRadius?: string;
  label: string;
};

function CustomDatePicker({
  borderRadius = "10px",
  label,
}: CustomDatePickerProps) {
  return (
    <DatePicker
      label={label}
      slotProps={{
        textField: {
          sx: {
            "& .MuiInputLabel-root": {
              fontSize: "1.2rem",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              fontSize: "1.3rem",
            }
          },
          InputProps: {
            sx: {
              borderRadius,
            },
          },
        },
      }}
    />
  );
}

export default CustomDatePicker;
