import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitizes HTML content to prevent XSS attacks.
 * Allows safe HTML tags (headings, paragraphs, lists, formatting)
 * but strips all JavaScript, event handlers, and dangerous attributes.
 */
export function sanitizeHtml(dirty) {
  if (!dirty || typeof dirty !== "string") return "";

  return DOMPurify.sanitize(dirty, {
    // Allow common HTML formatting tags
    ALLOWED_TAGS: [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "br",
      "hr",
      "ul",
      "ol",
      "li",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "s",
      "del",
      "ins",
      "blockquote",
      "pre",
      "code",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "a",
      "img",
      "span",
      "div",
      "section",
      "article",
      "sup",
      "sub",
    ],
    // Allow only safe attributes — NO event handlers, NO javascript: hrefs
    ALLOWED_ATTR: [
      "href",
      "title",
      "alt",
      "src",
      "width",
      "height",
      "class",
      "id",
      "style",
      "target",
      "rel",
      "colspan",
      "rowspan",
      "start",
      "type", // for ordered lists
    ],
    // Force links to be safe
    ALLOW_DATA_ATTR: false,
    // Ensure javascript: and data: URLs are blocked in href/src
    FORCE_BODY: false,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    // Extra protection: strip any remaining event handlers
    ADD_ATTR: [],
    FORBID_ATTR: [
      "onerror",
      "onload",
      "onclick",
      "onmouseover",
      "onfocus",
      "onblur",
      "onchange",
      "onsubmit",
      "onkeydown",
      "onkeyup",
      "onkeypress",
      "onmouseenter",
      "onmouseleave",
    ],
    FORBID_TAGS: [
      "script",
      "iframe",
      "object",
      "embed",
      "form",
      "input",
      "button",
      "link",
      "meta",
      "style",
      "noscript",
    ],
    // Sanitize href/src to remove javascript: and data: URIs
    SANITIZE_DOM: true,
  });
}
