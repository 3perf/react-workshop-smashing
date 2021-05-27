import { createContext, useEffect, useMemo, useState } from "react";

export const ThemeContext = createContext();

export function ThemeContextProvider({ children }) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.body.classList.add("theme-" + theme);

    return () => {
      document.body.classList.remove("theme-" + theme);
    };
  }, [theme]);

  const contextValue = useMemo(() => {
    return { theme, setTheme };
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}
