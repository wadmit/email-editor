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
import { render } from '@maily-to/render';
import axios from 'axios';
import { cookies } from 'next/headers';

const getToken = () => {
  
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken'); // or from cookies
  }
  return null;
};

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

export function SaveEmail({ data }: { data: { title: string; desc: string } }) {
  const { title, desc } = data;
  const token = getToken();
  const handleSaveTemmpalte = async (content: string) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/templates/email`,
        { name: title, desc, content, editableBody: content, variables: [] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      alert("Email saved successfully");
      toast.success('Success');
    } catch (error) {
      alert("Something went wrong");

      toast.error('Something went wrong');
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
      await handleSaveTemmpalte(data);
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
