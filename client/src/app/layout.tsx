import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryProvider } from '@/providers/query-provider';
import { cn } from '@/utils/cn';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Lilo Chat',
  description: 'Chat with strangers',
  icons: {
    icon: '/lilochat-logo.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={cn(['bg-neutral-50', inter.className])}>
        <QueryProvider>
          <ChakraProvider>{children}</ChakraProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
