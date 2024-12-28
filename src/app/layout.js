import { Ubuntu_Mono } from "next/font/google";
import "./globals.css";
import BackdropColumn from "../components/BackdropColumn";
import MouseOverlay from "@/components/MouseOverlay";

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

 let backdropColumns = [];
  for(let i=0; i<50; i++){
    backdropColumns.push(<BackdropColumn index={i} key={i}/>)
  }


  return (
    <html lang="en">
      <body className={`${ubuntuMono.className} antialiased`}>
        <div className="backdrop">
          
          {backdropColumns}

          <MouseOverlay/>

          </div>
        <div className="terminal">
          {children}
        </div>
      
      </body>
    </html>
  );
}
