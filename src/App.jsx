import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion as Motion, useScroll, useTransform } from 'framer-motion'
import { Tv, Package, Globe, ShieldCheck, Leaf, Truck } from 'lucide-react'

const baseUrl = import.meta.env.BASE_URL
const carouselFiles = [
  { file: '18.webp', width: 720, height: 720 },
  { file: '3 (1).webp', width: 720, height: 1368 },
  { file: '3.webp', width: 720, height: 754 },
  { file: 'ad-abe53a88 - 2026-02-03_10-50-40 - 1.webp', width: 720, height: 1290 },
  { file: 'ad-abe53baf - 2026-02-03_10-55-32 - 1.webp', width: 720, height: 964 },
  { file: 'ad-abe54228 - 2026-02-03_11-24-28 - 1.webp', width: 720, height: 964 },
  { file: 'ad-abe54459 - 2026-02-03_11-30-53 - 1.webp', width: 720, height: 964 },
]
const carouselCards = carouselFiles.map(({ file, width, height }) => ({
  src: encodeURI(`${baseUrl}scroller/${file}`),
  width,
  height,
}))

const stackCards = [
  { image: `${baseUrl}cards/01.webp`, label: "Backed by one of Lithuania's wealthiest investors", rotate: -1.2 },
  { image: `${baseUrl}cards/02.webp`, label: 'Shark Tank vetted and publicly validated', rotate: 1.1 },
  { image: `${baseUrl}cards/03.webp`, label: 'Already shipped 1,000+ units successfully', rotate: -1 },
  { image: `${baseUrl}cards/04.webp`, label: 'Real company, real product, real commitment', rotate: 1.4 },
  { image: `${baseUrl}cards/05.webp`, label: 'Legally binding delivery contract signed', rotate: -0.8 },
]

function TrustCard({ card, index, progress, range, targetScale }) {
  const cardRef = useRef(null)
  const { scrollYProgress: cardProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'start start'],
  })
  const imageScale = useTransform(cardProgress, [0, 1], [2, 1])
  const scale = useTransform(progress, range, [1, targetScale])

  return (
    <div
      ref={cardRef}
      className="h-svh flex items-center justify-center sticky top-0"
    >
      <Motion.div
        style={{ scale, rotate: card.rotate, top: `calc(-4vh + ${index * 22}px)` }}
        className="relative w-[92%] max-w-[min(680px,90vw)] rounded-[14px] md:rounded-[18px] overflow-hidden bg-bg border border-white/10 shadow-[0_4px_32px_rgba(0,0,0,0.10)] origin-top"
      >
        <div className="w-full aspect-4/3 sm:aspect-video overflow-hidden">
          <Motion.div className="w-full h-full" style={{ scale: imageScale }}>
            <img
              src={card.image}
              alt={card.label}
              className="size-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </Motion.div>
        </div>
        <div className="px-4 md:px-5 py-3 md:py-4 bg-bg">
          <p className="alt text-[14px] md:text-[16px] text-text leading-snug">
            {card.label}
          </p>
        </div>
      </Motion.div>
    </div>
  )
}

function TrustStackSection() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  return (
    <section ref={sectionRef} className="w-full">
      {stackCards.map((card, index) => {
        const targetScale = 1 - (stackCards.length - index) * 0.05
        return (
          <TrustCard
            key={index}
            card={card}
            index={index}
            progress={scrollYProgress}
            range={[index * (1 / stackCards.length), 1]}
            targetScale={targetScale}
          />
        )
      })}
    </section>
  )
}

const keyIngredients = [
  { name: 'Argan Oil', benefit: 'nourishes, softens' },
  { name: 'Aloe Vera', benefit: 'hydrates, soothes scalp' },
  { name: 'Panthenol', benefit: 'strengthens, adds shine' },
  { name: 'Green Tea Extract', benefit: 'antioxidant protection' },
  { name: 'Wheat Protein', benefit: 'strengthens, adds volume' },
  { name: 'Amino Acids', benefit: 'restores elasticity' },
]

