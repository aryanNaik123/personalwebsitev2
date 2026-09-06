const DB_NAME = "gb-yellow";
const STORE = "files";
const ROM_KEY = "rom";
const RAM_KEY = "extram";

const ROM_URLS = [
  "/roms/pokeyellow.gbc",
  "/roms/pokeyellow.gb",
  "/roms/pokemon-yellow.gbc",
  "/roms/pokemon-yellow.gb",
  "/roms/yellow.gbc",
  "/roms/yellow.gb",
];

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function idbGet(key) {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, "readonly");
        const req = tx.objectStore(STORE).get(key);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      })
  );
}

function idbSet(key, value) {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, "readwrite");
        tx.objectStore(STORE).put(value, key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      })
  );
}

export function isGbRom(buffer) {
  if (!buffer || buffer.byteLength < 0x150) return false;
  const bytes = new Uint8Array(buffer);
  if (bytes[0] === 0x3c || bytes[0] === 0x7b) return false;
  return true;
}

async function fetchRom(url) {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const type = res.headers.get("content-type") || "";
    if (type.includes("text/html") || type.includes("application/json")) {
      return null;
    }
    const buf = await res.arrayBuffer();
    return isGbRom(buf) ? buf : null;
  } catch {
    return null;
  }
}

export async function loadStoredRom() {
  const stored = await idbGet(ROM_KEY);
  if (stored && isGbRom(stored)) return stored;
  for (const url of ROM_URLS) {
    const buf = await fetchRom(url);
    if (buf) {
      await idbSet(ROM_KEY, buf);
      return buf;
    }
  }
  return null;
}

export async function saveRom(buffer) {
  if (!isGbRom(buffer)) throw new Error("Invalid ROM");
  await idbSet(ROM_KEY, buffer);
}

let ramCache = null;

export async function loadBattery() {
  if (ramCache && ramCache.byteLength) return ramCache;
  const stored = await idbGet(RAM_KEY);
  if (stored && stored.byteLength) {
    ramCache = new Uint8Array(stored);
    return ramCache;
  }
  return null;
}

export async function saveBattery(bytes) {
  ramCache = bytes;
  await idbSet(RAM_KEY, bytes);
}
