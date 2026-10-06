type ClassValue = string | false | null | undefined;

/** Tiny className joiner (no dependency needed). */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
