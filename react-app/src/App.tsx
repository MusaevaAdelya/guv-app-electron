import Header from "./layout/Header";
import {
  createTheme,
  ThemeProvider
} from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: 'var(--font-base)', // Replace with your desired font
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <main className="bg-background rounded-4xl p-8">
        <Header></Header>
      </main>
    </ThemeProvider>
  );
}

export default App;
