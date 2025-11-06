var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Blink: () => Blink
});
module.exports = __toCommonJS(index_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Blink
});
