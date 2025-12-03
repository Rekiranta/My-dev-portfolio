export type Device = {
  id: string;
  name: string;
  seed: number;
  offsetC: number;
  fault: number; // 0..1
  createdAt: string;
};

export type Reading = {
  ts: string;
  temperatureC: number;
  humidityPct: number;
  windMS: number;
  rainMMH: number;
  faultInjected: boolean;
};

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

// Deterministic PRNG (good enough for tests)
function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function jitter(rng: () => number, magnitude: number) {
  return (rng() * 2 - 1) * magnitude;
}

export function readingAt(device: Device, epochSec: number): Reading {
  const rng = mulberry32((device.seed ^ epochSec) >>> 0);

  // Baselines that look "sensor-ish"
  const baseTemp = 18 + 6 * Math.sin(epochSec / 300);
  const baseHum = 55 + 15 * Math.sin(epochSec / 420);
  const baseWind = 3 + 2 * Math.sin(epochSec / 180);
  const baseRain = Math.max(0, 2 * Math.sin(epochSec / 900));

  let temperatureC = baseTemp + device.offsetC + jitter(rng, 0.35);
  let humidityPct = baseHum + jitter(rng, 2.0);
  let windMS = baseWind + jitter(rng, 0.35);
  let rainMMH = baseRain + jitter(rng, 0.25);

  temperatureC = clamp(temperatureC, -40, 60);
  humidityPct = clamp(humidityPct, 0, 100);
  windMS = clamp(windMS, 0, 60);
  rainMMH = clamp(rainMMH, 0, 50);

  // Fault injection: sometimes create a spike
  const faultInjected = device.fault > 0 && rng() < device.fault * 0.15;
  if (faultInjected) {
    temperatureC = clamp(temperatureC + 15 + rng() * 10, -40, 60);
    humidityPct = clamp(humidityPct - (20 + rng() * 20), 0, 100);
  }

  return {
    ts: new Date(epochSec * 1000).toISOString(),
    temperatureC: Math.round(temperatureC * 100) / 100,
    humidityPct: Math.round(humidityPct * 100) / 100,
    windMS: Math.round(windMS * 100) / 100,
    rainMMH: Math.round(rainMMH * 100) / 100,
    faultInjected
  };
}