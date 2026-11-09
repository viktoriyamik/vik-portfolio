# Morphing illustration: AI idea to human decision

This is a genuine, original **Lottie JSON vector animation**, not a static screenshot, video, image sprite or GIF.

- Asset: `public/motion/ai-spark-to-decision.json`.
- Animation: a single 16-vertex shape progressively **morphs** from a multi-point AI spark into a rounded conversation bubble, then a human-decision checkmark draws on. Other small vector strokes fade into place.
- Duration: 181 frames at 50 fps (3.62 seconds). Plays once when the illustration enters the viewport; replay is optional, never an autoplay loop.
- Renderer: the official lottie-web lightweight SVG player, installed locally at `public/vendor/lottie_light.min.js`, with its MIT license retained at `public/vendor/LOTTIE_LICENSE.md`.
- React: `src/AiMorphIllustration.tsx` loads the player and JSON lazily, only on the homepage. No extra npm package or external CDN.
- Accessibility: includes an inline SVG of the finished state as a fallback; if the user prefers reduced motion, it is displayed immediately and animation playback does not load. The replay button is hidden for reduced-motion preference. The animation is decorative, with an accessible illustration description.
- Visual style: muted sage, cream and dark-green, consistent with the existing vik.ooo identity. The existing portrait and main copy remain unchanged.

Deploy:

```bash
cd /home/lihvool/viki
git pull --ff-only origin main
npm run build
```

No AI server restart. To test the player, visit the homepage with reduced motion off, hard refresh and watch the spark become a bubble with a checkmark. Check replay, mobile sizing and reduced-motion mode.

```bash
curl -I https://vik.ooo/motion/ai-spark-to-decision.json
curl -I https://vik.ooo/vendor/lottie_light.min.js
```
