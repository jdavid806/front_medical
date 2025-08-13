import { Inter } from "next/font/google";
import "./globals.css.js";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
const inter = Inter({
  subsets: ["latin"]
});
export const metadata = {
  title: "Ajustes de Inventario - PrimeReact",
  description: "Sistema de ajustes de inventario con PrimeReact"
};
export default function RootLayout({
  children
}) {
  return /*#__PURE__*/React.createElement("html", {
    lang: "es"
  }, /*#__PURE__*/React.createElement("body", {
    className: inter.className
  }, children));
}