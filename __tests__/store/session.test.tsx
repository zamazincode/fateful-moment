import { act, renderHook, waitFor } from "@testing-library/react-native";
import * as SecureStore from "expo-secure-store";

import { createAccount, loadSession, saveSession } from "@/services/account-storage";
import { SessionProvider, useSession } from "@/store/session";

const store = SecureStore as typeof SecureStore & { __reset: () => void };

beforeEach(() => store.__reset());

async function renderSession() {
  const hook = await renderHook(() => useSession(), { wrapper: SessionProvider });
  await waitFor(() => expect(hook.result.current.status).toBe("ready"));
  return hook;
}

describe("useSession", () => {
  it("starts signed out when nothing is saved", async () => {
    const { result } = await renderSession();

    expect(result.current.user).toBeNull();
  });

  it("restores a saved session on launch", async () => {
    await saveSession({ name: "John Doe", email: "johndoe@mail.com" });

    const { result } = await renderSession();

    expect(result.current.user).toEqual({ name: "John Doe", email: "johndoe@mail.com" });
  });

  it("signs up, signs in and persists the session", async () => {
    const { result } = await renderSession();

    await act(() => result.current.signUp("John Doe", "johndoe@mail.com", "Johndoe1"));

    expect(result.current.user).toEqual({ name: "John Doe", email: "johndoe@mail.com" });
    expect(await loadSession()).toEqual(result.current.user);
  });

  it("signs in with a stored account", async () => {
    await createAccount("John Doe", "johndoe@mail.com", "Johndoe1");
    const { result } = await renderSession();

    let outcome;
    await act(async () => {
      outcome = await result.current.signIn("johndoe@mail.com", "Johndoe1");
    });

    expect(outcome).toMatchObject({ ok: true });
    expect(result.current.user?.name).toBe("John Doe");
  });

  it("stays signed out on a wrong password", async () => {
    await createAccount("John Doe", "johndoe@mail.com", "Johndoe1");
    const { result } = await renderSession();

    let outcome;
    await act(async () => {
      outcome = await result.current.signIn("johndoe@mail.com", "Wrong123");
    });

    expect(outcome).toEqual({ ok: false, reason: "wrong-password" });
    expect(result.current.user).toBeNull();
  });

  it("signs in a demo user for a social provider", async () => {
    const { result } = await renderSession();

    await act(() => result.current.signInWithProvider("google"));

    expect(result.current.user?.name).toBe("Google User");
  });

  it("signs out and forgets the session", async () => {
    await saveSession({ name: "John Doe", email: "johndoe@mail.com" });
    const { result } = await renderSession();

    await act(() => result.current.signOut());

    expect(result.current.user).toBeNull();
    expect(await loadSession()).toBeNull();
  });

  it("throws outside of a SessionProvider", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(renderHook(() => useSession())).rejects.toThrow("useSession must be used inside SessionProvider");
  });
});
