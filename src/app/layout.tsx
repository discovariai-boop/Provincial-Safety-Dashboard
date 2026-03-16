import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster"
import Script from 'next/script'
import 'leaflet/dist/leaflet.css';

export const metadata: Metadata = {
  title: 'Guardian Command Center',
  description: "REAL-TIME COMMAND CENTER FOR LIMPOPO'S SAFETY REVOLUTION",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {process.env.NODE_ENV === 'development' && (
          <Script
            src="http://localhost:8097"
            strategy="beforeInteractive"
          />
        )}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased min-h-screen bg-background text-foreground')}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
