// In-memory keychain for jest. Auto-applied because it sits next to node_modules.
const store = new Map<string, string>();

export const getItemAsync = jest.fn(async (key: string) => store.get(key) ?? null);
export const setItemAsync = jest.fn(async (key: string, value: string) => {
  if (!/^[\w.-]+$/.test(key)) throw new Error(`Invalid SecureStore key: ${key}`);
  store.set(key, value);
});
export const deleteItemAsync = jest.fn(async (key: string) => {
  store.delete(key);
});

// Test helpers, not part of the real module.
export function __reset() {
  store.clear();
}
export function __dump() {
  return new Map(store);
}
