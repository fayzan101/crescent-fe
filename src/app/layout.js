import { Geist, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/redux/Provider";
import ClearSessionOnClose from "./ClearSessionOnClose";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', 
})

export const metadata = {
  title: "Crescent tracking",
  description: "A tool to track your time and productivity, with a focus on simplicity and ease of use.",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
      >
        <ReduxProvider>
          <ClearSessionOnClose />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
