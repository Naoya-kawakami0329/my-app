import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";



export const metadata: Metadata = {
  title: "chatApplication-with-chatGPT",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        
      >
        <AppProvider>
{children}
        </AppProvider>
        
      </body>
    </html>
  );
}
