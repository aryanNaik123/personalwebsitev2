// Synthesized sounds for the Go board: a wooden click plus a soft mallet note
// per stone. Pitch follows the point played on a pentatonic scale, so any
// sequence of moves stays consonant. No audio files needed.
//
// Tuned to stay out of the way: quiet, low-passed, soft attacks, a narrow
// pitch range, slight per-note variation, and callers fade out unattended play.

const PENTATONIC = [0, 2, 4, 7, 9]; // major pentatonic, in semitones
const ROOT_MIDI = 48; // C3
const SCALE_STEPS = 10; // two octaves, so nothing gets shrill
const MASTER_VOLUME = 0.12;
const LOWPASS_HZ = 2400; // takes the edge off clicks and upper partials
const MUTE_KEY = "go-sound-muted";

let ctx = null;
let master = null;
let noise = null;

const midiToHz = (m) => 440 * Math.pow(2, (m - 69) / 12);

function audio() {
  if (ctx) return ctx;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  ctx = new AudioContext();

  const compressor = ctx.createDynamicsCompressor();
  compressor.connect(ctx.destination);
  const lowpass = ctx.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = LOWPASS_HZ;
  lowpass.connect(compressor);
  master = ctx.createGain();
  master.gain.value = MASTER_VOLUME;
  master.connect(lowpass);

  // 50ms of white noise, reused for every click.
  noise = ctx.createBuffer(
    1,
    Math.floor(ctx.sampleRate * 0.05),
    ctx.sampleRate,
  );
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

  return ctx;
}

/** Create or wake the audio context; call from a click so browsers allow it. */
export function unlockSound() {
  const ac = audio();
  if (ac && ac.state === "suspended") ac.resume();
}

export function loadMuted() {
  try {
    return window.localStorage.getItem(MUTE_KEY) === "1";
  } catch (e) {
    return false;
  }
}

export function saveMuted(muted) {
  try {
    window.localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
  } catch (e) {
    // Storage can be unavailable (private mode); muting just won't persist.
  }
}

function ready() {
  return ctx && ctx.state === "running" && !document.hidden;
}

/** Small random spread so repeated sounds don't feel machine-gunned. */
const humanize = (amount) => 1 + (Math.random() * 2 - 1) * amount;

/** Short filtered noise burst: the stone hitting the board. */
function click(when, brightness = 1, level = 1) {
  const src = ctx.createBufferSource();
  src.buffer = noise;
  const band = ctx.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 1800 * brightness;
  band.Q.value = 1.2;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.2 * level, when);
  gain.gain.exponentialRampToValueAtTime(0.001, when + 0.04);
  src.connect(band).connect(gain).connect(master);
  src.start(when);
}

/** A mallet-ish tone: sine fundamental plus a quickly fading upper partial. */
function note(midi, when, { length = 0.9, volume = 0.6 } = {}) {
  const hz = midiToHz(midi);
  const out = ctx.createGain();
  out.gain.setValueAtTime(0.0001, when);
  out.gain.exponentialRampToValueAtTime(volume, when + 0.012);
  out.gain.exponentialRampToValueAtTime(0.0001, when + length);
  out.connect(master);

  const body = ctx.createOscillator();
  body.type = "sine";
  body.frequency.value = hz;
  body.connect(out);

  const strike = ctx.createOscillator();
  const strikeGain = ctx.createGain();
  strike.type = "sine";
  strike.frequency.value = hz * 4;
  strikeGain.gain.setValueAtTime(0.12, when);
  strikeGain.gain.exponentialRampToValueAtTime(0.001, when + 0.12);
  strike.connect(strikeGain).connect(out);

  for (const osc of [body, strike]) {
    osc.start(when);
    osc.stop(when + length + 0.05);
  }
}

/** MIDI note for the nth step of the scale (negative steps go below the root). */
function scaleNote(step, color) {
  const octave = Math.floor(step / PENTATONIC.length);
  const degree = step - octave * PENTATONIC.length;
  const base = ROOT_MIDI + (color === 2 ? 12 : 0); // white sits an octave up
  return base + octave * 12 + PENTATONIC[degree];
}

/** Scale step for a point: climbs from the bottom-left corner to the top-right. */
function stepFor(size, point) {
  const x = point % size;
  const y = size - 1 - Math.floor(point / size);
  return Math.round(((x + y) / (2 * (size - 1))) * (SCALE_STEPS - 1));
}

/**
 * Play the sound for one move.
 * @param {{ size: number, point: number, color: number, captured: number }} move
 * @param {number} level 0–1 loudness, so callers can soften or fade out play
 */
export function playMove({ size, point, color, captured }, level = 1) {
  if (!ready() || level <= 0.01) return;
  const now = ctx.currentTime + 0.01 + Math.random() * 0.015;

  if (point < 0) {
    note(ROOT_MIDI - 12, now, { length: 0.5, volume: 0.2 * level }); // pass
    return;
  }

  const step = stepFor(size, point);
  click(now, color === 2 ? 1.2 : 1, level * humanize(0.2));
  note(scaleNote(step, color), now, { volume: 0.5 * level * humanize(0.15) });

  // Captures tumble down the scale, one note per stone (up to four).
  for (let i = 1; i <= Math.min(captured, 4); i++) {
    note(scaleNote(step + 4 - i, color), now + 0.1 * i, {
      length: 0.4,
      volume: 0.22 * level,
    });
  }
}

/** A gentle chord when a game ends. */
export function playGameOver(blackWon, level = 1) {
  if (!ready() || level <= 0.01) return;
  const now = ctx.currentTime + 0.05;
  const chord = blackWon ? [0, 4, 7, 12] : [0, 7, 9, 14];
  chord.forEach((offset, i) =>
    note(ROOT_MIDI + 12 + offset, now + i * 0.07, {
      length: 1.8,
      volume: 0.25 * level,
    }),
  );
}
