// Node-backed expo-crypto for jest, so hashes in tests are real SHA-256.
const { createHash, randomBytes } = jest.requireActual("crypto");

export enum CryptoDigestAlgorithm {
  SHA256 = "SHA-256",
}

export async function digestStringAsync(algorithm: CryptoDigestAlgorithm, data: string) {
  if (algorithm !== CryptoDigestAlgorithm.SHA256) throw new Error(`Unsupported algorithm: ${algorithm}`);
  return createHash("sha256").update(data).digest("hex");
}

export function getRandomBytes(byteCount: number) {
  return new Uint8Array(randomBytes(byteCount));
}
