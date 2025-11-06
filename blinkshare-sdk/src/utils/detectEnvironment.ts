export function detectEnvironment() {
  if (typeof process !== "undefined" && process.env.NODE_ENV === "development") {
    return "development";
  }

  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    return "development";
  }

  return "production";
}
