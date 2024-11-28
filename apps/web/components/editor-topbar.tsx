'use client';

import { cn } from '@/utils/classname';
import { ApiConfiguration } from './api-config';
import { CopyEmailHtml } from './copy-email-html';
import { DeleteEmail } from './delete-email';
import { PreviewEmail } from './preview-email';
import { SendTestEmail } from './send-test-email';
import { UpdateEmail } from './update-email';
import { useEditorContext } from '@/stores/editor-store';
import { SaveEmail } from './save-email';
import { Save } from 'lucide-react';

type EditorTopbarProps = {
  templateId?: string;
  showSaveButton?: boolean;
  className?: string;
};

export function EditorTopbar(props: EditorTopbarProps) {
  const { templateId, showSaveButton, className } = props;

  return (
    <div className={cn('flex items-center justify-between gap-1.5', className)}>
      <div className="flex items-center gap-1.5">
        {/* <ApiConfiguration /> */}
        <PreviewEmail />
        <CopyEmailHtml />
        {/* <SendTestEmail /> */}
      </div>

      {/* {templateId && (
        <div className="flex items-center gap-1.5">
          <DeleteEmail templateId={templateId} />
          <UpdateEmail templateId={templateId} />
        </div>
      )} */}

    </div>
  );
}
