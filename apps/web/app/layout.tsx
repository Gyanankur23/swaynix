import type { Metadata } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: '--font-jakarta',
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Swaynix - Human-Centric Community Hub",
  description: "Connect with genuine human interests across India. No bot-logic, no follower counts. Just pure engagement.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable} light`} suppressHydrationWarning style={{ colorScheme: 'light', backgroundColor: '#ffffff' }}>
      <body className="font-inter bg-white antialiased selection:bg-primary/20" style={{ backgroundColor: '#ffffff', color: '#1a1f2e' }}>
        <Script id="sw-force-light" strategy="beforeInteractive">
          {`(function(){var h=document.documentElement;h.classList.remove("dark");h.classList.add("light");h.setAttribute("data-theme","light");h.style.colorScheme="light";h.style.backgroundColor="#ffffff";if(document.body){document.body.style.backgroundColor="#ffffff";}})();`}
        </Script>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
