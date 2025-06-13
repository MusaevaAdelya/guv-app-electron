import Header from "./layout/Header";
import ResultSection from "./layout/ResultSection";
import { createTheme, ThemeProvider } from "@mui/material";
import ChartsSection from "./layout/ChartsSection";
import TableSection from "./layout/TableSection";
import Amortization from "./layout/Amortization";
import GlobalSnackbar from "./components/GlobalSnackbar";

const theme = createTheme({
  typography: {
    fontFamily: "var(--font-base)",
  },
});

function App() {
  
  return (
    <ThemeProvider theme={theme}>
      <main className="bg-background rounded-4xl ">
        <div className="container mx-auto py-9">
          <Header />
          <ResultSection />
        </div>
        <ChartsSection />
        <div className="container mx-auto py-9">
          <TableSection />
          <Amortization />
        </div>
        
      </main>
      <GlobalSnackbar />
    </ThemeProvider>
  );
}

export default App;
