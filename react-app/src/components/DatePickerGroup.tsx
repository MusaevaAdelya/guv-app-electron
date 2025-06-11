import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import CustomDatePicker from "./CustomDatePicker";
import dayjs from 'dayjs';
import { setDateFrom, setDateTo } from '../redux/guvSlice';
import { useAppDispatch, useAppSelector } from '../redux/store';

function DatePickerGroup() {
  const dispatch = useAppDispatch();
  const from = useAppSelector((state) => state.guv.from);
  const to = useAppSelector((state) => state.guv.to);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="flex gap-0 ">
        <CustomDatePicker borderRadius="15px 0px 0px 15px" label="Von" value={from ? dayjs(from) : null}
  onChange={(value) => dispatch(setDateFrom(value ? value.toISOString() : null))}/>
        <CustomDatePicker borderRadius="0px 15px 15px 0px" label="Bis" value={to ? dayjs(to) : null}
  onChange={(value) => dispatch(setDateTo(value ? value.toISOString() : null))}/>
      </div>
    </LocalizationProvider>
  );
}

export default DatePickerGroup;
