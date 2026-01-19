import type {Metadata} from 'next';
import './globals.css';
import { Inter, Space_Grotesk } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';

const fontBody = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const fontHeadline = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-headline',
});

export const metadata: Metadata = {
  title: 'ICU AI Guardian',
  description: 'A production-ready ICU AI system with real-time monitoring, adaptive learning, and explainable risk thresholds.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('font-body antialiased', fontBody.variable, fontHeadline.variable)} suppressHydrationWarning={true}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
