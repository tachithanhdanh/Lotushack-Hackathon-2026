/**
 * Gordon — JSON Store
 *
 * A lightweight AsyncStorage-backed store that emulates a real backend.
 * Supports full CRUD on typed collections and singleton key/value pairs.
 *
 * Usage:
 *   const users = await store.getAll<User>(COLLECTIONS.USERS);
 *   await store.add<User>(COLLECTIONS.USERS, newUser);
 *   await store.update<User>(COLLECTIONS.USERS, 'USR001', { greenPoints: 200 });
 *   await store.remove(COLLECTIONS.USERS, 'USR001');
 *   await store.dropAll(COLLECTIONS.USERS);
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = 'gordon:';

function key(collection: string) {
  return `${PREFIX}${collection}`;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function readCollection<T extends { id: string }>(
  collection: string
): Promise<T[]> {
  const raw = await AsyncStorage.getItem(key(collection));
  if (!raw) return [];
  return JSON.parse(raw) as T[];
}

async function writeCollection<T>(collection: string, items: T[]): Promise<void> {
  await AsyncStorage.setItem(key(collection), JSON.stringify(items));
}

// ── Collection CRUD ───────────────────────────────────────────────────────────

/** Return all items in a collection. */
async function getAll<T extends { id: string }>(collection: string): Promise<T[]> {
  return readCollection<T>(collection);
}

/** Return a single item by id, or null if not found. */
async function getById<T extends { id: string }>(
  collection: string,
  id: string
): Promise<T | null> {
  const items = await readCollection<T>(collection);
  return items.find((i) => i.id === id) ?? null;
}

/** Append a new item. Throws if id already exists. */
async function add<T extends { id: string }>(collection: string, item: T): Promise<void> {
  const items = await readCollection<T>(collection);
  if (items.some((i) => i.id === item.id)) {
    throw new Error(`[store] duplicate id "${item.id}" in "${collection}"`);
  }
  items.push(item);
  await writeCollection(collection, items);
}

/** Merge patch into an existing item. Returns the updated item. Throws if not found. */
async function update<T extends { id: string }>(
  collection: string,
  id: string,
  patch: Partial<Omit<T, 'id'>>
): Promise<T> {
  const items = await readCollection<T>(collection);
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) throw new Error(`[store] id "${id}" not found in "${collection}"`);
  items[idx] = { ...items[idx], ...patch };
  await writeCollection(collection, items);
  return items[idx];
}

/** Remove an item by id. No-op if not found. */
async function remove(collection: string, id: string): Promise<void> {
  const items = await readCollection<{ id: string }>(collection);
  const filtered = items.filter((i) => i.id !== id);
  await writeCollection(collection, filtered);
}

/** Delete every item in a collection (keeps the key, sets to []). */
async function dropAll(collection: string): Promise<void> {
  await writeCollection(collection, []);
}

/** Replace the entire collection with a new array (used for seeding). */
async function seed<T>(collection: string, items: T[]): Promise<void> {
  await writeCollection(collection, items);
}

// ── Singleton key/value ───────────────────────────────────────────────────────

/** Read a singleton value. */
async function getSingleton<T>(singletonKey: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(`${PREFIX}${singletonKey}`);
  if (!raw) return null;
  return JSON.parse(raw) as T;
}

/** Write a singleton value. */
async function setSingleton<T>(singletonKey: string, value: T): Promise<void> {
  await AsyncStorage.setItem(`${PREFIX}${singletonKey}`, JSON.stringify(value));
}

/** Remove a singleton. */
async function removeSingleton(singletonKey: string): Promise<void> {
  await AsyncStorage.removeItem(`${PREFIX}${singletonKey}`);
}

// ── Utility ───────────────────────────────────────────────────────────────────

/** Wipe all gordon: keys — full factory reset. */
async function nukeAll(): Promise<void> {
  const allKeys = await AsyncStorage.getAllKeys();
  const gordonKeys = allKeys.filter((k) => k.startsWith(PREFIX));
  if (gordonKeys.length > 0) {
    await AsyncStorage.multiRemove(gordonKeys);
  }
}

/** Check whether the store has been seeded (has at least one gordon: key). */
async function isSeeded(): Promise<boolean> {
  const allKeys = await AsyncStorage.getAllKeys();
  return allKeys.some((k) => k.startsWith(PREFIX));
}

// ── Export ────────────────────────────────────────────────────────────────────

export const store = {
  // Collection
  getAll,
  getById,
  add,
  update,
  remove,
  dropAll,
  seed,
  // Singleton
  getSingleton,
  setSingleton,
  removeSingleton,
  // Utility
  nukeAll,
  isSeeded,
};
