'use client';

import type { Metadata } from 'next';
import { EditorTopbar } from '@/components/editor-topbar';
import { useEffect, useMemo, useState } from 'react';
import { SaveEmail } from '@/components/save-email';
import TemplateFile from './TemplateFile';
import UploadFile from './UploadFile';
import DynamicVariable from './DynamicVariable';
import { EditorPreview } from '@/components/editor-preview';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import { buildBackendUrl } from '@/lib/backend-url';
import defaultEditorJSON from '../utils/default-editor-json.json';
import type { JSONContent } from '@tiptap/core';

export const metadata: Metadata = {
  title: 'Wise Editor | Maily',
};

type SaveMode = 'create' | 'edit' | 'duplicate';
type VariablesMap = Record<string, string>;

function getNestedPayload(payload: any): any {
  if (!payload || typeof payload !== 'object') {
    return payload;
  }
  if ('data' in payload) {
    return getNestedPayload(payload.data);
  }
  return payload;
}

function parseVariables(variables: unknown): VariablesMap {
  if (!variables) return {};
  if (typeof variables === 'string') {
    try {
      const parsed = JSON.parse(variables);
      if (parsed && typeof parsed === 'object') {
        return parsed as VariablesMap;
      }
      return {};
    } catch {
      return {};
    }
  }
  if (typeof variables === 'object') {
    return variables as VariablesMap;
  }
  return {};
}

function parseEditableBody(template: any): JSONContent {
  const candidates = [
    template?.editableBody,
    template?.editable_body,
    template?.content,
    template?.json,
    template?.editorJson,
    template?.contentJson,
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    if (typeof candidate === 'string') {
      try {
        const parsed = JSON.parse(candidate);
        if (parsed && typeof parsed === 'object') {
          return parsed as JSONContent;
        }
      } catch {
        continue;
      }
    }
    if (typeof candidate === 'object') {
      return candidate as JSONContent;
    }
  }

  return defaultEditorJSON as JSONContent;
}

export default function Playground() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [variables, setVariables] = useState<VariablesMap>({});
  const [editorContent, setEditorContent] = useState<JSONContent>(
    defaultEditorJSON as JSONContent
  );
  const [editorRenderKey, setEditorRenderKey] = useState(0);
  const [isTemplateLoading, setIsTemplateLoading] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  const editId = searchParams.get('edit')?.trim() || '';
  const duplicateId = searchParams.get('duplicate')?.trim() || '';
  const mode: SaveMode = editId
    ? 'edit'
    : duplicateId
      ? 'duplicate'
      : 'create';
  const templateId = editId || duplicateId;

  const modeLabel = useMemo(() => {
    if (mode === 'edit') return 'Edit Mode';
    if (mode === 'duplicate') return 'Duplicate Mode';
    return 'New Template';
  }, [mode]);

  const triggerRefresh = () => {
    setRefresh((prev) => !prev);
  };

  const handleVaribales = (value: string) => {
    setVariables((prevVariables) => {
      const nextKey = Object.keys(prevVariables).length + 1;
      return {
        ...prevVariables,
        [nextKey.toString()]: value,
      };
    });
  };

  useEffect(() => {
    let isCancelled = false;

    if (!templateId) {
      setIsTemplateLoading(false);
      setTitle('');
      setDesc('');
      setVariables({});
      setEditorContent(defaultEditorJSON as JSONContent);
      setEditorRenderKey((prev) => prev + 1);
      return;
    }

    const loadTemplate = async () => {
      try {
        setIsTemplateLoading(true);
        const response = await axios.get(
          buildBackendUrl(`/dashboard/templates/email/${templateId}`),
          {
            withCredentials: true,
          }
        );
        if (isCancelled) return;

        const template = getNestedPayload(response.data);
        setTitle(template?.name || template?.title || '');
        setDesc(template?.desc || template?.description || '');
        setVariables(parseVariables(template?.variables));
        setEditorContent(parseEditableBody(template));
        setEditorRenderKey((prev) => prev + 1);
      } catch (error) {
        if (isCancelled) return;
        toast.error('Failed to load template.');
      } finally {
        if (!isCancelled) {
          setIsTemplateLoading(false);
        }
      }
    };

    loadTemplate();

    return () => {
      isCancelled = true;
    };
  }, [templateId]);

  const handleAfterSave = (savedTemplate: any) => {
    const savedData = getNestedPayload(savedTemplate);
    const savedTemplateId = savedData?.id || savedData?._id;

    if (savedTemplateId && mode !== 'edit') {
      router.replace(`/?edit=${savedTemplateId}`);
    }
  };

  return (
    <main className="align-center mt-6 flex flex-row justify-center px-20">
      <div className="align-center h-1 flex-[0.1] justify-center gap-2">
        <DynamicVariable handleVaribales={handleVaribales} />
      </div>
      <div className="mx-auto flex w-full max-w-[calc(36rem+40px)] flex-[0.7] flex-col justify-between px-5">
        <div className="flex flex-row items-center justify-between">
          <EditorTopbar />

          <SaveEmail
            data={{ title, desc, variables }}
            mode={mode}
            templateId={templateId}
            onSaved={handleAfterSave}
          />
        </div>

        <div className="mb-4 mt-6 flex flex-col gap-4">
          <p className="text-xs text-gray-500">{modeLabel}</p>
          <input
            placeholder="Subject"
            className="w-full border-none outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Description"
            className="w-full border-none outline-none"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>
        {isTemplateLoading ? (
          <p className="text-sm text-gray-500">Loading template...</p>
        ) : null}
        <EditorPreview key={editorRenderKey} content={editorContent} />
      </div>
      <div className="align-center h-1 flex-[0.2] justify-center gap-2">
        <UploadFile onUploadComplete={triggerRefresh} />
        <TemplateFile refresh={refresh} />
      </div>
    </main>
  );
}
