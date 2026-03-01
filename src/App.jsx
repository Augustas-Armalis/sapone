import { useEffect, useMemo } from 'react'
import { motion as Motion } from 'framer-motion'
import Lenis from 'lenis'

const carouselCards = [
  '/scroller/18.webp',
  '/scroller/3 (1).webp',
  '/scroller/3.webp',
  '/scroller/ad-abe53a88 - 2026-02-03_10-50-40 - 1.webp',
  '/scroller/ad-abe53baf - 2026-02-03_10-55-32 - 1.webp',
  '/scroller/ad-abe54228 - 2026-02-03_11-24-28 - 1.webp',
  '/scroller/ad-abe54459 - 2026-02-03_11-30-53 - 1.webp',
]

function App() {
  const longCarousel = useMemo(
    () => [...carouselCards, ...carouselCards, ...carouselCards, ...carouselCards],
    [],
  )

  useEffect(() => {
    const isTouchDevice = () =>
      'ontouchstart' in window || navigator.maxTouchPoints > 0

    if (isTouchDevice()) {
      return
    }

    const lenis = new Lenis({
      autoRaf: false,
      smoothWheel: true,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      lerp: 0.1,
    })

    const scrollPosition = sessionStorage.getItem('scrollPosition') || 0

    const saveScrollPosition = () => {
      sessionStorage.setItem('scrollPosition', window.scrollY)
    }

    const restoreScrollPosition = () => {
      window.scrollTo(0, scrollPosition)
    }

    window.addEventListener('beforeunload', saveScrollPosition)
    window.addEventListener('load', restoreScrollPosition)

    let frameId = 0

    const raf = (time) => {
      lenis.raf(time)
      frameId = requestAnimationFrame(raf)
    }

    frameId = requestAnimationFrame(raf)

    const onScroll = (e) => {
      console.log(e)
    }

    lenis.on('scroll', onScroll)

    return () => {
      window.removeEventListener('beforeunload', saveScrollPosition)
      window.removeEventListener('load', restoreScrollPosition)
      cancelAnimationFrame(frameId)
      if (typeof lenis.off === 'function') {
        lenis.off('scroll', onScroll)
      }
      lenis.destroy()
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
          <img src="/icons/arrow.svg" alt="arrow-right" className="size-4"></img>
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


      <Motion.button
        initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.55, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-[320px] w-full h-fit px-[16px] py-[8px] bg-red !text-white rounded-[12px] alt cursor-pointer hover:opacity-90 transition-all duration-150 ease-out"
      >
        Join the waitlist!
      </Motion.button>

      <Motion.p
      initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.55, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="alt !text-alt/80 text-center text-[14px] mt-[8px]">Get early bird access - 40% off for first 500!</Motion.p>

    </div>





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
              />
            </figure>
          ))}
        </div>
      </Motion.section>







        <section className="h-[200vh] w-full flex items-center justify-center">
          MATAIII
        </section>



      </div>
    </main>
  )
}

export default App
