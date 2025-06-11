import { DatePicker } from "@mui/x-date-pickers";
import { Dayjs } from 'dayjs';

type CustomDatePickerProps = {
  borderRadius?: string;
  label: string;
  value: Dayjs | null;
  onChange: (value: Dayjs | null) => void;
};

function CustomDatePicker({
  borderRadius = "10px",
  label,
  value,
  onChange
}: CustomDatePickerProps) {
  return (
    <DatePicker
      label={label}
      value={value}
      onChange={onChange}
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
