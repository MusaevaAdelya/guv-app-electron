import Header from "./layout/Header";
import ResultSection from "./layout/ResultSection";
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: "var(--font-base)", // Replace with your desired font
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <main className="bg-background rounded-4xl md:p-8 p-2">
        <div className="container mx-auto">
          <Header />
          <ResultSection />
        </div>
      </main>
    </ThemeProvider>
  );
}

export default App;
