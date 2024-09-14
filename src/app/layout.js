import { Outfit } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import ThemeProviderSystem from "@/components/ThemeProvider";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Blog App",
  description: "Dev : Roshan",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true} className="scrollbar-hide">
      <body className={`${outfit.className} antialiased scrollbar-hide`}>
        <SessionProvider>
          {" "}
          <ThemeProviderSystem
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProviderSystem>
        </SessionProvider>
      </body>
    </html>
  );
}
