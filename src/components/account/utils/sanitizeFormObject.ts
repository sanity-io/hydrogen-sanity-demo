export default function sanitizeFormObject(obj: Record<string, unknown>) {
  return JSON.parse(
    JSON.stringify(obj, (_key, value) => {
      return value === null ? '' : value;
    }),
  );
}
