'use client';

// @ts-ignore
import { useFormStatus } from 'react-dom';
import { Eye, Loader2, Monitor, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { shallow } from 'zustand/shallow';
import { previewEmailAction } from '@/actions/email';
import { useServerAction } from '@/utils/use-server-action';
import { useEditorContext } from '@/stores/editor-store';
import { catchActionError } from '@/actions/error';
import { EmailFrame } from './email-frame';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { cn } from '@/utils/classname';

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
        <Eye className="inline-block shrink-0 sm:mr-1" size={16} />
      )}
      <span className="hidden sm:inline-block">Preview Email</span>
    </button>
  );
}

export function PreviewEmail() {
  const { json, previewText } = useEditorContext((s) => {
    return {
      json: s.json,
      previewText: s.previewText,
    };
  }, shallow);

  const [html, setHtml] = useState<string>('');
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [action, isPending] = useServerAction(
    catchActionError(previewEmailAction),
    (result) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Result is always there
      const { data, error } = result!;
      if (error) {
        toast.error(error.message || 'Something went wrong');
        return;
      }
      setHtml(data);
    }
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* @ts-ignore */}
        <form action={action}>
          <input name="json" type="hidden" value={JSON.stringify(json) || ''} />
          <input name="previewText" type="hidden" value={previewText} />
          <SubmitButton disabled={!json} />
        </form>
      </DialogTrigger>
      {!isPending ? (
        <DialogContent className="animation-none z-[99999] flex min-h-[75vh] w-full min-w-0 max-w-[620px] flex-col overflow-hidden p-0 max-[680px]:h-full max-[680px]:rounded-none max-[680px]:border-0 max-[680px]:shadow-none">
          <DialogTitle className="sr-only">Preview Email</DialogTitle>
          <DialogDescription className="sr-only">
            Preview of the email that end users will receive
          </DialogDescription>
          <div className="flex shrink-0 items-center justify-center gap-0.5 border-b border-gray-200 bg-gray-50 p-1.5">
            <button
              type="button"
              onClick={() => setPreviewViewport('desktop')}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                previewViewport === 'desktop'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <Monitor className="h-4 w-4 shrink-0" />
              Desktop
            </button>
            <button
              type="button"
              onClick={() => setPreviewViewport('mobile')}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                previewViewport === 'mobile'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <Smartphone className="h-4 w-4 shrink-0" />
              Mobile
            </button>
          </div>
          <div
            className={cn(
              'flex flex-1 items-start justify-center overflow-auto bg-gray-100',
              previewViewport === 'mobile' && 'py-4'
            )}
          >
            <div
              className={cn(
                'h-full min-h-0 overflow-auto bg-white',
                previewViewport === 'desktop' ? 'w-full' : 'w-[375px] shrink-0 shadow-lg'
              )}
            >
              <EmailFrame className="h-full min-h-[60vh] w-full" innerHTML={html} />
            </div>
          </div>
        </DialogContent>
      ) : null}
    </Dialog>
  );
}
