import { useEffect, useRef, useState } from 'react'

type LottieAnimation = {
  play: () => void
  pause: () => void
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
 * Concept 03 — the original hand-drawn problem morphs into a wireframe,
 * then a functioning UI. The animation plays forward and backward in a
 * seamless vector loop; all other homepage content is unchanged.
 */
export default function AiMorphIllustration() {
  const mountRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<LottieAnimation | null>(null)
  const [hasRenderedFrame, setHasRenderedFrame] = useState(false)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount || !window.matchMedia || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let cancelled = false
    let rendered = false
    let isVisible = true
    let animation: LottieAnimation | undefined
    let observer: IntersectionObserver | undefined

    void loadPlayer().then((lottie) => {
      if (cancelled || !mount.isConnected) return

      animation = lottie.loadAnimation({
        container: mount,
        renderer: 'svg',
        loop: true,
        autoplay: false,
        path: '/motion/problem-to-product-loop.json?v=concept03-1',
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid meet',
          progressiveLoad: false,
        },
      })
      animationRef.current = animation

      animation.addEventListener('enterFrame', () => {
        if (cancelled || rendered) return
        const hasPath = Array.from(mount.querySelectorAll('svg path')).some((node) =>
          (node.getAttribute('d')?.length ?? 0) > 30
        )
        if (hasPath) {
          rendered = true
          setHasRenderedFrame(true)
        }
      })

      animation.addEventListener('DOMLoaded', () => {
        if (cancelled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        animation?.goToAndPlay(0, true)
        if (typeof IntersectionObserver !== 'undefined') {
          observer = new IntersectionObserver((entries) => {
            isVisible = entries.some((entry) => entry.isIntersecting)
            if (isVisible && !document.hidden) animation?.play()
            else animation?.pause()
          }, { threshold: 0.05 })
          observer.observe(mount)
        }
      })
      animation.addEventListener('data_failed', () => {
        if (!cancelled) setHasRenderedFrame(false)
      })
    }).catch(() => {
      // An inline finished-interface SVG remains visible if playback fails.
    })

    const onVisibilityChange = () => {
      if (document.hidden) animationRef.current?.pause()
      else if (isVisible) animationRef.current?.play()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      cancelled = true
      observer?.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
      animationRef.current = null
      animation?.destroy()
    }
  }, [])

  return <figure className="hero-morph" aria-label="Original vector animation: research sketch turns into a UX wireframe, then a completed interactive digital product">
    <div className={'hero-morph-stage' + (hasRenderedFrame ? ' has-rendered-frame' : '')}>
      <svg className="hero-morph-fallback" viewBox="0 0 330 240" role="img" aria-label="Completed digital product interface" focusable="false">
        <g transform="translate(-155 -40)">
          <path d="M200 70 L218 61 L250 61 L355 61 L400 61 L418 69 L427 82 L427 124 L427 211 L421 229 L406 238 L355 238 L250 238 L204 238 L187 225 L187 94Z" fill="#f9fbf8" stroke="#214d39" strokeWidth="3.2" strokeLinejoin="round" />
          <rect x="205" y="82" width="205" height="18" rx="5" fill="#244f3a" />
          <circle cx="216" cy="91" r="2.4" fill="#cfdfca" />
          <circle cx="227" cy="91" r="2.4" fill="#a4c3a1" />
          <rect x="208" y="115" width="97" height="104" rx="9" fill="#d9e9d7" />
          <path d="M217 201 Q236 182 252 190 Q271 154 292 177" fill="none" stroke="#86aa86" strokeWidth="8" strokeLinecap="round" />
          <path d="M317 133 H399" stroke="#294f3b" strokeWidth="7" strokeLinecap="round" />
          <path d="M317 153 H395 M317 165 H370" stroke="#8baba0" strokeWidth="4" strokeLinecap="round" />
          <rect x="315" y="181" width="97" height="32" rx="7" fill="#2b5b40" />
          <path d="M348 198 L354 204 L365 192" stroke="white" strokeWidth="4" strokeLinecap="round" fill="none" />
        </g>
      </svg>
      <div className="hero-morph-player" ref={mountRef} aria-hidden="true"/>
    </div>
  </figure>
}
