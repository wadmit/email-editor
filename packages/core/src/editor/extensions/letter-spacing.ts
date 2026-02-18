import { Mark } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    letterSpacing: {
      setLetterSpacing: (letterSpacing: string) => ReturnType;
      unsetLetterSpacing: () => ReturnType;
    };
  }
}

export const LetterSpacing = Mark.create({
  name: 'letterSpacing',

  addAttributes() {
    return {
      letterSpacing: {
        default: null,
        parseHTML: (element) =>
          element.style.letterSpacing || null,
        renderHTML: (attributes) => {
          if (!attributes.letterSpacing) {
            return {};
          }
          return {
            style: `letter-spacing: ${attributes.letterSpacing}`,
          };
        },
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', HTMLAttributes, 0];
  },

  addCommands() {
    return {
      setLetterSpacing:
        (letterSpacing: string) =>
        ({ chain }: any) => {
          return chain().setMark(this.name, { letterSpacing }).run();
        },
      unsetLetterSpacing:
        () =>
        ({ chain }: any) => {
          return chain().unsetMark(this.name).run();
        },
    };
  },
});
