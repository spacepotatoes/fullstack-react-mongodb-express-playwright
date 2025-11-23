// src/test/globalTeardown.js
export default async function globalTeardown() {
  if (global._MONGOINSTANCE) {                // ← diese Zeile fehlt bei dir
    await global._MONGOINSTANCE.stop()
  }
}