// src/app/layout.tsx
import "./globals.css";
import Header from "@/components/Header";
import { SessionProviderWrapper } from "@/components/SessionProviderWrapper";

export const metadata = {
  title: "MYTC Market",
  description: "Buy, sell, and discover trading cards.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper>
          <Header />
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}