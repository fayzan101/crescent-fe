/**
 * Extracts an array from common API response wrappers (axios data, paginated shapes, etc.).
 */
export function normalizeApiList(data) {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== "object") return [];

  const preferredKeys = [
    "data",
    "items",
    "results",
    "list",
    "rows",
    "stores",
    "categories",
    "groups",
    "content",
  ];
  for (const key of preferredKeys) {
    if (Array.isArray(data[key])) return data[key];
  }

  for (const value of Object.values(data)) {
    if (Array.isArray(value)) return value;
    if (value && typeof value === "object") {
      const nested = normalizeApiList(value);
      if (nested.length > 0) return nested;
    }
  }

  return [];
}
