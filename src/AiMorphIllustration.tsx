import { useEffect, useRef, useState } from 'react'

type LottieAnimation = {
  goToAndPlay: (frame: number, isFrame: boolean) => void
  destroy: () => void
  addEventListener: (name: string, listener: () => void) => void
}
type LottiePlayer = {
  loadAnimation: (options: {
    container: HTMLElement
    renderer: 'svg'
    loop: boolean
    autoplay: boolean
    path: string
    rendererSettings: { preserveAspectRatio: string; progressiveLoad: boolean }
  }) => LottieAnimation
}
type LottieWindow = Window & { lottie?: LottiePlayer }

let loadPromise: Promise<LottiePlayer> | undefined

function loadPlayer(): Promise<LottiePlayer> {
  const existing = (window as LottieWindow).lottie
  if (existing) return Promise.resolve(existing)
  if (loadPromise) return loadPromise
  loadPromise = new Promise<LottiePlayer>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = '/vendor/lottie_light.min.js'
    script.async = true
    script.onload = () => {
      const player = (window as LottieWindow).lottie
      if (player) resolve(player)
      else reject(new Error('Lottie SVG renderer unavailable'))
    }
    script.onerror = () => reject(new Error('Local Lottie player failed to load'))
    document.head.appendChild(script)
  }).catch((error: unknown) => {
    loadPromise = undefined
    throw error
  })
  return loadPromise
}

/**
 * A transparent, decorative Lottie drawing integrated into the hero.
 * Its inline SVG is always available if the player, animation or motion is unavailable.
 */
export default function AiMorphIllustration() {
  const mountRef = useRef<HTMLDivElement>(null)
  const [hasRenderedFrame, setHasRenderedFrame] = useState(false)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount || !window.matchMedia || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let cancelled = false
    let rendered = false
    let animation: LottieAnimation | undefined

    void loadPlayer().then((lottie) => {
      if (cancelled || !mount.isConnected) return

      animation = lottie.loadAnimation({
        container: mount,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        // Version bump ensures a stale cached animation is not served after deployment.
        path: '/motion/ai-spark-to-decision.json?v=transparent-2',
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid meet',
          progressiveLoad: false,
        },
      })

      animation.addEventListener('enterFrame', () => {
        if (cancelled || rendered) return
        // Don't hide the fallback until the SVG renderer actually produced a drawn path.
        const drawablePath = Array.from(mount.querySelectorAll('svg path')).some((node) =>
          (node.getAttribute('d')?.length ?? 0) > 30
        )
        if (drawablePath) {
          rendered = true
          setHasRenderedFrame(true)
        }
      })
      animation.addEventListener('DOMLoaded', () => {
        if (cancelled) return
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        // The illustration is in the first viewport; play immediately instead of relying
        // on an intersection observer that might miss the event.
        animation?.goToAndPlay(0, true)
      })
      animation.addEventListener('data_failed', () => {
        if (!cancelled) setHasRenderedFrame(false)
      })
    }).catch(() => {
      // Keep the inline SVG; the site must not show an empty animation slot.
    })

    return () => {
      cancelled = true
      animation?.destroy()
    }
  }, [])

  return <figure className="hero-morph" role="img" aria-label="An AI idea transforms into a speech bubble with a checkmark, representing human judgment">
    <div className={'hero-morph-stage' + (hasRenderedFrame ? ' has-rendered-frame' : '')}>
      <svg className="hero-morph-fallback" viewBox="0 0 300 200" aria-hidden="true" focusable="false">
        <g transform="translate(-40 -25)">
          <path d="M172 64 L203 64 L232 70 Q256 81 256 110 L255 136 Q253 152 242 152 L251 178 L221 162 L168 165 Q126 165 126 120 Q126 75 172 64Z" fill="#dcebd9" stroke="#2c5744" strokeWidth="4.5" strokeLinejoin="round" />
          <path d="M165 119 L180 135 L212 100" fill="none" stroke="#2c5744" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M156 149 L199 149" stroke="#65916a" strokeWidth="4" strokeLinecap="round" />
          <circle cx="239" cy="84" r="5.5" fill="#b5cc98" />
        </g>
      </svg>
      <div className="hero-morph-player" ref={mountRef} aria-hidden="true" />
    </div>
  </figure>
}
