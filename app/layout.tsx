import type { Metadata } from "next";
import "./globals.css";
import Footer from "./components/layout/Footer";

export const metadata: Metadata = {
  title: "Rowan Meara - Software Engineer",
  description: "Rowan Meara, software engineer building large-scale distributed systems.",
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
