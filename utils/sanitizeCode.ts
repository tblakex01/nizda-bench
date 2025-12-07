const encodeForText = (code: string): string =>
  code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const sanitizeStyle = (styleValue: string): string => {
  const forbiddenPatterns = /(expression|javascript:|vbscript:|data:|url\s*\(\s*javascript:|@import)/i;
  if (forbiddenPatterns.test(styleValue)) {
    return '';
  }

  const sanitizedDeclarations = styleValue
    .split(';')
    .map((declaration) => declaration.trim())
    .filter(Boolean)
    .filter((declaration) => !forbiddenPatterns.test(declaration));

  return sanitizedDeclarations.join('; ');
};

export const sanitizeCode = (code: string): string => {
  if (typeof DOMParser === 'undefined') {
    return encodeForText(code);
  }

  const blockedTags = ['script', 'style', 'iframe', 'object', 'embed', 'link', 'meta'];
  const doc = new DOMParser().parseFromString(code, 'text/html');

  blockedTags.forEach((tag) => {
    doc.querySelectorAll(tag).forEach((element) => element.remove());
  });

  Array.from(doc.body.getElementsByTagName('*')).forEach((element) => {
    Array.from(element.attributes).forEach((attr) => {
      const name = attr.name.toLowerCase();
      const value = attr.value.trim();

      if (name.startsWith('on')) {
        element.removeAttribute(attr.name);
        return;
      }

      if (name === 'style') {
        const cleanedStyle = sanitizeStyle(value);
        if (cleanedStyle) {
          element.setAttribute('style', cleanedStyle);
        } else {
          element.removeAttribute(attr.name);
        }
        return;
      }

      const isUriAttr = ['src', 'href', 'xlink:href'].includes(name);
      if (isUriAttr && value.toLowerCase().startsWith('javascript:')) {
        element.removeAttribute(attr.name);
      }
    });
  });

  return doc.body.innerHTML;
};
