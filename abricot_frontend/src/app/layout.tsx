import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Abricot",
  description: "Application de gestion de projets et de tâches pour les équipes de développement",
};

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <html lang="fr" className={manrope.variable}>
        <body>{children}</body>
      </html>
    );
}
