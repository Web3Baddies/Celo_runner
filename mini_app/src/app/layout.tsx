import "./globals.css";
import "nes.css/css/nes.min.css";
import { Providers } from "@/components/Providers";
import { FarcasterSDK } from "@/components/FarcasterSDK";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Celo Runner - Web3 Gaming on Celo",
  description: "Play, learn about Celo, and earn rewards!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} style={{ imageRendering: 'pixelated' }}>
        <Providers>
          <FarcasterSDK>
            {children}
          </FarcasterSDK>
        </Providers>
      </body>
    </html>
  );
}
