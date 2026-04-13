'use client';

// @ts-ignore
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';
import { shallow } from 'zustand/shallow';
import { saveEmailAction } from '@/actions/email';
import { useServerAction } from '@/utils/use-server-action';
import { useEditorContext } from '@/stores/editor-store';
import { catchActionError } from '@/actions/error';
import axios from 'axios';
import { buildBackendUrl } from '@/lib/backend-url';

interface SubmitButtonProps {
  disabled?: boolean;
}

function SubmitButton(props: SubmitButtonProps) {
  const { disabled } = props;
  const { pending } = useFormStatus();

  return (
    <button
      className="flex min-h-[28px] items-center justify-center rounded-md bg-black px-2 py-1 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 max-sm:w-7"
      disabled={disabled || pending}
      type="submit"
    >
      {pending ? (
        <Loader2
          className="inline-block shrink-0 animate-spin sm:mr-1"
          size={16}
        />
      ) : (
        <Save className="inline-block shrink-0 sm:mr-1" size={16} />
      )}
      <span className="hidden sm:inline-block">Save</span>
    </button>
  );
}

function replaceVariables(template: string, variableMap: {}) {
  for (const [key, value] of Object.entries(variableMap)) {
      const placeholder = `{{${value}}}`;
      template = template.replace(new RegExp(placeholder, 'g'), `{{${key}}}`);
  }
  return template;
}

type SaveMode = 'create' | 'edit' | 'duplicate';

interface SaveEmailProps {
  data: {
    title: string;
    desc: string;
    variables: {};
  };
  mode?: SaveMode;
  templateId?: string;
  onSaved?: (savedTemplate: any) => void;
}

export function SaveEmail(props: SaveEmailProps) {
  const { data, mode = 'create', templateId, onSaved } = props;
  const { title, desc, variables } = data;
  const handleSaveTemplate = async (content: string, editableBody: string) => {
    try {
      const updatedContent = replaceVariables(content, variables);
      const normalizedName = title.trim() || 'Untitled template';
      const payload = {
        name:
          mode === 'duplicate' && !/\(copy\)$/i.test(normalizedName)
            ? `${normalizedName} (Copy)`
            : normalizedName,
        desc,
        content: updatedContent,
        editableBody,
        variables,
      };

      if (mode === 'edit' && templateId) {
        const response = await axios.patch(
          buildBackendUrl(`/dashboard/templates/email/${templateId}`),
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        );
        onSaved?.(response.data);
        toast.success('Template updated successfully');
        return;
      }

      const response = await axios.post(
        buildBackendUrl('/dashboard/templates/email'),
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      onSaved?.(response.data);
      toast.success('Template saved successfully');
    } catch (error) {
      toast.error('Something went wrong while saving template');
    }
  };

  const { json, previewText, subject } = useEditorContext((s) => s, shallow);
  const [action] = useServerAction(
    catchActionError(saveEmailAction),
    async (result) => {
      const { error, data } = result!;
      if (error) {
        toast.error(error.message || 'Something went wrong');
        return;
      }
      await handleSaveTemplate(data, JSON.stringify(json) || '{}');
    }
  );

  return (
    // @ts-ignore
    <form action={action}>
      <input name="subject" type="hidden" value={subject} />
      <input name="json" type="hidden" value={JSON.stringify(json) || ''} />
      {/* <input name="previewText" type="hidden" value={previewText} /> */}
      <input name="previewText" type="hidden" value={''} />

      <SubmitButton />
    </form>
  );
}
