function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Normalise a colour name for comparison: upper-case, letters/digits/spaces only, single spaces. */
export function normColour(s: string): string {
  return s.toUpperCase().replace(/[^A-Z0-9 ]/g, '').replace(/\s+/g, ' ').trim()
}

/** Pull a colour name out of an image filename, e.g. "Luna-Transparent  Green.png" -> "Transparent Green",
 * "Luna-Light Blue - Edited.png" -> "Light Blue". */
export function colourFromFilename(filename: string, modelName: string): string {
  const base = filename.replace(/\.[a-z0-9]+$/i, '')
  const prefixRe = new RegExp(`^${escapeRegExp(modelName)}[\\s_-]+`, 'i')
  let rest = base.replace(prefixRe, '')
  rest = rest.replace(/[\s_-]*\b(edited|copy|final)\b.*$/i, '')
  return rest.replace(/\s+/g, ' ').replace(/[\s_-]+$/, '').trim()
}
