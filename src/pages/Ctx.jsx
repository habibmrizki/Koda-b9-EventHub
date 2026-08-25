// // Ctx.jsx
// import { useContext } from "react";
// import ThemeContext from "../context/theme/themeContext";

// function Ctx() {
//   const { theme, toggleTheme } = useContext(ThemeContext);

//   const isDark = theme === "dark";

//   return (
//     <div
//       className={`p-6 mt-6 rounded-xl border transition-colors duration-300 ${
//         isDark
//           ? "bg-slate-900 text-white border-slate-700"
//           : "bg-gray-100 text-gray-900 border-gray-300"
//       }`}
//     >
//       <h3 className="text-xl font-bold mb-2">Testing ThemeContext</h3>
//       <p className="mb-4">
//         Current Theme:{" "}
//         <span className="font-semibold uppercase tracking-wider">{theme}</span>
//       </p>

//       <button
//         onClick={toggleTheme}
//         className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 active:scale-95 cursor-pointer ${
//           isDark
//             ? "bg-white text-slate-900 hover:bg-gray-200"
//             : "bg-slate-900 text-white hover:bg-slate-800"
//         }`}
//       >
//         Switch to {isDark ? "Light" : "Dark"} Mode
//       </button>
//     </div>
//   );
// }

// export default Ctx;
