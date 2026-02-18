import { useRef, useState, useEffect } from 'react';
import { BubbleMenu, BubbleMenuProps } from '@tiptap/react';
import {
  BoldIcon,
  ChevronDownIcon,
  CodeIcon,
  ItalicIcon,
  List,
  ListOrdered,
  LucideIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from 'lucide-react';
import { BubbleMenuButton } from '../bubble-menu-button';
import { ColorPicker } from '../ui/color-picker';
import { BaseButton } from '../base-button';
import { useTextMenuState } from './use-text-menu-state';
import { isCustomNodeSelected } from '../../utils/is-custom-node-selected';
import { isTextSelected } from '../../utils/is-text-selected';
import { TooltipProvider } from '../ui/tooltip';
import { LinkInputPopover } from '../ui/link-input-popover';
import { Divider } from '../ui/divider';
import { AlignmentSwitch } from '../alignment-switch';
import { SVGIcon } from '../icons/grid-lines';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { cn } from '../../utils/classname';

export const FONT_FAMILY_OPTIONS: { label: string; value: string }[] = [
  { label: 'Default', value: '' },
  { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
  { label: 'Courier New', value: '"Courier New", Courier, monospace' },
  { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
  { label: 'Inter', value: 'Inter, sans-serif' },
  { label: 'Roboto', value: 'Roboto, sans-serif' },
  { label: 'Open Sans', value: '"Open Sans", sans-serif' },
];

export interface BubbleMenuItem {
  name?: string;
  isActive?: () => boolean;
  command?: () => void;
  shouldShow?: () => boolean;
  icon?: LucideIcon | SVGIcon;
  className?: string;
  iconClassName?: string;
  nameClassName?: string;
  disbabled?: boolean;

  tooltip?: string;
}

export type EditorBubbleMenuProps = Omit<BubbleMenuProps, 'children'> & {
  appendTo?: React.RefObject<any>;
};

export function TextBubbleMenu(props: EditorBubbleMenuProps) {
  const { editor, appendTo } = props;

  if (!editor) {
    return null;
  }

  const items: BubbleMenuItem[] = [
    {
      name: 'bold',
      isActive: () => editor?.isActive('bold')!,
      command: () => editor?.chain().focus().toggleBold().run()!,
      icon: BoldIcon,
      tooltip: 'Bold',
    },
    {
      name: 'italic',
      isActive: () => editor?.isActive('italic')!,
      command: () => editor?.chain().focus().toggleItalic().run()!,
      icon: ItalicIcon,
      tooltip: 'Italic',
    },
    {
      name: 'underline',
      isActive: () => editor?.isActive('underline')!,
      command: () => editor?.chain().focus().toggleUnderline().run()!,
      icon: UnderlineIcon,
      tooltip: 'Underline',
    },
    {
      name: 'strike',
      isActive: () => editor?.isActive('strike')!,
      command: () => editor?.chain().focus().toggleStrike().run()!,
      icon: StrikethroughIcon,
      tooltip: 'Strikethrough',
    },
    {
      name: 'code',
      isActive: () => editor?.isActive('code')!,
      command: () => editor?.chain().focus().toggleCode().run()!,
      icon: CodeIcon,
      tooltip: 'Code',
    },
  ];

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    ...(appendTo ? { appendTo: appendTo.current } : {}),
    pluginKey: 'textMenu',
    shouldShow: ({ editor, state, from, to, view }) => {
      if (!view || editor.view.dragging) {
        return false;
      }

      const domAtPos = view.domAtPos(from || 0).node as HTMLElement;
      const nodeDOM = view.nodeDOM(from || 0) as HTMLElement;
      const node = nodeDOM || domAtPos;

      if (isCustomNodeSelected(editor, node)) {
        return false;
      }

      return isTextSelected(editor);
    },
    tippyOptions: {
      popperOptions: {
        placement: 'top-start',
        modifiers: [
          {
            name: 'preventOverflow',
            options: {
              boundary: 'viewport',
              padding: 8,
            },
          },
          {
            name: 'flip',
            options: {
              fallbackPlacements: ['bottom-start', 'top-end', 'bottom-end'],
            },
          },
        ],
      },
      maxWidth: '100%',
    },
  };

  const state = useTextMenuState(editor);
  const fontDropdownRef = useRef<HTMLDivElement>(null);
  const fontSizeDropdownRef = useRef<HTMLDivElement>(null);
  const [fontDropdownOpen, setFontDropdownOpen] = useState(false);
  const [fontSizeDropdownOpen, setFontSizeDropdownOpen] = useState(false);

  useEffect(() => {
    if (!fontDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        fontDropdownRef.current &&
        !fontDropdownRef.current.contains(e.target as Node)
      ) {
        setFontDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [fontDropdownOpen]);

  useEffect(() => {
    if (!fontSizeDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        fontSizeDropdownRef.current &&
        !fontSizeDropdownRef.current.contains(e.target as Node)
      ) {
        setFontSizeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [fontSizeDropdownOpen]);

  return (
    <BubbleMenu
      {...bubbleMenuProps}
      className="mly-flex mly-gap-1 mly-rounded-lg mly-border mly-border-slate-200 mly-bg-white mly-p-0.5 mly-shadow-md"
    >
      <div className="mly-flex mly-gap-1 mly-items-center">
      <TooltipProvider>
        {items.map((item, index) => (
          <BubbleMenuButton key={index} {...item} />
        ))}

        <AlignmentSwitch
          alignment={state.textAlign}
          onAlignmentChange={(alignment) => {
            editor?.chain().focus().setTextAlign(alignment).run();
          }}
        />

        {!state.isListActive && (
          <>
            <BubbleMenuButton
              icon={List}
              command={() => {
                editor.chain().focus().toggleBulletList().run();
              }}
              tooltip="Bullet List"
            />
            <BubbleMenuButton
              icon={ListOrdered}
              command={() => {
                editor.chain().focus().toggleOrderedList().run();
              }}
              tooltip="Ordered List"
            />
          </>
        )}

        <LinkInputPopover
          defaultValue={state?.linkUrl ?? ''}
          onValueChange={(value) => {
            if (!value) {
              editor?.chain().focus().extendMarkRange('link').unsetLink().run();
              return;
            }

            editor
              ?.chain()
              .extendMarkRange('link')
              .setLink({ href: value })
              .run()!;
          }}
          tooltip="External URL"
        />

        <Divider />

        <div ref={fontDropdownRef} className="mly-relative">
          {fontDropdownOpen && (
            <div
              className="mly-absolute mly-bottom-full mly-left-0 mly-z-50 mly-mb-1 mly-min-w-[10rem] mly-max-h-[280px] mly-overflow-y-auto mly-rounded-md mly-border mly-border-slate-200 mly-bg-white mly-p-1 mly-shadow-md"
              role="listbox"
            >
              {FONT_FAMILY_OPTIONS.map((option) => (
                <button
                  key={option.value || 'default'}
                  type="button"
                  role="option"
                  className={cn(
                    'mly-flex mly-w-full mly-cursor-pointer mly-select-none mly-items-center mly-gap-2 mly-rounded-sm mly-px-2 mly-py-1.5 mly-text-left mly-text-sm mly-outline-none hover:mly-bg-gray-100',
                    option.value ? '' : 'mly-font-medium'
                  )}
                  style={option.value ? { fontFamily: option.value } : undefined}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    if (option.value) {
                      editor?.chain().focus().setMark('fontFamily', { fontFamily: option.value }).run();
                    } else {
                      editor?.chain().focus().unsetMark('fontFamily').run();
                    }
                    setFontDropdownOpen(false);
                  }}
                >
                  {option.label}
                </button>
              ))}
              <div className="mly-mt-1 mly-border-t mly-border-slate-200 mly-pt-1">
                <input
                  type="text"
                  placeholder="Custom font..."
                  className="mly-w-full mly-rounded mly-border mly-border-slate-200 mly-px-2 mly-py-1.5 mly-text-sm mly-outline-none focus:mly-ring-1 focus:mly-ring-slate-300"
                  onMouseDown={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const v = (e.target as HTMLInputElement).value.trim();
                      if (v) {
                        editor?.chain().focus().setMark('fontFamily', { fontFamily: v }).run();
                        setFontDropdownOpen(false);
                      }
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
              </div>
            </div>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <BaseButton
                variant="ghost"
                size="sm"
                type="button"
                className="!mly-h-7 mly-shrink-0 mly-px-2"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setFontDropdownOpen((open) => !open);
                }}
              >
                <span
                  className="mly-max-w-[72px] mly-truncate mly-text-xs mly-font-medium mly-text-slate-700"
                  style={{
                    fontFamily: state.currentFontFamily || 'inherit',
                  }}
                >
                  {FONT_FAMILY_OPTIONS.find(
                    (f) => f.value === state.currentFontFamily
                  )?.label ?? (state.currentFontFamily ? state.currentFontFamily : 'Font')}
                </span>
                <ChevronDownIcon className="mly-ml-0.5 mly-h-3 mly-w-3 mly-shrink-0 mly-opacity-60" />
              </BaseButton>
            </TooltipTrigger>
            <TooltipContent sideOffset={8}>Font family</TooltipContent>
          </Tooltip>
        </div>

        <div ref={fontSizeDropdownRef} className="mly-relative">
          {fontSizeDropdownOpen && (
            <div
              className="mly-absolute mly-bottom-full mly-left-0 mly-z-50 mly-mb-1 mly-w-48 mly-rounded-md mly-border mly-border-slate-200 mly-bg-white mly-p-2 mly-shadow-md"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="mly-space-y-2">
                <div>
                  <label className="mly-mb-0.5 mly-block mly-text-xs mly-font-medium mly-text-slate-600">Desktop (px)</label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    placeholder="e.g. 16"
                    className="mly-w-full mly-rounded mly-border mly-border-slate-200 mly-px-2 mly-py-1.5 mly-text-sm mly-outline-none focus:mly-ring-1 focus:mly-ring-slate-300"
                    defaultValue={state.currentFontSize ? state.currentFontSize.replace(/px$/, '') : ''}
                    onBlur={(e) => {
                      const raw = e.target.value.trim();
                      if (raw) {
                        const num = parseInt(raw, 10);
                        if (!Number.isNaN(num) && num >= 1 && num <= 120) {
                          const v = `${num}px`;
                          editor?.chain().focus().setFontSize(v, state.currentFontSizeMobile ?? undefined).run();
                        }
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') e.currentTarget.blur();
                    }}
                  />
                </div>
                <div>
                  <label className="mly-mb-0.5 mly-block mly-text-xs mly-font-medium mly-text-slate-600">Mobile (px, optional)</label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    placeholder="Same as desktop"
                    className="mly-w-full mly-rounded mly-border mly-border-slate-200 mly-px-2 mly-py-1.5 mly-text-sm mly-outline-none focus:mly-ring-1 focus:mly-ring-slate-300"
                    defaultValue={state.currentFontSizeMobile ? state.currentFontSizeMobile.replace(/px$/, '') : ''}
                    onBlur={(e) => {
                      const raw = e.target.value.trim();
                      if (raw) {
                        const num = parseInt(raw, 10);
                        if (!Number.isNaN(num) && num >= 1 && num <= 120) {
                          editor?.chain().focus().setFontSize(state.currentFontSize ?? '', `${num}px`).run();
                        }
                      } else {
                        editor?.chain().focus().setFontSize(state.currentFontSize ?? '', null).run();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') e.currentTarget.blur();
                    }}
                  />
                </div>
                <button
                  type="button"
                  className="mly-w-full mly-rounded mly-border mly-border-slate-200 mly-py-1.5 mly-text-xs mly-font-medium mly-text-slate-600 hover:mly-bg-slate-50"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    editor?.chain().focus().unsetFontSize().run();
                    setFontSizeDropdownOpen(false);
                  }}
                >
                  Clear size
                </button>
              </div>
            </div>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <BaseButton
                variant="ghost"
                size="sm"
                type="button"
                className="!mly-h-7 mly-shrink-0 mly-px-2"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setFontSizeDropdownOpen((open) => !open);
                }}
              >
                <span className="mly-max-w-[72px] mly-truncate mly-text-xs mly-font-medium mly-text-slate-700">
                  {state.currentFontSize
                    ? (state.currentFontSizeMobile
                      ? `${state.currentFontSize.replace(/px$/, '')} / ${state.currentFontSizeMobile.replace(/px$/, '')}`
                      : state.currentFontSize.replace(/px$/, ''))
                    : 'Size'}
                </span>
                <ChevronDownIcon className="mly-ml-0.5 mly-h-3 mly-w-3 mly-shrink-0 mly-opacity-60" />
              </BaseButton>
            </TooltipTrigger>
            <TooltipContent sideOffset={8}>Font size (px). Responsive: set mobile for small screens.</TooltipContent>
          </Tooltip>
        </div>

        <ColorPicker
          color={state.currentTextColor}
          onColorChange={(color) => {
            editor?.chain().setColor(color).run();
          }}
          tooltip="Text Color"
        >
          <BaseButton
            variant="ghost"
            size="sm"
            type="button"
            className="!mly-h-7 mly-w-7 mly-shrink-0 mly-p-0"
          >
            <div className="mly-flex mly-flex-col mly-items-center mly-justify-center mly-gap-[1px]">
              <span className="mly-font-bolder mly-font-mono mly-text-xs mly-text-slate-700">
                A
              </span>
              <div
                className="mly-h-[2px] mly-w-3"
                style={{ backgroundColor: state.currentTextColor }}
              />
            </div>
          </BaseButton>
        </ColorPicker>
      </TooltipProvider>
      </div>
    </BubbleMenu>
  );
}
