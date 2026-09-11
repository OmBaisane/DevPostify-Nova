import type { Metadata } from "next";
import { Poppins, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastContext";
import Navbar from "@/components/layout/Navbar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "DevPostify — Where Developers Build Their Identity",
    template: "%s | DevPostify",
  },
  description:
    "Developer-first professional platform to share technical architecture, engineering learnings, and insights.",
  icons: {
    icon: "/brand/devpostify-mark.svg",
  },
  openGraph: {
    title: "DevPostify — Where Developers Build Their Identity",
    description:
      "A modern developer-first platform for sharing technical knowledge, architecture breakdowns, and engineering insights.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${poppins.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased selection:bg-blue-600/30 selection:text-blue-200">
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <Navbar />
              <main className="min-h-[calc(100vh-4rem)]">{children}</main>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
