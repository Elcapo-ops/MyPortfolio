import "@/styles/globals.css";
import { LiquidBackground } from "@/components/LiquidBackground";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata = { title: "Ahmad Fawad Akhtari — Full Stack Developer", description: "Full stack developer and software engineer portfolio." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-theme="blue"><body><LiquidBackground /><div className="noise" /><Navbar /><main className="relative z-10">{children}</main><Footer /></body></html>;
}
