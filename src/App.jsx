import { useEffect, useMemo, useState } from 'react'
import { motion as Motion } from 'framer-motion'

const baseUrl = import.meta.env.BASE_URL
const carouselFiles = [
  '18.webp',
  '3 (1).webp',
  '3.webp',
  'ad-abe53a88 - 2026-02-03_10-50-40 - 1.webp',
  'ad-abe53baf - 2026-02-03_10-55-32 - 1.webp',
  'ad-abe54228 - 2026-02-03_11-24-28 - 1.webp',
  'ad-abe54459 - 2026-02-03_11-30-53 - 1.webp',
]
const carouselCards = carouselFiles.map((file) => `${baseUrl}scroller/${file}`)

function App() {
  const [showCarousel, setShowCarousel] = useState(false)
  const longCarousel = useMemo(
    () => [...carouselCards, ...carouselCards],
    [],
  )

  useEffect(() => {
    const isTouchDevice = () =>
      'ontouchstart' in window || navigator.maxTouchPoints > 0

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isTouchDevice() || prefersReducedMotion) {
      return
    }

    let lenis
    let frameId = 0
    let destroyed = false

    const initLenis = async () => {
      const { default: Lenis } = await import('lenis')
      if (destroyed) return

      lenis = new Lenis({
        autoRaf: false,
        smoothWheel: true,
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        lerp: 0.1,
      })

      const raf = (time) => {
        lenis.raf(time)
        frameId = requestAnimationFrame(raf)
      }

      frameId = requestAnimationFrame(raf)
    }

    initLenis()

    return () => {
      destroyed = true
      cancelAnimationFrame(frameId)
      lenis?.destroy()
    }
  }, [])

  useEffect(() => {
    let timeoutId = 0
    let idleId = 0

    const revealCarousel = () => {
      timeoutId = window.setTimeout(() => {
        setShowCarousel(true)
      }, 120)
    }

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(revealCarousel, { timeout: 900 })
    } else {
      revealCarousel()
    }

    return () => {
      if (idleId && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId)
      }
      window.clearTimeout(timeoutId)
    }
  }, [])

  return (
    <main className="relative isolate min-h-screen overflow-x-hidden">
      <div className="grain" aria-hidden="true" />
      <div className="relative z-10 flex items-center justify-start flex-col h-fit">



    <Motion.p
        initial={{ opacity: 0, y: 0, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 10, filter: 'blur(0px)' }}
        transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }} className="title text-[24px] tracking-[-0.04em] mb-[92px]">Sapone</Motion.p>


    <div className="flex items-center justify-center flex-col mb-[64px]">

      <Motion.div
        initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.55, delay: 0, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center justify-center flex-row w-fit px-[14px] pb-[3px] pt-[4px] bg-white border border-border rounded-full mb-[18px]"
      >
        <span className="live-dot" aria-hidden="true" />
        
        <p className="text-[14px] alt text-text !ml-[12px]">Launching March 17th.</p>
        <a className="flex ml-[8px] items-center cursor-pointer justify-center flex-row hover:opacity-80 gap-0.5">
          <p className="text-[14px] alt !text-red underline">Notify me</p>
          <img src={`${baseUrl}icons/arrow.svg`} alt="arrow-right" className="size-4"></img>
        </a>
      </Motion.div>
      
      <Motion.h1
        initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="text-3xl md:text-4xl lg:text-5xl title text-center !tracking-[-0.04em] mb-[12px]"
      >
        SHAMPOO IN SOAP PACKAGING
      </Motion.h1>

      <Motion.p
        initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="text-[18px] alt !text-alt"
      >
        Zero Plastic. Premium Quality. Zero waste.
      </Motion.p>
    </div>



    <div className="flex items-center w-full justify-center flex-col mb-[128px]">

      <Motion.input
        initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.55, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        type="email"
        placeholder="Enter your email"
        className="max-w-[320px] w-full h-fit px-[16px] py-[8px] alt bg-white border border-border rounded-[12px] hover:border-red/30 transition-all duration-150 ease-out focus:outline-red focus:ring-0 focus:border-red/30 mb-[12px]"
      />

<Motion.div
initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
transition={{ duration: 0.55, delay: 0.35, ease: [0.22, 1, 0.36,1] }}
className="flex items-center justify-center w-full">
      <button
         
        className="max-w-[320px] w-full h-fit px-[16px] py-[8px] bg-red !text-white rounded-[12px] alt cursor-pointer hover:bg-red/90 transition-all duration-50 ease-out"
      >
        Join the waitlist!
      </button>
      </Motion.div>

      <Motion.p
      initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.55, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="alt !text-alt/80 text-center text-[14px] mt-[8px]">Get early bird access - 40% off for first 500!</Motion.p>

    </div>





      {showCarousel ? (
        <Motion.section
          initial={{ opacity: 0, y: 6, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.55, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
        >
          <div className="carousel-track-wide py-2">
            {longCarousel.map((src, idx) => (
              <figure key={`${src}-${idx}`} className="carousel-image-card">
                <img
                  src={encodeURI(src)}
                  alt={`Sapone product preview ${idx + 1}`}
                  className="size-full object-cover"
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                />
              </figure>
            ))}
          </div>
        </Motion.section>
      ) : (
        <div className="w-full h-[340px]" aria-hidden="true" />
      )}





<section></section>

        <section className="h-[200vh] w-full flex items-center justify-center">
          MATAIII
        </section>



      </div>
    </main>
  )
}

export default App
