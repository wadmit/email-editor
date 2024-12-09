'use client';

import type { Metadata } from 'next';
import { EditorTopbar } from '@/components/editor-topbar';
import { useState } from 'react';
import { SaveEmail } from '@/components/save-email';
import TemplateFile from './TemplateFile';
import UploadFile from './UploadFile';
import DynamicVariable from './DynamicVariable';
import { EditorPreview } from '@/components/editor-preview';

export const metadata: Metadata = {
  title: 'Wise Editor | Maily',
};

export default function Playground() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [variables, setVariables] = useState<{}>({});

  const triggerRefresh = () => {
    setRefresh((prev) => !prev);
  };

  const handleVaribales = (value: string) => {
    setVariables((prevVariables) => {
      const nextKey = Object.keys(prevVariables).length + 1;
      return {
        ...prevVariables,
        [nextKey]: value,
      };
    });
  };

  console.log(process.env.NEXT_PUBLIC_BACKEND_URL!)
  return (
    <main className="align-center mt-6 flex flex-row justify-center px-20">
      <div className="align-center h-1 flex-[0.1] justify-center gap-2">
        <DynamicVariable handleVaribales={handleVaribales} />
      </div>
      <div className="mx-auto flex w-full max-w-[calc(36rem+40px)] flex-[0.7] flex-col justify-between px-5">
        <div className="flex flex-row items-center justify-between">
          <EditorTopbar />

          <SaveEmail data={{ title, desc, variables }} />
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
      <div className="align-center h-1 flex-[0.2] justify-center gap-2">
        <UploadFile onUploadComplete={triggerRefresh} />
        <TemplateFile refresh={refresh} />
      </div>
    </main>
  );
}
