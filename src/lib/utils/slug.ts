/**
 * Create a URL-safe slug from text
 * @param text - The text to convert to a slug
 * @returns A URL-safe slug
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Replace spaces and special characters with hyphens
    .replace(/[^a-z0-9\s-]/g, '')
    // Replace multiple spaces/hyphens with single hyphen
    .replace(/[\s-]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
}

/**
 * Validate if a slug is URL-safe
 * @param slug - The slug to validate
 * @returns True if the slug is URL-safe
 */
export function isValidSlug(slug: string): boolean {
  // Check if slug contains only lowercase letters, numbers, and hyphens
  // and doesn't start or end with hyphens
  return /^[a-z0-9]+([a-z0-9-]*[a-z0-9]+)?$/.test(slug);
}

/**
 * Ensure a slug is unique by appending a number if needed
 * @param baseSlug - The base slug
 * @param existingSlugs - Array of existing slugs to check against
 * @returns A unique slug
 */
export function ensureUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  let slug = baseSlug;
  let counter = 1;
  
  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}