/**
 * Thin wrapper around binjgb (MIT, Ben Smith) for a 160×144 canvas.
 * https://github.com/binji/binjgb
 */

import { loadBattery, saveBattery } from "./rom";

const AUDIO_FRAMES = 4096;
const AUDIO_LATENCY_SEC = 0.1;
const CGB_COLOR_CURVE = 2;
const CPU_TICKS_PER_SECOND = 4194304;
const MAX_UPDATE_SEC = 5 / 60;
const EVENT_NEW_FRAME = 1;
const EVENT_AUDIO_BUFFER_FULL = 2;
const EVENT_UNTIL_TICKS = 4;

const JOYP = {
  up: "_set_joyp_up",
  down: "_set_joyp_down",
  left: "_set_joyp_left",
  right: "_set_joyp_right",
  a: "_set_joyp_A",
  b: "_set_joyp_B",
  start: "_set_joyp_start",
  select: "_set_joyp_select",
};

let binjgbPromise = null;
let setupChain = Promise.resolve();

function loadBinjgb() {
  if (binjgbPromise) return binjgbPromise;
  binjgbPromise = new Promise((resolve, reject) => {
    const boot = () => {
      const Binjgb = window.Binjgb;
      if (!Binjgb) {
        reject(new Error("Binjgb missing"));
        return;
      }
      Binjgb({ locateFile: (path) => `/gb/${path}` }).then(resolve, reject);
    };
    if (window.Binjgb) {
      boot();
      return;
    }
    const script = document.createElement("script");
    script.src = "/gb/binjgb.js";
    script.async = true;
    script.onload = boot;
    script.onerror = () => reject(new Error("Failed to load emulator"));
    document.head.appendChild(script);
  }).catch((err) => {
    binjgbPromise = null;
    throw err;
  });
  return binjgbPromise;
}

function wasmBytes(module, ptr, size) {
  const heap = module.HEAPU8 || module.HEAP8;
  return new Uint8Array(heap.buffer, ptr, size);
}

function withFileData(module, fileDataPtr, cb) {
  const buffer = wasmBytes(
    module,
    module._get_file_data_ptr(fileDataPtr),
    module._get_file_data_size(fileDataPtr)
  );
  const result = cb(fileDataPtr, buffer);
  module._file_data_delete(fileDataPtr);
  return result;
}

export function createEmulator(canvas, romBuffer, options = {}) {
  const work = setupChain.then(() => setupEmulator(canvas, romBuffer, options));
  setupChain = work.catch(() => {});
  return work;
}

