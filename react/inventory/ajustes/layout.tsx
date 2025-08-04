import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "primereact/resources/themes/lara-light-cyan/theme.css"
import "primereact/resources/primereact.min.css"
import "primeicons/primeicons.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ajustes de Inventario - PrimeReact",
  description: "Sistema de ajustes de inventario con PrimeReact",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
