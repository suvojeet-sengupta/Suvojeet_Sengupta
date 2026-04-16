const ALLOWED_TAGS = [
  'a',
  'abbr',
  'b',
  'blockquote',
  'br',
  'code',
  'del',
  'div',
  'em',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hr',
  'i',
  'img',
  'li',
  'ol',
  'p',
  'pre',
  's',
  'span',
  'strong',
  'sub',
  'sup',
  'table',
  'tbody',
  'td',
  'th',
  'thead',
  'tr',
  'u',
  'ul',
] as const;

const ALLOWED_TAGS_SET = new Set<string>(ALLOWED_TAGS);

const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  a: ['href', 'name', 'target', 'rel', 'title'],
  img: ['src', 'alt', 'title', 'width', 'height', 'loading', 'decoding'],
  code: ['class'],
  pre: ['class'],
  '*': ['class'],
};

const ALLOWED_SCHEMES = ['http', 'https', 'mailto', 'tel'];
const ALLOWED_SCHEMES_SET = new Set<string>(ALLOWED_SCHEMES);
const ATTR_REGEX = /([^\s"'=<>`/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

function getAllowedAttributesForTag(tagName: string): Set<string> {
  const tagSpecific = ALLOWED_ATTRIBUTES[tagName] ?? [];
  const globalAttrs = ALLOWED_ATTRIBUTES['*'] ?? [];
  return new Set<string>([...tagSpecific, ...globalAttrs]);
}

function decodeBasicEntities(value: string): string {
  return value
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'");
}

function escapeHtmlAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function hasAllowedScheme(value: string): boolean {
  const normalized = decodeBasicEntities(value).trim().toLowerCase();
  if (!normalized || normalized.startsWith('/') || normalized.startsWith('#')) {
    return true;
  }

  const schemeMatch = normalized.match(/^([a-z][a-z0-9+\-.]*):/);
  if (!schemeMatch) {
    return true;
  }

  return ALLOWED_SCHEMES_SET.has(schemeMatch[1]);
}

function sanitizeAttributes(tagName: string, rawAttributes: string): string {
  const allowedAttributes = getAllowedAttributesForTag(tagName);
  const collected: Array<[string, string]> = [];
  let match: RegExpExecArray | null;

  while ((match = ATTR_REGEX.exec(rawAttributes)) !== null) {
    const attributeName = match[1].toLowerCase();
    if (!allowedAttributes.has(attributeName)) {
      continue;
    }

    if (attributeName.startsWith('on') || attributeName === 'style') {
      continue;
    }

    const attributeValue = (match[2] ?? match[3] ?? match[4] ?? '').trim();
    if (!attributeValue && attributeName !== 'target') {
      continue;
    }

    if ((attributeName === 'href' || attributeName === 'src') && !hasAllowedScheme(attributeValue)) {
      continue;
    }

    collected.push([attributeName, escapeHtmlAttribute(attributeValue)]);
  }

  if (tagName === 'a') {
    const target = collected.find(([name]) => name === 'target');
    if (target && target[1] === '_blank') {
      const hasRel = collected.some(([name]) => name === 'rel');
      if (!hasRel) {
        collected.push(['rel', 'noopener noreferrer nofollow']);
      }
    }
  }

  if (collected.length === 0) {
    return '';
  }

  return ` ${collected.map(([name, value]) => `${name}="${value}"`).join(' ')}`;
}

export function sanitizeRichTextHtml(input: string): string {
  const strippedDangerousBlocks = input
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\s*(script|style|iframe|object|embed|form|textarea|select|button)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
    .replace(/<\s*(link|meta|base|input)\b[^>]*\/?>/gi, '');

  return strippedDangerousBlocks.replace(
    /<\/?([a-z0-9-]+)\b([^>]*)>/gi,
    (fullTag, rawTagName: string, rawAttributes: string) => {
      const tagName = rawTagName.toLowerCase();
      if (!ALLOWED_TAGS_SET.has(tagName)) {
        return '';
      }

      const isClosingTag = fullTag.startsWith('</');
      if (isClosingTag) {
        return `</${tagName}>`;
      }

      const attributes = sanitizeAttributes(tagName, rawAttributes);
      const selfClosing = /\/\s*>$/.test(fullTag);
      return `<${tagName}${attributes}${selfClosing ? ' />' : '>'}`;
    },
  );
}
