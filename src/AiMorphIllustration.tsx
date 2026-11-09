import { useEffect, useRef, useState } from 'react'

type LottieInstance = {
  play: () => void
  goToAndPlay: (frame: number, isFrame: boolean) => void
  goToAndStop: (frame: number, isFrame: boolean) => void
  destroy: () => void
  addEventListener: (name: string, listener: () => void) => void
}
type LottiePlayer = {
  loadAnimation: (opts: {
    container: HTMLElement
    renderer: 'svg'
    loop: boolean
    autoplay: boolean
    path: string
    rendererSettings: { preserveAspectRatio: string; progressiveLoad: boolean }
  }) => LottieInstance
}
type LottieWindow = Window & { lottie?: LottiePlayer }

let playerPromise: Promise<LottiePlayer> | undefined

function loadLocalPlayer(): Promise<LottiePlayer> {
  const existing = (window as LottieWindow).lottie
  if (existing) return Promise.resolve(existing)
  if (playerPromise) return playerPromise
  playerPromise = new Promise<LottiePlayer>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = '/vendor/lottie_light.min.js'
    script.async = true
    script.dataset.portfolioLottie = 'true'
    script.onload = () => {
      const player = (window as LottieWindow).lottie
      if (player) resolve(player)
      else reject(new Error('Lottie player did not initialize'))
    }
    script.onerror = () => reject(new Error('Unable to load the local Lottie player'))
    document.head.appendChild(script)
  }).catch((error: unknown) => {
    playerPromise = undefined
    throw error
  })
  return playerPromise
}

export default function AiMorphIllustration() {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<LottieInstance | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const element = containerRef.current
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let cancelled = false
    let observer: IntersectionObserver | undefined
    let playback: LottieInstance | undefined

    void loadLocalPlayer().then((lottie) => {
      if (cancelled || !element.isConnected) return
      playback = lottie.loadAnimation({
        container: element,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: '/motion/ai-spark-to-decision.json',
        rendererSettings: { preserveAspectRatio: 'xMidYMid meet', progressiveLoad: false },
      })
      animationRef.current = playback
      playback.addEventListener('DOMLoaded', () => {
        if (cancelled) return
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          playback?.goToAndStop(180, true)
          return
        }
        setReady(true)
        if (!('IntersectionObserver' in window)) {
          playback?.play()
          return
        }
        observer = new IntersectionObserver((entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            playback?.play()
            observer?.disconnect()
          }
        }, { threshold: 0.2 })
        observer.observe(element)
      })
      playback.addEventListener('data_failed', () => {
        if (!cancelled) setReady(false)
      })
    }).catch(() => {
      // The inline SVG remains visible if the player or animation cannot load.
    })

    return () => {
      cancelled = true
      observer?.disconnect()
      animationRef.current = null
      playback?.destroy()
    }
  }, [])

  return <div className="hero-morph" aria-label="Original animated illustration: an AI spark transforms into a speech bubble with a human-approved decision">
    <div className={'hero-morph-visual' + (ready ? ' is-ready' : '')}>
      <svg className="hero-morph-fallback" viewBox="0 0 380 260" role="img" aria-label="Human-approved choice emerging from an AI idea">
        <circle cx="190" cy="125" r="103" fill="#edf3eb"/>
        <path d="M172 64 L203 64 L232 70 Q256 81 256 110 L255 136 Q253 152 242 152 L251 178 L221 162 L168 165 Q126 165 126 120 Q126 75 172 64Z" fill="#dcebd9" stroke="#2c5744" strokeWidth="4.5" strokeLinejoin="round"/>
        <path d="M165 119 L180 135 L212 100" fill="none" stroke="#2c5744" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M156 149 L199 149" stroke="#65916a" strokeWidth="4" strokeLinecap="round"/>
      </svg>
      <div className="hero-morph-player" ref={containerRef} aria-hidden="true"/>
    </div>
    <div className="hero-morph-content">
      <span className="hero-morph-eyebrow">DESIGN IN MOTION</span>
      <strong>From possibility to choice.</strong>
      <span>AI explores. People decide.</span>
      {ready && <button type="button" className="hero-morph-replay" onClick={() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        animationRef.current?.goToAndPlay(0, true)
      }} aria-label="Replay AI spark-to-decision animation">Replay motion ↻</button>}
    </div>
  </div>
}
