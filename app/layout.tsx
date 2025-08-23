import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Twitter Stats Card",
  description: "Check Twitter profile stats with a simple Next.js app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 text-gray-900">
        

        <main className="flex justify-center items-start p-3 sm:p-4 md:p-6">
          <Navbar />
          {children}
        </main>

        <footer className="w-full text-center text-sm text-gray-500 py-4 mt-8">
          Built with ❤️ using Next.js + Tailwind
        </footer>
      </body>
    </html>
  );
}
