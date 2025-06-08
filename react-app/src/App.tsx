import Header from "./layout/Header";
import ResultSection from "./layout/ResultSection";
import { createTheme, ThemeProvider } from "@mui/material";
import ChartsSection from "./layout/ChartsSection";
import TableSection from "./layout/TableSection";

const theme = createTheme({
  typography: {
    fontFamily: "var(--font-base)", // Replace with your desired font
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <main className="bg-background rounded-4xl ">
        <div className="container mx-auto p-9">
          <Header />
          <ResultSection />
        </div>
        <ChartsSection/>
        <div className="container mx-auto p-9">
          <TableSection/>
        </div>
      </main>
    </ThemeProvider>
  );
}

export default App;
