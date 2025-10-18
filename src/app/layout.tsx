import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google"; // heading & buttons
import { Open_Sans } from "next/font/google"; // subtitle/body
import "./globals.css";
import { Toaster } from 'sonner';
import { SessionProviderWrapper } from '@/providers/session-provider';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth';

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700", "900"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: "Cafe Banner",
  description: "Stylish cafe landing banners",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
    const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${openSans.variable} ${poppins.variable} antialiased`}
      >
        <SessionProviderWrapper session={session}>
          {children}
          <Toaster
        position="top-right"
        closeButton
        richColors={true}
        toastOptions={{
          classNames: {
            success: "bg-green-500 text-white",
            error: "bg-red-500 text-white",
            warning: "bg-yellow-400 text-black",
            info: "bg-blue-500 text-white",
            toast: "rounded-md shadow-lg",
          },
        }}
        />
        </SessionProviderWrapper>        
      </body>
    </html>
  );
}
