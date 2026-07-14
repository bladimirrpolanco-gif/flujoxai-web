const DANGEROUS_TAGS = /<(script|style|iframe|object|embed|link|meta|base|form|input|button|textarea|select|option|svg|math)\b[\s\S]*?<\/\1>/gi;
const SELF_CLOSING_DANGEROUS_TAGS = /<(script|style|iframe|object|embed|link|meta|base|form|input|button|textarea|select|option|svg|math)\b[^>]*\/?>/gi;
const EVENT_HANDLER_ATTRS = /\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;
const SRC_DOC_ATTR = /\ssrcdoc\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;

function cleanUrlAttributes(html: string) {
  return html.replace(/\s(href|src)\s*=\s*(["'])(.*?)\2/gi, (full, attr, quote, value) => {
    const trimmed = String(value).trim();
    if (/^(https?:|mailto:|tel:|\/|#)/i.test(trimmed)) {
      return ` ${attr}=${quote}${trimmed}${quote}`;
    }
    return ` ${attr}=${quote}#${quote}`;
  });
}

export function sanitizeRichTextHtml(html: string) {
  if (!html) return '';

  let cleaned = String(html);
  cleaned = cleaned.replace(DANGEROUS_TAGS, '');
  cleaned = cleaned.replace(SELF_CLOSING_DANGEROUS_TAGS, '');
  cleaned = cleaned.replace(EVENT_HANDLER_ATTRS, '');
  cleaned = cleaned.replace(SRC_DOC_ATTR, '');
  cleaned = cleaned.replace(/javascript:/gi, '');
  cleaned = cleaned.replace(/data:/gi, '');
  cleaned = cleanUrlAttributes(cleaned);

  return cleaned;
}
