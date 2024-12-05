import { JSONContent } from '@tiptap/core';

export function replaceRedirectUrl(json: JSONContent) {
  if (json.content && Array.isArray(json.content)) {
    json.content.forEach((item) => {
      if (item.type === 'button' && item.attrs && item.attrs.url) {
        item.attrs.url = `{{url}}&redirect=${item.attrs.url}`;
      }
    });
  }
  return json;
}
