import * as SecureStore from "expo-secure-store";

import {
  changePassword,
  clearSession,
  createAccount,
  deleteAccount,
  loadSession,
  saveSession,
  verifyCredentials,
} from "@/services/account-storage";

const store = SecureStore as typeof SecureStore & { __reset: () => void; __dump: () => Map<string, string> };

beforeEach(() => store.__reset());

describe("account storage", () => {
  it("creates an account and never stores the plain password", async () => {
    const result = await createAccount("John Doe", "JohnDoe@Mail.com", "Johndoe1");

    expect(result).toEqual({ ok: true, user: { name: "John Doe", email: "johndoe@mail.com" } });
    const saved = [...store.__dump().values()].join();
    expect(saved).not.toContain("Johndoe1");
    expect(saved).toContain("passwordHash");
  });

  it("uses keychain-safe keys", async () => {
    await createAccount("John Doe", "johndoe@mail.com", "Johndoe1");

    for (const key of store.__dump().keys()) expect(key).toMatch(/^[\w.-]+$/);
  });

  it("rejects a second account with the same email, ignoring case", async () => {
    await createAccount("John Doe", "johndoe@mail.com", "Johndoe1");

    expect(await createAccount("Other", "JOHNDOE@mail.com", "Other123")).toEqual({
      ok: false,
      reason: "email-taken",
    });
  });

  it("salts each account differently", async () => {
    await createAccount("A", "a@mail.com", "Same1234");
    await createAccount("B", "b@mail.com", "Same1234");

    const hashes = [...store.__dump().values()].map((raw) => JSON.parse(raw).passwordHash);
    expect(new Set(hashes).size).toBe(2);
  });

  it("verifies the right password", async () => {
    await createAccount("John Doe", "johndoe@mail.com", "Johndoe1");

    expect(await verifyCredentials(" JohnDoe@mail.com", "Johndoe1")).toEqual({
      ok: true,
      user: { name: "John Doe", email: "johndoe@mail.com" },
    });
  });

  it("tells a wrong password apart from an unknown email", async () => {
    await createAccount("John Doe", "johndoe@mail.com", "Johndoe1");

    expect(await verifyCredentials("johndoe@mail.com", "Wrong123")).toEqual({ ok: false, reason: "wrong-password" });
    expect(await verifyCredentials("nobody@mail.com", "Johndoe1")).toEqual({ ok: false, reason: "unknown-email" });
  });

  it("saves, loads and clears the session", async () => {
    const user = { name: "John Doe", email: "johndoe@mail.com" };

    await saveSession(user);
    expect(await loadSession()).toEqual(user);

    await clearSession();
    expect(await loadSession()).toBeNull();
  });

  it("treats an unreadable session as signed out", async () => {
    await SecureStore.setItemAsync("session.user", "{not json");

    expect(await loadSession()).toBeNull();
  });

  it("changes the password after checking the current one", async () => {
    await createAccount("John Doe", "johndoe@mail.com", "Johndoe1");

    expect(await changePassword("johndoe@mail.com", "Johndoe1", "Newpass12")).toEqual({ ok: true });

    expect(await verifyCredentials("johndoe@mail.com", "Johndoe1")).toEqual({ ok: false, reason: "wrong-password" });
    expect((await verifyCredentials("johndoe@mail.com", "Newpass12")).ok).toBe(true);
  });

  it("re-salts the account when the password changes", async () => {
    await createAccount("John Doe", "johndoe@mail.com", "Johndoe1");
    const before = [...store.__dump().values()].join();

    await changePassword("johndoe@mail.com", "Johndoe1", "Newpass12");

    const salt = (dump: string) => JSON.parse(dump).salt;
    expect(salt([...store.__dump().values()].join())).not.toBe(salt(before));
  });

  it("keeps the password on a wrong current password or unknown email", async () => {
    await createAccount("John Doe", "johndoe@mail.com", "Johndoe1");

    expect(await changePassword("johndoe@mail.com", "Wrong123", "Newpass12")).toEqual({
      ok: false,
      reason: "wrong-password",
    });
    expect(await changePassword("nobody@mail.com", "Johndoe1", "Newpass12")).toEqual({
      ok: false,
      reason: "unknown-email",
    });
    expect((await verifyCredentials("johndoe@mail.com", "Johndoe1")).ok).toBe(true);
  });

  it("deletes an account", async () => {
    await createAccount("John Doe", "johndoe@mail.com", "Johndoe1");

    await deleteAccount("JohnDoe@mail.com");

    expect(await verifyCredentials("johndoe@mail.com", "Johndoe1")).toEqual({ ok: false, reason: "unknown-email" });
    expect(store.__dump().size).toBe(0);
  });
});
