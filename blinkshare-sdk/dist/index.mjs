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
    const { fileUrl, expiersIn = "10m", maxClicks = 1 } = options;
    const environment = detectEnvironment();
    const res = await fetch(`${this.baseUrl}/links/createLink`, {
      method: "POST",
      headers: {
        "x-blink-key": this.apiKey,
        "x-blink-env": environment,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ fileUrl, expiersIn, maxClicks })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
};
export {
  Blink
};
