import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import CustomDatePicker from "./CustomDatePicker";

function DatePickerGroup() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="flex gap-0">
        <CustomDatePicker borderRadius="15px 0px 0px 15px" label="Von"/>
        <CustomDatePicker borderRadius="0px 15px 15px 0px" label="Bis"/>
      </div>
    </LocalizationProvider>
  );
}

export default DatePickerGroup;
