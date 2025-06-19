import { createContext } from "react";

const ThemeContext = createContext({
  darkMode: true,
  toggleTheme: () => {},
  theme: {},
});

export default ThemeContext;
