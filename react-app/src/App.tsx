import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "./redux/store";
import { toggleTheme } from "./redux/themeSlice";

function App() {
  const darkMode = useAppSelector((state) => state.theme.darkMode);
  const dispatch = useAppDispatch();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className="bg-primary text-black">
      <button onClick={() => dispatch(toggleTheme())}>
        {darkMode ? "🌙 Dark" : "☀️ Light"}
      </button>

    </div>
  );
}

export default App;
