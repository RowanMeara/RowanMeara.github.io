import type { Metadata } from "next";
import "./globals.css";
import Footer from "./components/layout/Footer";

export const metadata: Metadata = {
  title: "Rowan Meara - Software Engineer",
  description: "Portfolio website of Rowan Meara, Software Engineer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased flex flex-col min-h-screen">
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
