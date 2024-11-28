'use client';

import type { Metadata } from 'next';
import { EditorPreview } from '@/components/editor-preview';
import { z } from 'zod';

import { EditorTopbar } from '@/components/editor-topbar';
import { useContext, useState } from 'react';
import { useServerAction } from '@/utils/use-server-action';
import { previewEmailAction } from '@/actions/email';
import { catchActionError } from '@/actions/error';
import { toast } from 'sonner';
import axios from 'axios';
import { EditorContext, useEditorContext } from '@/stores/editor-store';
import { shallow } from 'zustand/shallow';
import { render } from '@maily-to/render';
import { SaveEmail } from '@/components/save-email';

export const metadata: Metadata = {
  title: 'Playground | Maily',
  description: 'Try out Maily, the Open-source editor for crafting emails.',
  twitter: {
    creator: '@imarikchakma',
    title: 'Playground | Maily',
    description: 'Try out Maily, the Open-source editor for crafting emails.',
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    siteName: 'Maily',
    title: 'Playground | Maily',
    description: 'Try out Maily, the Open-source editor for crafting emails.',
    type: 'website',
    url: 'https://maily.to',
    locale: 'en-US',
    images: {
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Maily Preview',
    },
  },
};

const previewEmailSchema = z.object({
  json: z.string().min(1, 'Please provide a JSON'),
});
export default function Playground() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  return (
    <main className="mx-auto w-full max-w-[calc(36rem+40px)] px-5">
      <div className="mt-6 flex flex-row items-center justify-between">
        <EditorTopbar />

        <SaveEmail data={{ title, desc }} />
      </div>

      <div className="mb-4 mt-6 flex flex-col gap-4">
        <input
          placeholder="Subject"
          className="w-full border-none outline-none"
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          className="w-full border-none outline-none"
          onChange={(e) => setDesc(e.target.value)}
        />
      </div>
      <EditorPreview />
    </main>
  );
}
