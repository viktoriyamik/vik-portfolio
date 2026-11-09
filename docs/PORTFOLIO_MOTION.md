# Motion design for vik.ooo

The homepage uses short, purposeful CSS transitions and a small IntersectionObserver effect. The portfolio stays visually lightweight and does not add Lottie, videos, or animation-player dependencies.

- **Hero:** once-only staggered entrance for the specialties label, name, introduction, and portrait.
- **Featured cases:** once-only fade for cards entering the viewport. Cards already visible at initialization are never hidden.
- **Micro-interactions:** subtle image and arrow movement on hover or keyboard focus.
- **Accessibility:** visitors using `prefers-reduced-motion: reduce` see content immediately, with motion and smooth scrolling disabled. If JavaScript or IntersectionObserver is unavailable, the cards remain visible. No infinite or attention-demanding loops.
- **Performance:** opacity and transform animations; no animation scripts, external requests, WebGL, or additional npm dependencies in the homepage motion layer.

Lottie can be introduced later for one custom, purposeful vector illustration, preferably a locally hosted `.lottie` asset with a still poster and an explicit play/pause control for any persistent animation. Avoid autoplay loops and generic stock animation.

Deployment from the site checkout:

```bash
cd /home/lihvool/viki
git status --short
git pull --ff-only origin main
npm run build
```

No PM2 restart or AI backend change is required for this frontend-only addition.
