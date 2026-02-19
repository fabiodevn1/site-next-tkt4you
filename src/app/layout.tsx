import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import Providers from "@/providers/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ticket4You (Next) - Ingressos Online",
  description: "A melhor plataforma de ingressos online do Brasil.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} antialiased`} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
