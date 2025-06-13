import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { setSearchQuery } from "../redux/entriesSlice";
import { ChangeEvent } from "react";

function SearchField() {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector(state => state.entries.searchQuery);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  return (
    <FormControl sx={{ width: "30ch" }} variant="outlined">
      <InputLabel htmlFor="outlined-search">Search</InputLabel>
      <OutlinedInput
        id="outlined-search"
        type="text"
        label="Search"
        value={searchQuery}
        onChange={handleChange}
        endAdornment={
          <InputAdornment position="end">
            <IconButton aria-label="search">
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        }
        sx={{
          "& .MuiOutlinedInput-notchedOutline": {
            borderRadius: "20px",
          },
        }}
      />
    </FormControl>
  );
}

export default SearchField;
