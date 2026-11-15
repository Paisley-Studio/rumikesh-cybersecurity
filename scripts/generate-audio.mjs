// Procedurally synthesises the soundtrack (drone, pulse, whooshes, riser,
// impacts, typing ticks) and writes public/soundtrack.wav.
// Timings are in seconds and match the 30fps timeline in src/Main.tsx.
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SR = 44100;
const DUR = 32;
const N = SR * DUR;
const L = new Float32Array(N);
const R = new Float32Array(N);
const wetL = new Float32Array(N);
const wetR = new Float32Array(N);

let seed = 1337;
const rnd = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};
const noise = () => rnd() * 2 - 1;
const idx = (t) => Math.floor(t * SR);
const add = (i, l, r, wet = 0) => {
  if (i < 0 || i >= N) return;
  L[i] += l;
  R[i] += r;
  wetL[i] += l * wet;
  wetR[i] += r * wet;
};

/** Chamberlin state-variable filter (returns band-pass & low-pass). */
const svf = () => {
  let low = 0;
  let band = 0;
  return (x, fc, q = 0.6) => {
    const f = 2 * Math.sin((Math.PI * Math.min(fc, SR / 6)) / SR);
    low += f * band;
    const high = x - low - q * band;
    band += f * high;
    return { low, band, high };
  };
};

// ---------------------------------------------------------------- drone pad
{
  const lp = [svf(), svf()];
  const freqs = [55, 55.4, 82.41, 110.3, 164.8];
  const ph = freqs.map(() => rnd());
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    let s = 0;
    for (let k = 0; k < freqs.length; k++) {
      ph[k] = (ph[k] + freqs[k] / SR) % 1;
      s += (ph[k] * 2 - 1) * (k < 2 ? 0.5 : 0.3);
    }
    const open = 250 + 900 * Math.max(0, Math.min(1, (t - 6) / 8)) + 400 * Math.sin(t * 0.7);
    const env = Math.min(1, t / 1.5) * Math.min(1, (DUR - t) / 2.5) * (t > 26.3 && t < 27.6 ? 0.35 : 1);
    const l = lp[0](s, open, 0.9).low;
    const r = lp[1](s * 0.98, open * 1.05, 0.9).low;
    add(i, l * 0.09 * env, r * 0.09 * env, 0.3);
  }
}

// ---------------------------------------------------------------- final chord swell
{
  const notes = [110, 130.81, 164.81, 246.94, 329.63];
  for (let i = idx(27.9); i < N; i++) {
    const t = i / SR - 27.9;
    const env = Math.min(1, t / 1.2) * Math.min(1, (DUR - 27.9 - t) / 1.5);
    let s = 0;
    notes.forEach((f, k) => {
      s += Math.sin(2 * Math.PI * f * t + Math.sin(2 * Math.PI * 0.3 * t + k) * 0.6) * (0.6 / (k + 1));
    });
    add(i, s * 0.08 * env, s * 0.08 * env, 0.6);
  }
}

// ---------------------------------------------------------------- kick pulse + hats
const kick = (t0, gain) => {
  let ph = 0;
  for (let i = idx(t0); i < idx(t0 + 0.45); i++) {
    const t = i / SR - t0;
    const f = 42 + 90 * Math.exp(-t * 40);
    ph += (2 * Math.PI * f) / SR;
    const s = Math.sin(ph) * Math.exp(-t * 7) * gain;
    add(i, s, s, 0.05);
  }
};
const hat = (t0, gain) => {
  const f = svf();
  for (let i = idx(t0); i < idx(t0 + 0.05); i++) {
    const t = i / SR - t0;
    const s = f(noise(), 9000, 0.4).high * Math.exp(-t * 90) * gain;
    add(i, s * 0.8, s, 0.1);
  }
};
for (let t = 6.33; t < 26.2; t += 0.5) kick(t, t > 13.3 ? 0.42 : 0.3);
for (let t = 13.55; t < 26.2; t += 0.5) hat(t, 0.12);
for (let t = 0.0; t < 6.0; t += 1.0) kick(t + 0.03, 0.18); // heartbeat in the room

// ---------------------------------------------------------------- whooshes
const whoosh = (t0, dur, gain, dir = 1) => {
  const f = [svf(), svf()];
  for (let i = idx(t0); i < idx(t0 + dur); i++) {
    const u = (i / SR - t0) / dur;
    const env = Math.sin(Math.PI * u) ** 2;
    const fc = 300 + 3500 * Math.sin(Math.PI * u) ** 1.5;
    const n = noise();
    const pan = 0.5 + 0.5 * dir * (u * 2 - 1);
    const sl = f[0](n, fc, 0.5).band;
    const sr = f[1](n, fc * 1.07, 0.5).band;
    add(i, sl * env * gain * (1 - pan) * 2, sr * env * gain * pan * 2, 0.4);
  }
};
[
  [1.85, 0.5, 0.35, 1],
  [3.35, 0.6, 0.35, -1],
  [4.7, 0.9, 0.55, 1],
  [6.05, 0.7, 0.4, -1],
  [13.35, 0.8, 0.45, 1],
  [16.35, 0.6, 0.4, -1],
  [18.45, 0.6, 0.4, 1],
  [20.9, 0.6, 0.4, -1],
  [23.2, 0.6, 0.35, 1],
  [25.7, 1.0, 0.6, -1],
].forEach(([t, d, g, dir]) => whoosh(t, d, g, dir));

