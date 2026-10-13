import type { Metadata } from "next";
import { Poppins, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  title: {
    default: "DevPostify — Where Developers Build Their Identity",
    template: "%s | DevPostify",
  },
  description:
    "Developer-first professional platform to publish technical architecture breakdowns, showcase engineering expertise, and engage in discussions.",
  keywords: [
    "developer publishing",
    "software engineering",
    "system design",
    "architecture breakdowns",
    "webdev",
    "devops",
    "ai",
  ],
  icons: {
    icon: "/brand/devpostify-mark.svg",
  },
  openGraph: {
    title: "DevPostify — Where Developers Build Their Identity",
    description:
      "A modern developer-first platform for sharing technical knowledge, architecture breakdowns, and engineering insights.",
    url: "/",
    siteName: "DevPostify",
    images: [
      {
        url: "/brand/devpostify-logo.svg",
        width: 1200,
        height: 630,
        alt: "DevPostify Nova",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevPostify — Where Developers Build Their Identity",
    description:
      "Developer-first platform to build developer identity and publish engineering insights.",
    images: ["/brand/devpostify-logo.svg"],
  },
  robots: {
    index: true,
    follow: true,
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
      <body className="flex min-h-screen flex-col bg-slate-950 font-sans text-slate-100 antialiased selection:bg-blue-600/30 selection:text-blue-200">
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
