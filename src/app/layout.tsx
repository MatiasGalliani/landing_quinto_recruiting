import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  title: "Cessione del Quinto in 48 Ore | Creditplan",
  description: "Ottieni fino a 75.000€ con la cessione del quinto in sole 48 ore. Processo rapido, sicuro e completamente digitale. Richiedi ora!",
  keywords: ["cessione del quinto", "prestito", "finanziamento", "creditplan", "48 ore", "rapido"],
  authors: [{ name: "Creditplan" }],
  openGraph: {
    title: "Cessione del Quinto in 48 Ore | Creditplan",
    description: "Ottieni fino a 75.000€ con la cessione del quinto in sole 48 ore.",
    type: "website",
    locale: "it_IT",
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'format-detection': 'telephone=yes',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <head>
        {/* Preconnect to external domains for faster resource loading */}
        <link rel="preconnect" href="https://creditplan.it" />
        <link rel="preconnect" href="https://www.organismo-am.it" />
        <link rel="dns-prefetch" href="https://creditplan.it" />
        <link rel="dns-prefetch" href="https://www.organismo-am.it" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