async function setupEmulator(canvas, romBuffer, options = {}) {
  const extRam = options.extRam || (await loadBattery());
  const module = await loadBinjgb();
  const AC = window.AudioContext || window.webkitAudioContext;
  const audioCtx = new AC();

  const size = (romBuffer.byteLength + 0x7fff) & ~0x7fff;
  const romPtr = module._malloc(size);
  wasmBytes(module, romPtr, size)
    .fill(0)
    .set(new Uint8Array(romBuffer));

  const e = module._emulator_new_simple(
    romPtr,
    size,
    audioCtx.sampleRate,
    AUDIO_FRAMES,
    CGB_COLOR_CURVE
  );
  if (!e) {
    module._free(romPtr);
    audioCtx.close();
    throw new Error("Invalid ROM");
  }

  const joypadPtr = module._joypad_new();
  module._emulator_set_default_joypad_callback(e, joypadPtr);

  if (extRam && extRam.byteLength) {
    withFileData(module, module._ext_ram_file_data_new(e), (ptr, buffer) => {
      if (buffer.byteLength === extRam.byteLength) {
        buffer.set(extRam);
        module._emulator_read_ext_ram(e, ptr);
      }
    });
  }

  const ctx = canvas.getContext("2d", { alpha: false });
  ctx.imageSmoothingEnabled = false;
  canvas.width = 160;
  canvas.height = 144;
  const imageData = ctx.createImageData(160, 144);

  let muted = !!options.muted;
  let alive = true;
  let started = false;
  let raf = 0;
  let interval = 0;
  let busy = false;
  let lastMs = 0;
  let lastRafSec = 0;
  let leftoverTicks = 0;
  let audioStartSec = 0;
  let audioStarted = false;
  let batteryDirty = false;
  const volume = 0.5;

  function ticks() {
    return module._emulator_get_ticks_f64(e);
  }

  function getExtRam() {
    return withFileData(module, module._ext_ram_file_data_new(e), (ptr, buffer) => {
      module._emulator_write_ext_ram(e, ptr);
      return new Uint8Array(buffer);
    });
  }

  function flushBattery() {
    if (!batteryDirty) return;
    batteryDirty = false;
    saveBattery(getExtRam()).catch(() => {});
  }

  function uploadFrame() {
    const frameBuf = wasmBytes(
      module,
      module._get_frame_buffer_ptr(e),
      module._get_frame_buffer_size(e)
    );
    imageData.data.set(frameBuf);
    for (let i = 3; i < imageData.data.length; i += 4) {
      imageData.data[i] = 255;
    }
  }

  function pushAudio() {
    if (!audioStarted || muted || audioCtx.state !== "running") return;
    const samples = wasmBytes(
      module,
      module._get_audio_buffer_ptr(e),
      module._get_audio_buffer_capacity(e)
    );
    const nowSec = audioCtx.currentTime;
    const nowPlusLatency = nowSec + AUDIO_LATENCY_SEC;
    audioStartSec = audioStartSec || nowPlusLatency;
    if (audioStartSec < nowSec) {
      audioStartSec = nowPlusLatency;
      return;
    }
    const buffer = audioCtx.createBuffer(2, AUDIO_FRAMES, audioCtx.sampleRate);
    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);
    for (let i = 0; i < AUDIO_FRAMES; i++) {
      left[i] = (samples[2 * i] * volume) / 255;
      right[i] = (samples[2 * i + 1] * volume) / 255;
    }
    const src = audioCtx.createBufferSource();
    src.buffer = buffer;
    src.connect(audioCtx.destination);
    src.start(audioStartSec);
    audioStartSec += AUDIO_FRAMES / audioCtx.sampleRate;
  }

  function runUntil(untilTicks) {
    while (alive) {
      const event = module._emulator_run_until_f64(e, untilTicks);
      if (event & EVENT_NEW_FRAME) uploadFrame();
      if (event & EVENT_AUDIO_BUFFER_FULL) pushAudio();
      if (event & EVENT_UNTIL_TICKS) break;
    }
    if (module._emulator_was_ext_ram_updated(e)) batteryDirty = true;
  }

  function pump(startMs) {
    if (!alive || busy) return;
    if (startMs - lastMs < 8) return;
    busy = true;
    lastMs = startMs;
    try {
      const startSec = startMs / 1000;
      if (!lastRafSec) lastRafSec = startSec - 1 / 60;
      const deltaSec = Math.max(startSec - lastRafSec, 0);
      const deltaTicks =
        Math.min(deltaSec, MAX_UPDATE_SEC) * CPU_TICKS_PER_SECOND;
      const runUntilTicks = ticks() + deltaTicks - leftoverTicks;
      runUntil(runUntilTicks);
      leftoverTicks = (ticks() - runUntilTicks) | 0;
      lastRafSec = startSec;
      ctx.putImageData(imageData, 0, 0);
    } catch (err) {
      console.error(err);
    } finally {
      busy = false;
    }
  }

  function onRaf(now) {
    if (!alive) return;
    pump(now);
    raf = requestAnimationFrame(onRaf);
  }

  function resumeAudio() {
    if (!alive) return;
    audioStarted = true;
    audioCtx.resume().catch(() => {});
  }

  const batteryTimer = setInterval(flushBattery, 1500);

  return {
    start() {
      if (!alive || started) return;
      started = true;
      lastRafSec = 0;
      lastMs = 0;
      raf = requestAnimationFrame(onRaf);
      interval = setInterval(() => pump(performance.now()), 16);
    },
    buttonDown(btn) {
      resumeAudio();
      const fn = JOYP[btn];
      if (fn) module[fn](e, 1);
    },
    buttonUp(btn) {
      const fn = JOYP[btn];
      if (fn) module[fn](e, 0);
    },
    kickAudio() {
      resumeAudio();
    },
    isMuted() {
      return muted;
    },
    toggleMute() {
      muted = !muted;
      if (muted) audioCtx.suspend().catch(() => {});
      else resumeAudio();
      return muted;
    },
    destroy() {
      if (!alive) return;
      alive = false;
      cancelAnimationFrame(raf);
      clearInterval(interval);
      clearInterval(batteryTimer);
      flushBattery();
      try {
        module._joypad_delete(joypadPtr);
        module._emulator_delete(e);
        module._free(romPtr);
      } catch {
        /* wasm already torn down */
      }
      audioCtx.close().catch(() => {});
    },
  };
}

