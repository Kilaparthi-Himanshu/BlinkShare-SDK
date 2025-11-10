// src/utils/detectEnvironment.ts
function detectEnvironment() {
  if (typeof process !== "undefined" && process.env.NODE_ENV === "development") {
    return "development";
  }
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    return "development";
  }
  return "production";
}

// src/utils/encrypt.ts
async function encryptFile(file, userKey) {
  const encoder = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(userKey),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encryptionKey = await window.crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 1e5, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
  const fileBuffer = await file.arrayBuffer();
  const fileNameEncoded = new TextEncoder().encode(file.name.padEnd(200, " "));
  const fileTypeEncoded = new TextEncoder().encode(file.type.padEnd(100, " "));
  const combinedBuffer = new Uint8Array(fileNameEncoded.length + fileTypeEncoded.length + fileBuffer.byteLength);
  combinedBuffer.set(fileNameEncoded, 0);
  combinedBuffer.set(fileTypeEncoded, fileNameEncoded.length);
  combinedBuffer.set(new Uint8Array(fileBuffer), fileNameEncoded.length + fileTypeEncoded.length);
  const encryptedData = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    encryptionKey,
    combinedBuffer
  );
  return new Blob([salt, iv, encryptedData], { type: "application/octet-stream" });
}

// src/blink.ts
var Blink = class {
  apiKey;
  baseUrl;
  constructor({ apiKey, baseUrl }) {
    if (!(apiKey == null ? void 0 : apiKey.startsWith("blink_public_"))) {
      throw new Error("Invalid Blink public key");
    }
    this.apiKey = apiKey;
    this.baseUrl = baseUrl ?? "https://blinkshare.vercel.app/api";
  }
  async createLink(options) {
    const { fileUrl, expiresIn = "10m", maxClicks = 1 } = options;
    const environment = detectEnvironment();
    const res = await fetch(`${this.baseUrl}/links/createLink`, {
      method: "POST",
      headers: {
        "x-blink-key": this.apiKey,
        "x-blink-env": environment,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ fileUrl, expiresIn, maxClicks })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
  /**
  * Encrypts the provided file with a user-supplied secret key (AES-GCM)
  * and uploads the ciphertext to BlinkShare's API.
  */
  async createEncryptedLink(options) {
    const { file, expiresIn = "10m", maxClicks = 1, secretKey } = options;
    const environment = detectEnvironment();
    const encryptedFile = await encryptFile(file, secretKey);
    const formData = new FormData();
    formData.append("file", encryptedFile, "encrypted.bin");
    formData.append("expiresIn", expiresIn);
    formData.append("maxClicks", maxClicks.toString());
    const res = await fetch(`${this.baseUrl}/links/createEncryptedLink`, {
      method: "POST",
      headers: {
        "x-blink-key": this.apiKey,
        "x-blink-env": environment
      },
      body: formData
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return {
      url: data.url,
      expiresIn,
      maxClicks,
      info: "\u{1F510} Remember: share your secret key securely with the recipient."
    };
  }
};
export {
  Blink
};
