import sanitizeHtml from 'sanitize-html';

// Lista blanca estricta para el contenido del blog (anti-XSS).
// Todo lo que no esté aquí (scripts, iframes, eventos on*, javascript:, data:, estilos) se elimina.
const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'p', 'br', 'hr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'b', 'em', 'i', 'u', 's', 'strike',
    'blockquote', 'code', 'pre', 'ul', 'ol', 'li', 'a', 'img', 'span', 'div', 'table', 'thead', 'tbody',
    'tr', 'th', 'td', 'figure', 'figcaption', 'mark', 'sub', 'sup',
  ],
  allowedAttributes: {
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
    '*': ['class'],
  },
  allowedSchemes: ['https', 'http', 'mailto', 'tel'],
  allowedSchemesByTag: { img: ['https', 'http'] },
  allowProtocolRelative: false,
  transformTags: {
    a: (tagName, attribs) => ({
      tagName,
      attribs: { ...attribs, rel: 'noopener noreferrer nofollow' },
    }),
  },
};

export function sanitizeRichTextHtml(html: string) {
  if (!html) return '';
  return sanitizeHtml(String(html), OPTIONS);
}
