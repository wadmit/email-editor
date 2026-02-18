import { Mark } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (fontSize: string, fontSizeMobile?: string | null) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
  }
}

export const FontSize = Mark.create({
  name: 'fontSize',

  addAttributes() {
    return {
      fontSize: {
        default: null,
        parseHTML: (element) =>
          element.style.fontSize || null,
        renderHTML: (attributes) => {
          if (!attributes.fontSize) {
            return {};
          }
          const style = `font-size: ${attributes.fontSize}`;
          return { style };
        },
      },
      fontSizeMobile: {
        default: null,
        parseHTML: () => null,
        renderHTML: () => ({}),
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', HTMLAttributes, 0];
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize: string, fontSizeMobile?: string | null) =>
        ({ chain }: any) => {
          const attrs: { fontSize: string; fontSizeMobile?: string | null } = { fontSize };
          if (fontSizeMobile !== undefined) attrs.fontSizeMobile = fontSizeMobile || null;
          return chain().setMark(this.name, attrs).run();
        },
      unsetFontSize:
        () =>
        ({ chain }: any) => {
          return chain().unsetMark(this.name).run();
        },
    };
  },
});
