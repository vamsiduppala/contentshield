export type ApiSuccess<T> = { success: true; data: T };
export type ApiFailure = { success: false; error: { code: string; message: string } };

function serialize<T>(value: T): T {
  if (typeof value === "bigint") return value.toString() as T;
  if (Array.isArray(value)) return value.map((item) => serialize(item)) as T;
  if (value && typeof value === "object" && !(value instanceof Date)) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, serialize(item)])) as T;
  }
  return value;
}

export function ok<T>(data: T): ApiSuccess<T> {
  return { success: true, data: serialize(data) };
}
