import "@/styles/globals.css";
import { LanguageProvider } from "../context/LanguageContext";
import { Playfair_Display, Inter } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-heading",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-body",
});

export default function MyApp({ Component, pageProps }) {
  return (
    <LanguageProvider>
      <main className={`${playfair.variable} ${inter.variable}`}>
        <Component {...pageProps} />
      </main>
    </LanguageProvider>
  );
}
