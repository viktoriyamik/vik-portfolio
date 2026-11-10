import { brotliDecompressSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

// Exact Concept 03 Lottie JSON supplied for the portfolio, compressed losslessly.
// Materialized at build time to keep the source changes limited to the hero animation.
const originalBrotliBase64 = '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'
const original = JSON.parse(brotliDecompressSync(Buffer.from(originalBrotliBase64, 'base64')).toString('utf8'))
const forwardEnd = original.op // 156 frames at 30 fps
const reverseStart = 177     // hold the completed product for 0.7s
const reverseScale = 0.58   // rewind at a more deliberate speed
const loopEnd = 290         // 9.67 sec including a short pause on the initial sketch
const easingIn = { x: [0.82], y: [1] }
const easingOut = { x: [0.18], y: [0] }
const clone = value => structuredClone(value)

// Every animated path and opacity property is extended with its reversed
// keyframes. The first and last drawings are identical: no hard cut on loop.
function mirrorKeyframes(property) {
  if (!property || property.a !== 1 || !Array.isArray(property.k)) return
  const forward = property.k.map(frame => ({ time: frame.t, value: clone(frame.s ?? frame.e) }))
  if (forward.length < 2 || forward.some(frame => frame.value === undefined)) return
  const last = forward.at(-1).value
  const first = forward[0].value
  const frames = [
    ...forward,
    { time: reverseStart, value: clone(last) },
    ...forward.toReversed().map(frame => ({
      time: Math.round((reverseStart + (forwardEnd - frame.time) * reverseScale) * 100) / 100,
      value: clone(frame.value),
    })),
    { time: loopEnd - 1, value: clone(first) },
  ]
  frames.sort((a, b) => a.time - b.time)
  const sorted = frames.filter((frame, index) => index === 0 || frame.time > frames[index - 1].time)
  property.k = sorted.map((frame, index) => {
    const next = sorted[index + 1]
    if (!next) return { t: frame.time, s: frame.value, h: 1 }
    return {
      t: frame.time,
      s: frame.value,
      e: next.value,
      i: easingIn,
      o: easingOut,
    }
  })
}
function visit(value) {
  if (Array.isArray(value)) { for (const item of value) visit(item); return }
  if (!value || typeof value !== 'object') return
  if (value.a === 1 && Array.isArray(value.k)) { mirrorKeyframes(value); return }
  for (const nested of Object.values(value)) visit(nested)
}
visit(original.layers)
original.op = loopEnd
original.layers.forEach(layer => { layer.op = loopEnd })
original.w = 330
original.h = 240
original.layers[0].ks.p.k = [-155, -40, 0]
original.nm = 'Concept 03: From Problem to Product - seamless vector loop - Viktoriya Lihvoinen'
const target = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public/motion/problem-to-product-loop.json')
mkdirSync(path.dirname(target), { recursive: true })
writeFileSync(target, JSON.stringify(original))
console.log('Generated original Concept 03 Lottie with smooth reversible loop (' + loopEnd + ' frames).')