const fullIngredients = [
  'Water (Aqua)', 'Coco-Glucoside', 'Decyl Glucoside',
  'Sodium Cocoyl Glutamate', 'Glycerin', 'Panthenol',
  'Argania Spinosa Kernel Oil', 'Aloe Barbadensis Leaf Juice',
  'Camellia Sinensis Leaf Extract', 'Hydrolyzed Wheat Protein',
  'Amino Acids Blend', 'Citric Acid',
]

function IngredientsSection() {
  const [listOpen, setListOpen] = useState(false)

  return (
    <section className="w-full px-4 md:px-10 pt-[72px] md:pt-[112px] pb-[72px] md:pb-[120px]">
      <div className="max-w-[980px] mx-auto">

        {/* Top: left copy + right image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 mb-[48px] md:mb-[56px] items-start">

          {/* Left */}
          <div className="flex flex-col">
            <span className="inline-flex items-center alt text-[11px] uppercase tracking-[0.08em] text-red bg-red/8 border border-red/15 rounded-full px-3 py-1 mb-5 w-fit">
              Ingredients
            </span>
            <h2 className="title text-[32px] md:text-[44px] lg:text-[52px] leading-[1.06] tracking-[-0.04em]! mb-8 max-w-[480px]">
              91% Natural Origin Formula
            </h2>
            <ul className="flex flex-col gap-3.5 mb-9">
              {keyIngredients.map(({ name, benefit }, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-red text-[13px] mt-[2px] shrink-0 font-bold">✓</span>
                  <p className="alt text-[14px] md:text-[15px] leading-snug">
                    <span className="text-text font-semibold">{name}</span>
                    <span className="text-alt"> — {benefit}</span>
                  </p>
                </li>
              ))}
            </ul>
            <button className="w-fit px-8 py-[10px] bg-red text-white! alt text-[15px] rounded-[12px] cursor-pointer hover:bg-red/90 transition-all duration-150 ease-out">
              Join the waitlist
            </button>
          </div>

          {/* Right: image/video placeholder */}
          <div className="rounded-[20px] bg-white/60 border border-border min-h-[300px] lg:min-h-[420px] flex items-center justify-center">
            <p className="alt text-[12px] text-alt/50 tracking-wide uppercase">Image / Video</p>
          </div>
        </div>

        {/* NO cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          {['sulfates', 'parabens', 'microplastics'].map((label) => (
            <article
              key={label}
              className="rounded-[14px] border border-border bg-white/70 px-5 py-7 flex items-center justify-center"
            >
              <p className="alt text-[17px] md:text-[19px] font-medium text-center tracking-[-0.01em]">
                <span className="text-red">NO </span>
                <span className="text-text">{label}</span>
              </p>
            </article>
          ))}
        </div>

        {/* Full ingredient list — collapsible */}
        <div className="flex flex-col items-center mt-3">
          <button
            onClick={() => setListOpen(!listOpen)}
            className="flex items-center gap-1.5 alt text-[13px] text-alt hover:text-text transition-colors duration-150 cursor-pointer py-2"
          >
            See full ingredient list
            <Motion.span
              animate={{ rotate: listOpen ? 180 : 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block leading-none"
            >
              ↓
            </Motion.span>
          </button>

          <AnimatePresence initial={false}>
            {listOpen && (
              <Motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden w-full"
              >
                <div className="flex flex-wrap gap-2 pt-4 pb-2 justify-center">
                  {fullIngredients.map((ing) => (
                    <span
                      key={ing}
                      className="alt text-[12px] text-text bg-white border border-border rounded-full px-3 py-1.5"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </Motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  )
}

function AboutSection() {
  return (
    <section className="w-full px-4 md:px-10 pt-[72px] md:pt-[112px] pb-[80px] md:pb-[128px]">
      <div className="max-w-[980px] mx-auto">

        <h2 className="title text-[32px] md:text-[48px] lg:text-[56px] leading-[1.06] tracking-[-0.04em]! text-center mb-12 md:mb-16">
          Built by Teenagers.<br className="hidden md:block" /> Backed by Experts.
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">

          {/* Left: image placeholder */}
          <div className="rounded-[20px] bg-white/60 border border-border aspect-4/5 w-full flex items-center justify-center order-2 lg:order-1">
            <p className="alt text-[12px] text-alt/50 tracking-wide uppercase">Image</p>
          </div>

          {/* Right: story */}
          <div className="flex flex-col gap-5 order-1 lg:order-2 pt-1">

            <p className="alt text-[15px] md:text-[16px] text-text leading-relaxed">
              I'm Paulius, I'm 17, and yes — I'm a bald student who pitched a shampoo brand on{' '}
              <span className="font-semibold text-red">Shark Tank</span>.
            </p>

            <p className="alt text-[14px] md:text-[15px] text-alt leading-relaxed">
              It started with a school project and a haunting statistic: 91% of plastic bottles are never recycled.
              We refused to accept that, so we looked for a 'Kinder Surprise' solution — just as Kinder combined
              chocolate and a toy, we combined the two essentials of every bathroom: liquid shampoo protected by
              a solid soap shell.
            </p>

            <p className="alt text-[14px] md:text-[15px] text-alt leading-relaxed">
              We started with $300 and failed 22 times. On the 23rd prototype, we finally cracked the code. We
              sold at local markets, convinced our parents to help us scale with a $1,000 loan, and obsessively
              refined the quality until it was salon-grade.
            </p>

            <p className="alt text-[14px] md:text-[15px] text-alt leading-relaxed">
              We took that confidence to{' '}
              <span className="font-semibold text-text">Shark Tank</span>, walked away with an investment, and
              now we're backed by world-class laboratories. We aren't just making a 'green' product — we're making
              the future of hair care. Sustainable, high-performance, and completely plastic-free.
            </p>

            <p className="alt text-[15px] md:text-[16px] text-text font-semibold leading-relaxed">
              We're taking Sapone global.
            </p>

            <div className="pt-2">
              <button className="px-8 py-[10px] bg-red text-white! alt text-[15px] rounded-[12px] cursor-pointer hover:bg-red/90 transition-all duration-150 ease-out">
                Join the waitlist
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}

function FinalCtaSection() {
  return (
    <section className="w-full bg-white px-4 md:px-10 py-[72px] md:py-[112px]">
      <div className="max-w-[640px] mx-auto flex flex-col items-center text-center">

        <span className="inline-flex items-center alt text-[11px] uppercase tracking-[0.08em] text-red bg-red/8 border border-red/15 rounded-full px-3 py-1 mb-5 w-fit">
          Limited Early Access
        </span>

        <h2 className="title text-[36px] md:text-[54px] leading-[1.04] tracking-[-0.04em]! mb-3">
          Launching March 17th
        </h2>
        <p className="alt text-[15px] text-alt mb-10 max-w-[340px] leading-snug">
          First 500 backers only. After that, price increases.
        </p>

        {/* Price row */}
        <div className="w-full rounded-[18px] bg-[#484854] p-6 md:p-8 mb-7 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
          <div className="flex flex-col items-center">
            <span className="alt text-[10px] uppercase tracking-widest text-white/40 mb-1">Early Bird</span>
            <div className="flex items-end gap-1.5">
              <span className="title text-[60px] leading-none tracking-[-0.04em] text-white">€12</span>
              <span className="alt text-[12px] text-white/40 mb-2">/ bar</span>
            </div>
            <span className="alt text-[11px] text-white/35 mt-1">Save 40%</span>
          </div>

          <div className="h-px w-14 bg-white/10 sm:hidden" />
          <div className="hidden sm:block w-px h-14 bg-white/10" />

          <div className="flex flex-col items-center">
            <span className="alt text-[10px] uppercase tracking-widest text-white/40 mb-1">Regular</span>
            <span className="title text-[60px] leading-none tracking-[-0.04em] text-white/15 line-through">€17</span>
            <span className="alt text-[11px] text-white/30 mt-1">after launch</span>
          </div>
        </div>

        <p className="alt text-[13px] text-alt mb-5">
          Join <span className="font-semibold text-text">847+ people</span> already on the waitlist
        </p>

        <div className="w-full flex flex-col sm:flex-row gap-2 mb-8">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 px-4 py-[13px] rounded-[12px] border border-border bg-bg alt text-[15px] text-text outline-none focus:border-red/40 transition-colors duration-150 placeholder:text-alt/40"
          />
          <button className="px-7 py-[13px] bg-red text-white! alt text-[15px] font-medium rounded-[12px] cursor-pointer hover:bg-red/90 transition-all duration-150 ease-out whitespace-nowrap">
            Get Early Access
          </button>
        </div>

        {/* Benefit grid */}
        <div className="w-full grid grid-cols-2 gap-2">
          {[
            'Launch day notification',
            'Exclusive early bird pricing',
            'Behind-the-scenes updates',
            'First access to new scents',
          ].map((benefit) => (
            <div key={benefit} className="flex items-center gap-2.5 px-4 py-3 rounded-[12px] border border-border bg-bg/60">
              <span className="text-red text-[12px] font-bold shrink-0">✓</span>
              <span className="alt text-[12px] md:text-[13px] text-text text-left leading-snug">{benefit}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

const footerBadges = [
  { Icon: Tv,          label: 'As Seen on Shark Tank' },
  { Icon: Package,     label: '1,000+ Bottles Sold' },
  { Icon: Globe,       label: 'Loved Across Europe' },
  { Icon: ShieldCheck, label: 'Legally Guaranteed Delivery' },
  { Icon: Leaf,        label: '91% Natural Ingredients' },
  { Icon: Truck,       label: 'Ships Worldwide' },
]

function SiteFooter() {
  const footerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ['start end', 'end end'],
  })

  const bottle0Y = useTransform(scrollYProgress, [0, 1], [160, -60])
  const bottle1Y = useTransform(scrollYProgress, [0, 1], [220, -20])
  const bottle2Y = useTransform(scrollYProgress, [0, 1], [180, -40])
  const bottle3Y = useTransform(scrollYProgress, [0, 1], [140, -70])

  return (
    <footer ref={footerRef} className="w-full bg-[#862737] overflow-hidden relative">

      {/* Watermark — sits behind the badge grid, top-aligned to the content start */}
      <div className="absolute inset-x-0 top-0 pointer-events-none select-none flex justify-center overflow-hidden pt-16 md:pt-24">
        <span className="title leading-none whitespace-nowrap text-white/5" style={{ fontSize: 'clamp(110px, 28vw, 320px)' }}>
          Sapone
        </span>
      </div>

      {/* Badge grid */}
      <div className="relative z-5 px-4 md:px-10 pt-16 md:pt-24 pb-10 md:pb-[260px] max-w-[860px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {footerBadges.map(({ Icon, label }, i) => (
            <Motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10px' }}
              transition={{ duration: 0.35, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3.5 px-4 py-4 rounded-[13px] border border-white/10 bg-white/10 backdrop-blur-sm"
            >
              <Icon size={18} className="text-white/70 shrink-0" strokeWidth={1.6} />
              <span className="alt text-[15px] md:text-[16px] text-white font-medium leading-snug">{label}</span>
            </Motion.div>
          ))}
        </div>
      </div>

      {/* Bottles — desktop only, in front of badges, behind bottom bar */}
      <div className="hidden md:block absolute inset-x-0 top-0 bottom-[57px] pointer-events-none select-none z-15" aria-hidden="true">
        <Motion.div style={{ y: bottle0Y, rotate: -13 }} className="absolute left-[1%] bottom-0 w-[170px] lg:w-[210px]">
          <img src={`${baseUrl}images/raudonas.webp`} alt="" className="w-full h-auto object-contain drop-shadow-[0_32px_56px_rgba(0,0,0,0.55)]" loading="lazy" />
        </Motion.div>
        <Motion.div style={{ y: bottle1Y, rotate: 8 }} className="absolute left-[20%] bottom-0 w-[148px] lg:w-[185px]">
          <img src={`${baseUrl}images/geltonas.webp`} alt="" className="w-full h-auto object-contain drop-shadow-[0_32px_56px_rgba(0,0,0,0.55)]" loading="lazy" />
        </Motion.div>
        <Motion.div style={{ y: bottle2Y, rotate: -6 }} className="absolute right-[20%] bottom-0 w-[148px] lg:w-[185px]">
          <img src={`${baseUrl}images/zalias.webp`} alt="" className="w-full h-auto object-contain drop-shadow-[0_32px_56px_rgba(0,0,0,0.55)]" loading="lazy" />
        </Motion.div>
        <Motion.div style={{ y: bottle3Y, rotate: 12 }} className="absolute right-[1%] bottom-0 w-[170px] lg:w-[210px]">
          <img src={`${baseUrl}images/melynas.webp`} alt="" className="w-full h-auto object-contain drop-shadow-[0_32px_56px_rgba(0,0,0,0.55)]" loading="lazy" />
        </Motion.div>
      </div>

      {/* Bottom bar — frosted glass so bottles bleed through */}
      <div className="relative z-20 bg-white/5 backdrop-blur-md border-t border-white/10 px-5 md:px-10 py-5">
        <div className="max-w-[860px] mx-auto flex flex-row items-center justify-between">
          <span className="alt text-[14px] md:text-[15px] text-white/65">© Sapone 2026</span>
          <a
            href="mailto:hello@sapone.eu"
            className="alt text-[14px] md:text-[15px] text-white/65 hover:text-white transition-colors duration-150"
          >
            hello@sapone.store
          </a>
        </div>
      </div>

    </footer>
  )
}

const faqs = [
  {
    q: 'Does the shampoo actually work?',
    a: '91% natural origin formula. Worked with labs. Tested by 1,000+ customers.',
    bullets: ['Curly hair', 'Straight hair', 'Colored hair', 'Oily hair', 'Anti-dandruff', 'Universal'],
  },
  {
    q: 'What happens when shampoo runs out?',
    a: 'Perfect ratio designed through testing. When 200ml shampoo is finished, minimal soap remains. No waste.',
  },
  {
    q: 'How does shipping work?',
    a: 'Recyclable cardboard box with climate-proof inner layer. Tested −20°C to +40°C. Ships worldwide. Arrives safe — no melting, no leaking.',
  },
  {
    q: 'Can I keep it in the shower?',
    a: 'Yes. Soap dissolves from friction, not just water. We reinforced it — stronger than traditional soap. Designed specifically for shower storage.',
  },
  {
    q: 'Is this like that other product that scammed people?',
    a: 'We know about that. We\'re different.',
    bullets: ['Backed by one of Lithuania\'s wealthiest investors', 'Legally binding delivery contract signed', 'Already shipped 1,000+', 'Real company, real product, real commitment'],
  },
]

function App() {
  const [showCarousel, setShowCarousel] = useState(false)
  const longCarousel = useMemo(
    () => [...carouselCards, ...carouselCards],
    [],
  )

  const [openFaq, setOpenFaq] = useState(0)

  const perspectiveSectionRef = useRef(null)
  const { scrollYProgress: pProgress } = useScroll({
    target: perspectiveSectionRef,
    offset: ['start end', 'end start'],
  })
  // Far images (top, smaller) → biggest Y range = fastest = furthest depth
  const img1Y = useTransform(pProgress, [0, 1], [200, -320])
  const img2Y = useTransform(pProgress, [0, 1], [160, -260])
  // Near images (bottom, larger) → slower than top but still prominent
  const img3Y = useTransform(pProgress, [0, 1], [110, -180])
  const img4Y = useTransform(pProgress, [0, 1], [130, -200])

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
    <main className="relative isolate min-h-screen">
      <div className="grain" aria-hidden="true" />
      <div className="relative z-10 flex items-center justify-start flex-col h-fit px-[10px] md:px-0 overflow-x-clip">



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
        
        <p className="text-[14px] alt text-text ml-[12px]!">Launching March 17th.</p>
        <a className="flex ml-[8px] items-center cursor-pointer justify-center flex-row hover:opacity-80 gap-0.5">
          <p className="text-[14px] alt text-red! underline">Notify me</p>
          <img src={`${baseUrl}icons/arrow.svg`} alt="arrow-right" className="size-4"></img>
        </a>
      </Motion.div>
      
      <Motion.h1
        initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="text-4xl md:text-4xl lg:text-5xl title text-center tracking-[-0.04em]! mb-[12px]"
      >
        SHAMPOO IN SOAP PACKAGING
      </Motion.h1>

      <Motion.p
        initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="text-[16px] md:text-[18px] alt text-alt!"
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
         
        className="max-w-[320px] w-full h-fit px-[16px] py-[8px] bg-red text-white! rounded-[12px] alt cursor-pointer hover:bg-red/90 transition-all duration-50 ease-out"
      >
        Join the waitlist!
      </button>
      </Motion.div>

      <Motion.p
      initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.55, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="alt text-alt/80! text-center text-[14px] mt-[8px]">Get early bird access - 40% off for first 500!</Motion.p>

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
            {longCarousel.map((card, idx) => (
              <figure key={`${card.src}-${idx}`} className="carousel-image-card">
                <img
                  src={card.src}
                  alt={`Sapone product preview ${idx + 1}`}
                  className="size-full object-cover"
                  width={card.width}
                  height={card.height}
                  sizes="(max-width: 768px) 40vw, 260px"
                  loading={idx < 6 ? 'eager' : 'lazy'}
                  decoding="async"
                  fetchPriority={idx === 0 ? 'high' : 'low'}
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

        <section
          ref={perspectiveSectionRef}
          className="relative w-full min-h-screen lg:min-h-[70vh] flex items-center justify-center"
        >
          {/* Desktop: top-left — spread wide apart */}
          <Motion.figure
            style={{ y: img1Y }}
            className="hidden lg:block absolute top-[26%] left-[11%] w-[138px] aspect-4/5 rounded-[16px] overflow-hidden m-0 -rotate-12"
          >
            <img src={`${baseUrl}images/geltonas.webp`} alt="Sapone product" className="size-full object-cover" loading="lazy" decoding="async" />
          </Motion.figure>

          {/* Desktop: top-right — spread wide apart */}
          <Motion.figure
            style={{ y: img2Y }}
            className="hidden lg:block absolute top-[18%] right-[10%] w-[145px] aspect-4/5 rounded-[16px] overflow-hidden m-0 rotate-9"
          >
            <img src={`${baseUrl}images/melynas.webp`} alt="Sapone product" className="size-full object-cover" loading="lazy" decoding="async" />
          </Motion.figure>

          {/* Desktop: bottom-left — closer together near center */}
          <Motion.figure
            style={{ y: img3Y }}
            className="hidden lg:block absolute top-[63%] left-[24%] w-[215px] aspect-3/4 rounded-[16px] overflow-hidden m-0 -rotate-5"
          >
            <img src={`${baseUrl}images/zalias.webp`} alt="Sapone product" className="size-full object-cover" loading="lazy" decoding="async" />
          </Motion.figure>

          {/* Desktop: bottom-right — closer together near center */}
          <Motion.figure
            style={{ y: img4Y }}
            className="hidden lg:block absolute top-[67%] right-[23%] w-[200px] aspect-3/4 rounded-[16px] overflow-hidden m-0 rotate-7"
          >
            <img src={`${baseUrl}images/raudonas.webp`} alt="Sapone product" className="size-full object-cover" loading="lazy" decoding="async" />
          </Motion.figure>

          {/* Mobile: top-left — high up, big tilt */}
          <Motion.figure
            style={{ y: img1Y }}
            className="lg:hidden absolute top-[2%] left-[-2%] w-[145px] aspect-3/4 rounded-[16px] overflow-hidden m-0 z-20 -rotate-6"
          >
            <img src={`${baseUrl}images/melynas.webp`} alt="Sapone product" className="size-full object-cover" loading="lazy" decoding="async" />
          </Motion.figure>

          {/* Mobile: top-right — lower and more tilted */}
          <Motion.figure
            style={{ y: img2Y }}
            className="lg:hidden absolute top-[14%] right-[-2%] w-[118px] aspect-3/4 rounded-[16px] overflow-hidden m-0 z-20 rotate-12"
          >
            <img src={`${baseUrl}images/zalias.webp`} alt="Sapone product" className="size-full object-cover" loading="lazy" decoding="async" />
          </Motion.figure>

          {/* Mobile: bottom-left — near bottom edge */}
          <Motion.figure
            style={{ y: img3Y }}
            className="lg:hidden absolute bottom-[2%] left-[0%] w-[150px] aspect-3/4 rounded-[16px] overflow-hidden m-0 z-20 rotate-6"
          >
            <img src={`${baseUrl}images/geltonas.webp`} alt="Sapone product" className="size-full object-cover" loading="lazy" decoding="async" />
          </Motion.figure>

          {/* Mobile: bottom-right — higher from bottom, opposite tilt */}
          <Motion.figure
            style={{ y: img4Y }}
            className="lg:hidden absolute bottom-[13%] right-[-1%] w-[125px] aspect-3/4 rounded-[16px] overflow-hidden m-0 z-20 -rotate-12"
          >
            <img src={`${baseUrl}images/raudonas.webp`} alt="Sapone product" className="size-full object-cover" loading="lazy" decoding="async" />
          </Motion.figure>

          {/* Center content */}
          <div className="relative z-10 text-center max-w-[420px]">
            <h2 className="title text-[32px]   md:text-[36px] leading-[1.08] tracking-[-0.04em]! mb-[8px]">
              WHAT IF THE BOTTLE WAS THE PRODUCT?
            </h2>
            <p className="alt text-[15px] md:text-[16px] text-alt! mb-8">
              Zero waste. Nothing left.
            </p>
            <button className="px-8 py-[10px] bg-red text-white! alt text-[15px] rounded-[12px] cursor-pointer hover:bg-red/90 transition-all duration-150 ease-out">
              Join the waitlist
            </button>
          </div>
        </section>



        {/* SECTION 3: THE SOLUTION */}
        <section className="w-full max-w-[940px] px-4 md:px-10 pt-[32px] md:pt-[48px] pb-[48px] md:pb-[80px]">

          {/* Header */}
          <div className="flex flex-col items-center text-center mb-[56px] md:mb-[72px]">
            <span className="inline-flex items-center alt text-[11px] uppercase tracking-[0.08em] text-red bg-red/8 border border-red/15 rounded-full px-3 py-1 mb-5">
              The Solution
            </span>
            <h2 className="title text-[32px] md:text-[42px] lg:text-[52px] leading-[1.06] tracking-[-0.04em]! mb-4 max-w-[560px] capitalize!">
              HOW SAPONE WORKS
            </h2>
            <p className="alt text-[15px] md:text-[16px] text-alt! max-w-[360px] leading-relaxed">
              One bar. Two functions. Zero waste left behind.
            </p>
          </div>

          {/* 3-step visual */}
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-[56px] md:mb-[72px]">

            {/* Connecting line — desktop only */}
            <div className="hidden md:block absolute top-[52px] left-[calc(33.3%+12px)] right-[calc(33.3%+12px)] h-px bg-border z-0" />

            {/* Step 1 */}
            <article className="relative z-10 flex flex-col bg-white/70 border border-border rounded-[16px] p-6 md:p-7">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 shrink-0 rounded-full bg-red/10 border border-red/20 flex items-center justify-center">
                  <span className="title text-[15px] text-red leading-none">1</span>
                </span>
                <div className="h-px flex-1 bg-border md:hidden" />
              </div>
              <h3 className="title text-[19px] md:text-[21px] leading-[1.15] tracking-[-0.02em] mb-2">
                Lather on hands & body
              </h3>
              <p className="alt text-[13px] md:text-[14px] text-alt leading-relaxed">
                Use it exactly like a regular soap bar. The rich lather cleanses your skin as usual.
              </p>
            </article>

            {/* Step 2 */}
            <article className="relative z-10 flex flex-col bg-white/70 border border-border rounded-[16px] p-6 md:p-7">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 shrink-0 rounded-full bg-red/10 border border-red/20 flex items-center justify-center">
                  <span className="title text-[15px] text-red leading-none">2</span>
                </span>
                <div className="h-px flex-1 bg-border md:hidden" />
              </div>
              <h3 className="title text-[19px] md:text-[21px] leading-[1.15] tracking-[-0.02em] mb-2">
                Shampoo reveals inside
              </h3>
              <p className="alt text-[13px] md:text-[14px] text-alt leading-relaxed">
                As the outer layer dissolves, a concentrated shampoo core is exposed — ready to use.
              </p>
            </article>

            {/* Step 3 */}
            <article className="relative z-10 flex flex-col bg-white/70 border border-border rounded-[16px] p-6 md:p-7">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 shrink-0 rounded-full bg-red/10 border border-red/20 flex items-center justify-center">
                  <span className="title text-[15px] text-red leading-none">3</span>
                </span>
                <div className="h-px flex-1 bg-border md:hidden" />
              </div>
              <h3 className="title text-[19px] md:text-[21px] leading-[1.15] tracking-[-0.02em] mb-2">
                Use for hair
              </h3>
              <p className="alt text-[13px] md:text-[14px] text-alt leading-relaxed">
                Apply the shampoo core to your hair. Zero plastic bottles. Zero waste. Nothing left.
              </p>
            </article>
          </div>

          {/* Video placeholder */}
          <div className="w-full rounded-[20px] overflow-hidden border border-border bg-white/60 aspect-video flex flex-col items-center justify-center gap-4 relative">
            <div className="w-14 h-14 rounded-full bg-red flex items-center justify-center shadow-md">
              {/* Play icon */}
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M6 4.5L16 10L6 15.5V4.5Z" fill="white" />
              </svg>
            </div>
            <div className="text-center">
              <p className="title text-[16px] md:text-[18px] tracking-[-0.02em] mb-1">15-second demo</p>
              <p className="alt text-[13px] text-alt!">Soap dissolving → shampoo reveal</p>
            </div>
            <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_40px,rgb(0,0,0,0.015)_40px,rgb(0,0,0,0.015)_41px)] pointer-events-none" />
          </div>

        </section>

        {/* SECTION 4: FAQ */}
        <section className="w-full max-w-[740px] px-4 md:px-10 pt-[48px] md:pt-[72px] pb-[96px] md:pb-[140px]">

          <div className="text-center mb-[48px] md:mb-[64px]">
            <h2 className="title text-[32px] md:text-[46px] leading-[1.06] tracking-[-0.04em]!">
              Your questions answered
            </h2>
          </div>

          <div className="flex flex-col">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i
              return (
                <div key={i} className="border-t border-border last:border-b">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="group w-full flex items-center justify-between gap-6 py-5 text-left cursor-pointer"
                  >
                    <span className={`alt text-[15px] md:text-[17px] font-medium transition-colors duration-150 ${isOpen ? 'text-red' : 'text-text'} group-hover:underline decoration-border underline-offset-4`}>
                      {faq.q}
                    </span>
                    <Motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="shrink-0 w-5 h-5 flex items-center justify-center text-red text-[22px] leading-none select-none"
                    >
                      +
                    </Motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <Motion.div
                        key="answer"
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <Motion.div
                          initial={{ opacity: 0, y: -6, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -4, scale: 0.97 }}
                          transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                          className="origin-top"
                        >
                          <div className="pb-5 pr-10">
                            <p className="alt text-[13px] md:text-[14px] text-alt leading-relaxed">
                              {faq.a}
                            </p>
                            {faq.bullets && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {faq.bullets.map((b, j) => (
                                  <span key={j} className="alt text-[12px] text-text bg-red/6 border border-red/12 rounded-full px-3 py-1">
                                    {b}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </Motion.div>
                      </Motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>

          <div className="flex justify-center mt-[48px]">
            <button className="px-10 py-[11px] bg-red text-white! alt text-[15px] rounded-[12px] cursor-pointer hover:bg-red/90 transition-all duration-150 ease-out">
              Join the waitlist
            </button>
          </div>

        </section>

      </div>

      {/* SECTION 5: STACKING TRUST CARDS — outside overflow wrapper so sticky works */}
      <TrustStackSection />

      {/* SECTION 6: INGREDIENTS */}
      <IngredientsSection />

      {/* SECTION 7: ABOUT */}
      <AboutSection />

      {/* SECTION 8: FINAL CTA */}
      <FinalCtaSection />

      {/* FOOTER */}
      <SiteFooter />

    </main>
  )
}

export default App
