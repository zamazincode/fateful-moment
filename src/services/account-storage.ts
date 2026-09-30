import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";

// Local stand-in for an auth backend: accounts and the active session live in
// the device keychain/keystore. Passwords are never stored, only a salted hash.

export type User = {
  name: string;
  email: string;
  // Set for the demo Apple/Google sign in, which has no stored account or password.
  provider?: "apple" | "google";
};

type StoredAccount = Omit<User, "provider"> & {
  salt: string;
  passwordHash: string;
};

export type CreateAccountResult = { ok: true; user: User } | { ok: false; reason: "email-taken" };
export type VerifyResult = { ok: true; user: User } | { ok: false; reason: "unknown-email" | "wrong-password" };
export type ChangePasswordResult = { ok: true } | { ok: false; reason: "unknown-email" | "wrong-password" };

const SESSION_KEY = "session.user";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

// SecureStore keys only allow [A-Za-z0-9._-], so the email is hashed into the key.
async function accountKey(email: string) {
  const digest = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, normalizeEmail(email));
  return `account.${digest}`;
}

function createSalt() {
  return Array.from(Crypto.getRandomBytes(16), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function hashPassword(password: string, salt: string) {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${password}`);
}

async function readAccount(email: string): Promise<StoredAccount | null> {
  const raw = await SecureStore.getItemAsync(await accountKey(email));
  return raw ? (JSON.parse(raw) as StoredAccount) : null;
}

export async function createAccount(name: string, email: string, password: string): Promise<CreateAccountResult> {
  if (await readAccount(email)) return { ok: false, reason: "email-taken" };

  const salt = createSalt();
  const account: StoredAccount = {
    name: name.trim(),
    email: normalizeEmail(email),
    salt,
    passwordHash: await hashPassword(password, salt),
  };
  await SecureStore.setItemAsync(await accountKey(email), JSON.stringify(account));

  return { ok: true, user: { name: account.name, email: account.email } };
}

export async function verifyCredentials(email: string, password: string): Promise<VerifyResult> {
  const account = await readAccount(email);
  if (!account) return { ok: false, reason: "unknown-email" };
  if ((await hashPassword(password, account.salt)) !== account.passwordHash) {
    return { ok: false, reason: "wrong-password" };
  }
  return { ok: true, user: { name: account.name, email: account.email } };
}

export async function changePassword(
  email: string,
  currentPassword: string,
  newPassword: string,
): Promise<ChangePasswordResult> {
  const account = await readAccount(email);
  if (!account) return { ok: false, reason: "unknown-email" };
  if ((await hashPassword(currentPassword, account.salt)) !== account.passwordHash) {
    return { ok: false, reason: "wrong-password" };
  }

  // A new salt with every password, so an old hash never matches again.
  const salt = createSalt();
  const updated: StoredAccount = { ...account, salt, passwordHash: await hashPassword(newPassword, salt) };
  await SecureStore.setItemAsync(await accountKey(email), JSON.stringify(updated));
  return { ok: true };
}

export async function deleteAccount(email: string) {
  await SecureStore.deleteItemAsync(await accountKey(email));
}

export async function saveSession(user: User) {
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(user));
}

export async function loadSession(): Promise<User | null> {
  try {
    const raw = await SecureStore.getItemAsync(SESSION_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export async function clearSession() {
  await SecureStore.deleteItemAsync(SESSION_KEY);
}
