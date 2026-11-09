import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const jsonFile = path.join(root, "public/motion/ai-spark-to-decision.json");
const data = JSON.parse(fs.readFileSync(jsonFile, "utf8"));

test("authored Lottie document has proper animation metadata", () => {
  assert.match(data.v, /^\d+\.\d+/);
  assert.equal(data.fr, 50);
  assert.ok(data.op > 100 && data.op < 250);
  assert.ok(data.w > 0 && data.h > 0);
  assert.equal(data.layers.length, 1);
});

test("one single path actually morphs from a star to a speech bubble", () => {
  const group = data.layers[0].shapes.find((item) => item.nm.includes("Actual vector path morph"));
  assert.ok(group);
  const contour = group.it.find((item) => item.ty === "sh");
  assert.equal(contour.ks.a, 1, "Shape path must be keyframed, not a static icon swap");
  const poses = contour.ks.k;
  const initial = poses[0].s[0];
  const final = poses.at(-1).s[0];
  assert.equal(initial.v.length, 16);
  assert.equal(final.v.length, 16);
  assert.notDeepEqual(initial.v, final.v);
  assert.equal(initial.c, true);
  assert.equal(final.c, true);
});

test("decision checkmark is revealed after the shape morph, not before", () => {
  const group = data.layers[0].shapes.find((item) => item.nm === "Decision checkmark");
  assert.ok(group);
  const trim = group.it.find((item) => item.ty === "tm");
  assert.ok(trim);
  assert.equal(trim.e.a, 1);
  assert.ok(trim.e.k.some((frame) => frame.t > 100 && frame.s[0] === 100));
});

test("the locally licensed player and accessible fallback are present", () => {
  for (const p of ["public/vendor/lottie_light.min.js", "public/vendor/LOTTIE_LICENSE.md"]) {
    assert.ok(fs.existsSync(path.join(root, p)), p);
  }
  const component = fs.readFileSync(path.join(root, "src/AiMorphIllustration.tsx"), "utf8");
  assert.match(component, /lottie\.loadAnimation/);
  assert.match(component, /hero-morph-fallback/);
  assert.match(component, /prefers-reduced-motion/);
  assert.match(component, /loop:\s*false/);
});
