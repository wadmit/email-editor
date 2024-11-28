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
import TemplateFile from './TemplateFile';

export const metadata: Metadata = {
  title: 'Wise Editor | Maily',
};

const previewEmailSchema = z.object({
  json: z.string().min(1, 'Please provide a JSON'),
});
export default function Playground() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  return (
    <main className="flex flex-row align-center justify-center mt-6 px-2">
      <div className="flex flex-col justify-between mx-auto w-full max-w-[calc(36rem+40px)] flex-[0.8] px-5">
        <div className="flex flex-row items-center justify-between">
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
      </div>
      <div className="flex-[0.2]">
        <TemplateFile/>
        </div>{' '}
    </main>
  );
}
