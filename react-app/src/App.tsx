import Header from "./layout/Header";
import ResultSection from "./layout/ResultSection";
import { createTheme, ThemeProvider } from "@mui/material";
import ChartsSection from "./layout/ChartsSection";

const theme = createTheme({
  typography: {
    fontFamily: "var(--font-base)", // Replace with your desired font
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <main className="bg-background rounded-4xl py-9">
        <div className="container mx-auto ">
          <Header />
          <ResultSection />
        </div>
        <ChartsSection/>
      </main>
    </ThemeProvider>
  );
}

export default App;