// ---------------------------------------------------------------- riser into flash
{
  const f = svf();
  let ph = 0;
  const t0 = 7.6;
  const t1 = 11.0;
  for (let i = idx(t0); i < idx(t1); i++) {
    const u = (i / SR - t0) / (t1 - t0);
    const fc = 200 + 7000 * u * u;
    ph += (2 * Math.PI * (180 + 700 * u * u)) / SR;
    const s = (f(noise(), fc, 0.3).band * 0.6 + Math.sin(ph) * 0.25) * u ** 2.2 * 0.5;
    add(i, s, s, 0.5);
  }
}

// ---------------------------------------------------------------- impacts
const impact = (t0, gain) => {
  let ph = 0;
  const f = svf();
  for (let i = idx(t0); i < idx(t0 + 2.5); i++) {
    const t = i / SR - t0;
    ph += (2 * Math.PI * (28 + 70 * Math.exp(-t * 6))) / SR;
    const sub = Math.sin(ph) * Math.exp(-t * 1.6);
    const crack = f(noise(), 1800 * Math.exp(-t * 3) + 120, 0.7).low * Math.exp(-t * 5);
    const s = (sub * 0.9 + crack * 0.8) * gain;
    add(i, s, s, 0.6);
  }
};
impact(11.0, 0.8);
impact(28.05, 0.9);

// ---------------------------------------------------------------- shimmer on logo
{
  const t0 = 28.05;
  const fr = [1760, 2637, 3520, 4186];
  for (let i = idx(t0); i < idx(t0 + 3.5); i++) {
    const t = i / SR - t0;
    let s = 0;
    fr.forEach((f, k) => (s += Math.sin(2 * Math.PI * f * t + k) * Math.exp(-t * (1 + k * 0.4))));
    s *= 0.035 * (0.7 + 0.3 * Math.sin(t * 30));
    add(i, s, s * 0.9, 0.8);
  }
}

// ---------------------------------------------------------------- glitch blips (hacker room)
for (let k = 0; k < 14; k++) {
  const t0 = 0.3 + rnd() * 5.4;
  const f = 300 + rnd() * 1800;
  const d = 0.03 + rnd() * 0.07;
  const pan = rnd();
  for (let i = idx(t0); i < idx(t0 + d); i++) {
    const t = i / SR - t0;
    const s = (Math.sin(2 * Math.PI * f * t) > 0 ? 1 : -1) * 0.035 * (1 - t / d);
    add(i, s * (1 - pan), s * pan, 0.2);
  }
}

// ---------------------------------------------------------------- typing ticks + chime
{
  const tagStart = (792 + 112) / 30;
  const count = 26;
  for (let k = 0; k < count; k++) {
    const t0 = tagStart + (k * 1.3) / 30 + (rnd() - 0.5) * 0.01;
    const f = svf();
    for (let i = idx(t0); i < idx(t0 + 0.03); i++) {
      const t = i / SR - t0;
      const s = (f(noise(), 4000, 0.5).band * 0.7 + Math.sin(2 * Math.PI * 2600 * t) * 0.3) * Math.exp(-t * 180) * 0.35;
      add(i, s, s, 0.15);
    }
  }
  const t0 = (792 + 142) / 30;
  for (let i = idx(t0); i < idx(t0 + 1.8); i++) {
    const t = i / SR - t0;
    const s = (Math.sin(2 * Math.PI * 880 * t) + Math.sin(2 * Math.PI * 1318.5 * t) * 0.6) * Math.exp(-t * 2.2) * 0.07;
    add(i, s, s, 0.7);
  }
}

// ---------------------------------------------------------------- reverb (Freeverb-lite)
const reverb = (inp, offset) => {
  const out = new Float32Array(N);
  const combs = [1116, 1188, 1277, 1356].map((d) => ({ buf: new Float32Array(d + offset), i: 0, store: 0 }));
  const aps = [556, 441].map((d) => ({ buf: new Float32Array(d + offset), i: 0 }));
  for (let n = 0; n < N; n++) {
    const x = inp[n] * 0.3;
    let s = 0;
    for (const c of combs) {
      const y = c.buf[c.i];
      c.store = y * 0.75 + c.store * 0.25;
      c.buf[c.i] = x + c.store * 0.86;
      c.i = (c.i + 1) % c.buf.length;
      s += y;
    }
    for (const a of aps) {
      const b = a.buf[a.i];
      const y = -s + b;
      a.buf[a.i] = s + b * 0.5;
      a.i = (a.i + 1) % a.buf.length;
      s = y;
    }
    out[n] = s;
  }
  return out;
};
const rl = reverb(wetL, 0);
const rr = reverb(wetR, 23);

// ---------------------------------------------------------------- master
let peak = 0;
for (let i = 0; i < N; i++) {
  L[i] = Math.tanh((L[i] + rl[i] * 0.5) * 1.2);
  R[i] = Math.tanh((R[i] + rr[i] * 0.5) * 1.2);
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
}
const norm = 0.89 / peak;
const buf = Buffer.alloc(44 + N * 4);
buf.write("RIFF", 0);
buf.writeUInt32LE(36 + N * 4, 4);
buf.write("WAVE", 8);
buf.write("fmt ", 12);
buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20);
buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 4, 28);
buf.writeUInt16LE(4, 32);
buf.writeUInt16LE(16, 34);
buf.write("data", 36);
buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * norm)) * 32767), 44 + i * 4);
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * norm)) * 32767), 46 + i * 4);
}
const out = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "soundtrack.wav");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, buf);
console.log(`Wrote ${out} (${(buf.length / 1e6).toFixed(1)} MB)`);
