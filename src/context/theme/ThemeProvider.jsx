// import { useEffect } from "react";
// import { ThemeContext } from "./themeContext";
// import useLocalStorage from "../../hooks/useLocalStorage";

// const ThemeProvider = ({ children }) => {
//   const [theme, setTheme] = useLocalStorage("theme", "light");

//   const toggleTheme = () => {
//     setTheme((prev) => (prev === "light" ? "dark" : "light"));
//   };

//   useEffect(() => {
//     document.documentElement.classList.toggle("dark", theme === "dark");
//   }, [theme]);

//   return (
//     <ThemeContext.Provider value={{ theme, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// export default ThemeProvider;

// context/theme/ThemeProvider.jsx

import { ThemeContext } from "./themeContext";
import useLocalStorage from "../../hooks/useLocalStorage";

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useLocalStorage("theme", "light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme === "dark" ? "dark" : ""}>{children}</div>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
