import { Ubuntu_Mono } from "next/font/google";
import "./globals.css";

const ubuntuMono = Ubuntu_Mono(
  {
    subsets: ["latin"],
    weight: '400',
  }
);

export const metadata = {
  title: "Beat Sherlock",
  description: "A fun app where you race against sherlock holmes to solve a mystery",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${ubuntuMono.className} antialiased`}>
      
        <div className="terminal">
          {children}
        </div>
      
      </body>
    </html>
  );
}
