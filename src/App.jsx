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
      <div className="relative z-10 flex items-center justify-start flex-col h-fit px-[10px] md:px-0">



    <Motion.p
        initial={{ opacity: 0, y: 0, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 10, filter: 'blur(0px)' }}
        transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }} className="title text-[24px] tracking-[-0.04em] mb-[72px] md:mb-[92px]">Sapone</Motion.p>


    <div className="flex items-center justify-center flex-col mb-[40px] md:mb-[64px]">

      <Motion.div
        initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.55, delay: 0, ease: [0.22, 1, 0.36, 1] }}
        className="flex max-w-full flex-wrap items-center justify-center gap-y-1 bg-white border border-border rounded-full mb-[16px] px-[12px] pb-[4px] pt-[4px]"
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
        className="text-4xl md:text-4xl lg:text-5xl title text-center !tracking-[-0.04em] mb-[12px]"
      >
        SHAMPOO IN SOAP PACKAGING
      </Motion.h1>

      <Motion.p
        initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="text-[16px] md:text-[18px] alt !text-alt"
      >
        Zero Plastic. Premium Quality. Zero waste.
      </Motion.p>
    </div>



    <div className="flex items-center w-full justify-center flex-col mb-[72px] md:mb-[112px]">

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


    <Motion.section
      initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.55, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="w-full mb-[8px]"
    >
      <div className="mx-auto grid w-full max-w-[820px] grid-cols-2 gap-1 md:grid-cols-4 md:gap-1">
          <article className="rounded-[12px] border border-border bg-white/80 px-3 py-2 md:px-3.5 md:py-2">
            <p className="alt text-[19px] leading-[1.06] tracking-[-0.02em] text-red md:text-[20px]">847+</p>
            <p className="alt mt-0.5 text-[11px] text-alt/80">Signed up</p>
          </article>
          <article className="rounded-[12px] border border-border bg-white/80 px-3 py-2 md:px-3.5 md:py-2">
            <p className="alt text-[19px] leading-[1.06] tracking-[-0.02em] text-red md:text-[20px]">Shark Tank</p>
            <p className="alt mt-0.5 text-[11px] text-alt/80">Featured</p>
          </article>
          <article className="rounded-[12px] border border-border bg-white/80 px-3 py-2 md:px-3.5 md:py-2">
            <p className="alt text-[19px] leading-[1.06] tracking-[-0.02em] text-red md:text-[20px]">1000+</p>
            <p className="alt mt-0.5 text-[11px] text-alt/80">Sold</p>
          </article>
          <article className="rounded-[12px] border border-border bg-white/80 px-3 py-2 md:px-3.5 md:py-2">
            <p className="alt text-[19px] leading-[1.06] tracking-[-0.02em] text-red md:text-[20px]">Loved in Europe</p>
            <p className="alt mt-0.5 text-[11px] text-alt/80">Social proof</p>
          </article>
      </div>
    </Motion.section>
    





      {showCarousel ? (
        <Motion.section
          initial={{ opacity: 0, y: 6, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.55, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="w-[calc(100%+20px)] -mx-[10px] md:w-full md:mx-0"
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
        <div className="w-[calc(100%+20px)] -mx-[10px] h-[340px] md:w-full md:mx-0" aria-hidden="true" />
      )}





        <section className="w-full max-w-[980px] px-0 md:px-10 mt-[60px] md:mt-[128px] mb-[64px] md:mb-[120px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            <article className="bg-white/70 border border-border rounded-[14px] p-5 md:p-6">
              <span className="inline-flex items-center alt text-[11px] uppercase tracking-[0.08em] text-red bg-red/8 border border-red/15 rounded-full px-2.5 py-1 mb-3">
                Problem 1
              </span>
              <h2 className="title text-[19px] md:text-[21px] leading-[1.2] tracking-[-0.02em] mb-3">
                Your family&apos;s plastic legacy
              </h2>
              <p className="alt text-[13px] md:text-[14px] text-[#111] mb-3">
                24 bottles/year × 91% never recycled = 480 bottles in landfills over 20 years.
              </p>
              <p className="alt text-[13px] md:text-[14px] text-alt leading-normal mb-4">
                Every “just one bottle” choice compounds into long-term waste and quiet guilt.
              </p>
              <p className="alt text-[13px] md:text-[14px] font-medium text-[#111]">
                <span className="text-red">Sapone solution:</span> Zero bottles. Zero guilt. Zero plastic
                legacy.
              </p>
            </article>

            <article className="bg-white/70 border border-border rounded-[14px] p-5 md:p-6">
              <span className="inline-flex items-center alt text-[11px] uppercase tracking-[0.08em] text-red bg-red/8 border border-red/15 rounded-full px-2.5 py-1 mb-3">
                Problem 2
              </span>
              <h2 className="title text-[19px] md:text-[21px] leading-[1.2] tracking-[-0.02em] mb-3">
                Your bathroom is a plastic graveyard
              </h2>
              <p className="alt text-[13px] md:text-[14px] text-[#111] mb-3">
                7-12 bottles cluttering your shower. €96 wasted on packaging you throw away.
              </p>
              <p className="alt text-[13px] md:text-[14px] text-alt leading-normal mb-4">
                Visual clutter adds stress while promised recycling becomes bin-bound habit.
              </p>
              <p className="alt text-[13px] md:text-[14px] font-medium text-[#111]">
                <span className="text-red">Sapone solution:</span> One product. Clean counter. Actual
                minimalism.
              </p>
            </article>

            <article className="bg-white/70 border border-border rounded-[14px] p-5 md:p-6">
              <span className="inline-flex items-center alt text-[11px] uppercase tracking-[0.08em] text-red bg-red/8 border border-red/15 rounded-full px-2.5 py-1 mb-3">
                Problem 3
              </span>
              <h2 className="title text-[19px] md:text-[21px] leading-[1.2] tracking-[-0.02em] mb-3">
                Zero emotion, zero ritual
              </h2>
              <p className="alt text-[13px] md:text-[14px] text-[#111] mb-3">
                Mindless consumption. No connection. Just buy-use-throw-repeat.
              </p>
              <p className="alt text-[13px] md:text-[14px] text-alt leading-normal mb-4">
                Disposable products turn self-care into routine autopilot with no meaning.
              </p>
              <p className="alt text-[13px] md:text-[14px] font-medium text-[#111]">
                <span className="text-red">Sapone solution:</span> Beautiful product. Proud choice. Ritual
                restored.
              </p>
            </article>
          </div>
        </section>

        <section className="h-[200vh] w-full flex items-center justify-center">
          MATAIII
        </section>



      </div>
    </main>
  )
}

export default App
