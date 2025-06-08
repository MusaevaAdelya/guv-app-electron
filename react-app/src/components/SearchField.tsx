import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function SearchField() {
  return (
    <FormControl sx={{ width: "30ch" }} variant="outlined">
      <InputLabel htmlFor="outlined-search">Search</InputLabel>
      <OutlinedInput
        id="outlined-search"
        type="text"
        label="Search"
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
