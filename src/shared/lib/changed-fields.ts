export function changedFields<T extends object>(
  value: T,
  initial: Partial<T>,
): Partial<T> {
  const current = value as Record<string, unknown>;
  const original = initial as Record<string, unknown>;
  const result: Record<string, unknown> = {};

  for (const key of new Set([...Object.keys(current), ...Object.keys(original)])) {
    const next = current[key];
    const previous = original[key];
    if (Object.is(next, previous)) continue;
    if (
      typeof File !== "undefined" &&
      (next instanceof File || previous instanceof File)
    ) {
      result[key] = next;
      continue;
    }
    if (
      JSON.stringify(next) !== JSON.stringify(previous)
    ) {
      result[key] = next;
    }
  }

  return result as Partial<T>;
}
