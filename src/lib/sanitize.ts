import sanitizeHtml from "sanitize-html";

export function sanitizeInput(input: string): string {
  return sanitizeHtml(input, {
    allowedTags: [],        
    allowedAttributes: {},  
  });
}

export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized = { ...obj };
  for (const key in sanitized) {
    if (typeof sanitized[key] === "string") {
      (sanitized as Record<string, unknown>)[key] = sanitizeInput(
        sanitized[key] as string
      );
    }
  }
  return sanitized;
}