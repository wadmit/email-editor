import './globals.css';

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { TopLoader } from '@/components/top-loader';
import { EditorProvider } from '@/stores/editor-store';
import axios from 'axios';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Wise Editor | Maily',
}
export const viewport: Viewport = {
  themeColor: '#ffffff',
};

export interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout(props: RootLayoutProps) {
  const { children } = props as any;

  return (
    <html lang="en">
      <body className={inter.className}>
        <TopLoader />
        <EditorProvider apiKey={''} endpoint={''}>
          {children}
        </EditorProvider>
      </body>
    </html>
  );
}
