export function isLikelyMarkdown(text: string): boolean {
  return /(^|\n)\s*(#{1,6}\s|[-*+]\s|\d+\.\s|>\s|```|\|.+\|)/m.test(text)
}

export function normalizeTourDescriptionToMarkdown(text: string): string {
  const normalized = text.replace(/\r\n/g, "\n").trim()
  if (!normalized) return ""
  if (isLikelyMarkdown(normalized)) return normalized

  return normalized
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n\n")
}

export function markdownToPlainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/(^|\n)\s*#{1,6}\s+/g, "$1")
    .replace(/(^|\n)\s*[-*+]\s+/g, "$1")
    .replace(/(^|\n)\s*\d+\.\s+/g, "$1")
    .replace(/[>*_~#]/g, "")
    .replace(/\n{2,}/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}