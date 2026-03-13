import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion as Motion, useScroll, useTransform } from 'framer-motion'
import { Tv, Package, Globe, ShieldCheck, Leaf, Truck } from 'lucide-react'

const baseUrl = import.meta.env.BASE_URL

let globalLenis = null
const SAPONE_LAUNCH_DATE = '20260317'
const SAPONE_LAUNCH_EVENT_URL = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Sapone Launch')}&dates=${SAPONE_LAUNCH_DATE}/${'20260318'}&details=${encodeURIComponent('Sapone officially launches today.')}&location=${encodeURIComponent('Online')}`

async function subscribeToMailerLite(email) {
  const res = await fetch('/api/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || 'Subscription failed. Please try again.')
  }
}
const carouselFiles = Array.from({ length: 12 }, (_, i) => ({
  file: `${String(i + 1).padStart(2, '0')}.webp`,
  width: 720,
  height: 960,
}))
const carouselCards = carouselFiles.map(({ file, width, height }) => ({
  src: encodeURI(`${baseUrl}scroller/${file}`),
  width,
  height,
}))
const WAITLIST_BASE_COUNT = 847
const WAITLIST_STORAGE_KEY = 'sapone_waitlist_count_v1'

function usePersistentWaitlistCounter() {
  const [waitlistCount, setWaitlistCount] = useState(WAITLIST_BASE_COUNT)
  const waitlistTimerRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    let cancelled = false
    const storedRaw = window.localStorage.getItem(WAITLIST_STORAGE_KEY)
    const storedCount = Number.parseInt(storedRaw || '', 10)
    if (Number.isFinite(storedCount) && storedCount >= WAITLIST_BASE_COUNT) {
      setWaitlistCount(storedCount)
    } else {
      window.localStorage.setItem(WAITLIST_STORAGE_KEY, String(WAITLIST_BASE_COUNT))
    }

    const queueNextIncrement = () => {
      const delayMs = 2000 + Math.floor(Math.random() * 6001)
      waitlistTimerRef.current = window.setTimeout(() => {
        if (cancelled) return
        setWaitlistCount(prev => {
          const next = prev + 1
          window.localStorage.setItem(WAITLIST_STORAGE_KEY, String(next))
          return next
        })
        queueNextIncrement()
      }, delayMs)
    }

    queueNextIncrement()

    return () => {
      cancelled = true
      if (waitlistTimerRef.current) {
        window.clearTimeout(waitlistTimerRef.current)
      }
    }
  }, [])

  return waitlistCount
}

function scrollToCta() {
  document.getElementById('final-cta')?.scrollIntoView({ behavior: 'smooth' })
}

function Reveal({ children, delay = 0, className }) {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-48px' }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </Motion.div>
  )
}

const stackCards = [
  { image: `${baseUrl}cards/01.webp`, label: "Backed by one of Lithuania's wealthiest investors", rotate: -1.2, Icon: Globe },
  { image: `${baseUrl}cards/03.webp`, label: 'Already shipped 1,000+ units successfully', rotate: -1, Icon: Truck },
  { image: `${baseUrl}cards/04.webp`, label: 'Real company, real product, real commitment', rotate: 1.4, Icon: ShieldCheck },
  { image: `${baseUrl}cards/05.webp`, label: 'Legally binding delivery contract signed', rotate: -0.8, Icon: Package },
]

function TrustCard({ card, index, progress, range, targetScale }) {
  const cardRef = useRef(null)
  const { scrollYProgress: cardProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'start start'],
  })
  const imageScale = useTransform(cardProgress, [0, 1], [1.18, 1])
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
        <div className="px-4 md:px-5 py-3 md:py-4 bg-bg flex items-start gap-3">
          <card.Icon size={16} className="text-red shrink-0 mt-[2px]" strokeWidth={1.8} />
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
  { name: 'Argan Oil', benefit: 'shine & softness' },
  { name: 'Panthenol B5', benefit: 'strengthens, adds elasticity' },
  { name: 'Aloe Vera', benefit: 'soothes & hydrates scalp' },
  { name: 'Amino Acids', benefit: 'restores & protects fiber' },
]

function IngredientsSection({ onVip }) {
  const sectionRef = useRef(null)
  const triggered = useRef(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true
          onVip()
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [onVip])

  function goToIngredients() {
    window.history.pushState(null, '', '/ingredients')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }
  return (
    <section ref={sectionRef} className="w-full px-4 md:px-10 pt-[72px] md:pt-[112px] pb-[72px] md:pb-[92px]">
      <div className="max-w-[980px] mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          <Reveal className="flex flex-col">
            <span className="inline-flex items-center alt text-[11px] uppercase tracking-[0.08em] text-red bg-red/8 border border-red/15 rounded-full px-3 py-1 mb-5 w-fit">
              Ingredients
            </span>
            <h2 className="title text-[24px] md:text-[36px] leading-[1.06] tracking-[-0.04em]! mb-8 max-w-[480px] uppercase">
              What's inside matters most.
            </h2>
            <ul className="flex flex-col gap-3.5 mb-8">
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
            <div className="grid grid-cols-3 gap-2.5 mb-8">
              {['Sulfates', 'Parabens', 'Microplastics'].map((label) => (
                <div key={label} className="flex flex-col items-center justify-center gap-1.5 rounded-[12px] border border-border bg-white/60 px-3 py-3.5 text-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <circle cx="8" cy="8" r="7" stroke="var(--red)" strokeWidth="1.3"/>
                    <path d="M5 5L11 11M11 5L5 11" stroke="var(--red)" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                  <span className="alt text-[12px] md:text-[13px] font-medium text-text leading-tight">
                    <span className="text-red">NO </span>{label}
                  </span>
                </div>
              ))}
            </div>
            <button onClick={scrollToCta} className="w-fit px-8 py-[10px] bg-red text-white! alt text-[15px] rounded-[12px] cursor-pointer hover:bg-red/90 transition-all duration-150 ease-out mb-4">
              Join the waitlist
            </button>
            <button
              onClick={goToIngredients}
              className="flex items-center gap-1.5 alt text-[13px] text-alt hover:text-text transition-colors duration-150 cursor-pointer py-1 underline underline-offset-4 decoration-border w-fit"
            >
              See full ingredient list
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </Reveal>

          <Reveal delay={0.12} className="relative rounded-[20px] overflow-hidden  border border-border self-stretch min-h-[320px] lg:min-h-0">
            <img
              src={`${baseUrl}images/sudetis.webp`}
              alt="Ingredients"
              className="absolute inset-0 w-full h-full object-cover object-center"
              loading="lazy"
              decoding="async"
            />
          </Reveal>
        </div>

      </div>
    </section>
  )
}

function AboutSection() {
  return (
    <section className="w-full px-4 md:px-10 pt-[72px] md:pt-[112px] pb-[80px] md:pb-[128px]">
      <div className="max-w-[980px] mx-auto">

        <Reveal className="flex justify-center mb-5">
          <span className="inline-flex items-center alt text-[11px] uppercase tracking-[0.08em] text-red bg-red/8 border border-red/15 rounded-full px-3 py-1">
            The Story
          </span>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="title text-[24px] md:text-[36px] leading-[1.06] tracking-[-0.04em]! text-center mb-12 md:mb-16 uppercase">
            Built by Teenagers.<br className="hidden md:block" /> Backed by Experts.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-stretch">

          <Reveal delay={0.14} className="relative rounded-[20px] bg-white/60 border border-border w-full overflow-hidden order-2 lg:order-1 min-h-[320px] lg:min-h-0 lg:h-full lg:self-stretch">
            <img
              src={`${baseUrl}images/thestory.webp`}
              alt="The story"
              className="absolute inset-0 block w-full h-full object-cover object-top"
              loading="lazy"
              decoding="async"
            />
          </Reveal>

          <div className="flex flex-col gap-5 order-1 lg:order-2 pt-1">

            <Reveal>
              <p className="alt text-[15px] md:text-[16px] text-text leading-relaxed">
                I'm Paulius, I'm 17, and yes — I'm a bald student who pitched a shampoo brand on{' '}
                <span className="font-semibold text-red">Shark Tank</span>.
              </p>
            </Reveal>

            <Reveal delay={0.07}>
              <p className="alt text-[14px] md:text-[15px] text-alt leading-relaxed">
                It started with a school project and a haunting statistic: 91% of plastic bottles are never recycled.
                We refused to accept that, so we looked for a 'Kinder Surprise' solution — just as Kinder combined
                chocolate and a toy, we combined the two essentials of every bathroom: liquid shampoo protected by
                a solid soap shell.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="alt text-[14px] md:text-[15px] text-alt leading-relaxed">
                We started with $300 and failed 22 times. On the 23rd prototype, we finally cracked the code. We
                sold at local markets, convinced our parents to help us scale with a $1,000 loan, and obsessively
                refined the quality until it was salon-grade.
              </p>
            </Reveal>

            <Reveal delay={0.13}>
              <p className="alt text-[14px] md:text-[15px] text-alt leading-relaxed">
                We took that confidence to{' '}
                <span className="font-semibold text-text">Shark Tank</span>, walked away with an investment, and
                now we're backed by world-class laboratories. We aren't just making a 'green' product — we're making
                the future of hair care. Sustainable, high-performance, and completely plastic-free.
              </p>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="alt text-[15px] md:text-[16px] text-text font-semibold leading-relaxed">
                We're taking Sapone global.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="pt-2">
                <button onClick={scrollToCta} className="px-8 py-[10px] bg-red text-white! alt text-[15px] rounded-[12px] cursor-pointer hover:bg-red/90 transition-all duration-150 ease-out">
                  Join the waitlist
                </button>
              </div>
            </Reveal>

          </div>
        </div>

      </div>
    </section>
  )
}

const PROBLEM_ITEMS = [
  {
    stat: '552M',
    unit: 'bottles / year',
    headline: '552 million shampoo bottles',
    desc: 'sent to landfill every year in the US alone.',
    img: `${baseUrl}images/111.webp`,
  },
  {
    stat: '450',
    unit: 'years',
    headline: '450 years to decompose',
    desc: 'One bottle used for 5 minutes. Polluting for 450 years.',
    img: `${baseUrl}images/222.webp`,
  },
  {
    stat: '91%',
    unit: 'never recycled',
    headline: '91% of plastic is never recycled',
    desc: 'Nearly all plastic bottles end up in landfills or the ocean.',
    img: `${baseUrl}images/333.webp`,
  },
  {
    stat: '480',
    unit: 'bottles lifetime',
    headline: '480 bottles in your lifetime',
    desc: 'The brands filling your shower have known for decades. They chose profit over the planet.',
    img: `${baseUrl}images/444.webp`,
  },
]

function ProblemSection() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % PROBLEM_ITEMS.length), 3000)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="w-full px-4 md:px-10 mt-[72px] md:mt-[128px] mb-[64px] md:mb-[64px]">
      <div className="max-w-[1000px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch">

          <div className="flex-1 min-w-0 flex flex-col">
            <Reveal className="self-center lg:self-start">
              <span className="inline-flex items-center alt text-[11px] uppercase tracking-[0.08em] text-red bg-red/8 border border-red/15 rounded-full px-3 py-1 mb-4 w-fit">
                The Problem
              </span>
            </Reveal>
            <Reveal delay={0.07}>
              <h2 className="title text-[22px] md:text-[28px] lg:text-[34px] uppercase tracking-[-0.04em]! leading-[1.05] mb-6 text-center lg:text-left">
                Your bathroom is<br />drowning the planet.
              </h2>
            </Reveal>

            <div className="flex flex-col gap-2 flex-1">
              {PROBLEM_ITEMS.map((item, i) => (
                <Reveal key={i} delay={0.14 + i * 0.08} className="flex items-stretch gap-2.5">
                  <button
                    onClick={() => setActive(i)}
                    className="w-[3px] shrink-0 rounded-full overflow-hidden bg-border cursor-pointer"
                    aria-label={`Go to stat ${i + 1}`}
                  >
                    <Motion.div
                      className="w-full bg-red rounded-full origin-top"
                      style={{ height: '100%' }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: active === i ? 1 : 0 }}
                      transition={active === i ? { duration: 3, ease: 'linear' } : { duration: 0.15 }}
                    />
                  </button>
                  <button
                    onClick={() => setActive(i)}
                    className={`flex-1 text-left rounded-[14px] px-5 py-4 border transition-all duration-300 cursor-pointer ${
                      active === i
                        ? 'bg-[#1b1b1f] border-[#1b1b1f]'
                        : 'bg-white/60 border-border hover:border-[#1b1b1f]/20 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-baseline gap-2.5">
                      <span className={`title text-[28px] leading-none tracking-[-0.04em] transition-colors duration-300 ${active === i ? 'text-[#f7f4ed]' : 'text-red'}`}>
                        {item.stat}
                      </span>
                      <span className={`alt text-[11px] uppercase tracking-[0.06em] font-medium transition-colors duration-300 ${active === i ? 'text-white/50' : 'text-alt'}`}>
                        {item.unit}
                      </span>
                    </div>
                    <p className={`alt text-[13px] leading-snug mt-1 transition-colors duration-300 ${active === i ? 'text-white/70' : 'text-alt'}`}>
                      {item.desc}
                    </p>
                  </button>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.15} className="w-full lg:w-[400px] xl:w-[440px] shrink-0">
            <div className="relative w-full h-full min-h-[340px] lg:min-h-0 rounded-[20px] overflow-hidden bg-[#e8e4da]">
              <AnimatePresence mode="wait">
                <Motion.div
                  key={active}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0"
                >
                  <img
                    src={PROBLEM_ITEMS[active].img}
                    alt={PROBLEM_ITEMS[active].headline}
                    className="w-full h-full object-cover object-center"
                    decoding="async"
                  />
                </Motion.div>
              </AnimatePresence>

              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
                {PROBLEM_ITEMS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`rounded-full transition-all duration-300 cursor-pointer ${active === i ? 'w-4 h-1.5 bg-[#1b1b1f]' : 'w-1.5 h-1.5 bg-[#1b1b1f]/20'}`}
                  />
                ))}
              </div>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  )
}

const SUCCESS_GIFS = [
  'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif',
  'https://media.giphy.com/media/g9582DNuQppxC/giphy.gif',
  'https://media.giphy.com/media/kyLYXonQYYfwYDIeZl/giphy.gif',
]

function SuccessOverlay({ onBack }) {
  const gif = SUCCESS_GIFS[new Date().getDay() % SUCCESS_GIFS.length]

  useEffect(() => {
    globalLenis?.stop()
    document.body.classList.add('scroll-locked')
    return () => {
      globalLenis?.start()
      document.body.classList.remove('scroll-locked')
    }
  }, [])

  const bottles = [
    { src: `${baseUrl}images/raudonas.webp`, style: { top: '8%', left: '4%' }, rotate: -18, floatDur: 3.2 },
    { src: `${baseUrl}images/geltonas.webp`, style: { top: '8%', right: '4%' }, rotate: 18, floatDur: 3.8 },
    { src: `${baseUrl}images/melynas.webp`, style: { bottom: '8%', left: '4%' }, rotate: -12, floatDur: 4.1 },
    { src: `${baseUrl}images/zalias.webp`, style: { bottom: '8%', right: '4%' }, rotate: 12, floatDur: 3.5 },
  ]

  return (
    <Motion.div
      key="success-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div className="grain" aria-hidden="true" />

      {bottles.map(({ src, style, rotate, floatDur }, i) => (
        <Motion.img
          key={i}
          src={src}
          alt=""
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.55 }}
          animate={{ opacity: 1, scale: 1, rotate, y: [0, -18, 0] }}
          transition={{
            opacity: { duration: 0.5, delay: 0.08 + i * 0.07 },
            scale: { duration: 0.65, delay: 0.08 + i * 0.07, ease: [0.22, 1, 0.36, 1] },
            rotate: { duration: 0.65, delay: 0.08 + i * 0.07 },
            y: { duration: floatDur, delay: 0.6 + i * 0.15, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="absolute w-[78px] md:w-[130px] pointer-events-none select-none"
          style={{ ...style, filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.10))' }}
        />
      ))}

      <Motion.div
        initial={{ opacity: 0, y: 28, filter: 'blur(12px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.65, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center text-center px-8"
      >
        <div
          className="w-[180px] h-[180px] md:w-[220px] md:h-[220px] rounded-[22px] overflow-hidden mb-7 border border-border"
          style={{ boxShadow: '0 10px 48px rgba(0,0,0,0.09)' }}
        >
          <img src={gif} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" />
        </div>

        <h1 className="title text-[38px] md:text-[42px] tracking-[-0.04em] leading-none mb-3 uppercase">
          You're in!
        </h1>
        <p className="alt text-[16px] text-alt max-w-[260px] leading-snug">
          We'll reach out on{' '}
          <span className="font-medium" style={{ color: 'var(--red)' }}>March 17th</span>{' '}
          with your early bird deal.
        </p>

        <button
          onClick={onBack}
          className="alt mt-8 text-[13px] text-alt underline underline-offset-2 opacity-60 hover:opacity-100 transition-opacity"
        >
          ← Back
        </button>
      </Motion.div>
    </Motion.div>
  )
}

function FinalCtaSection({ onSuccess, onVip, waitlistCount }) {
  const [ctaEmail, setCtaEmail] = useState('')
  const [ctaSubmitting, setCtaSubmitting] = useState(false)
  const [ctaError, setCtaError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (ctaSubmitting) return
    setCtaError('')
    setCtaSubmitting(true)
    try {
      await subscribeToMailerLite(ctaEmail)
      onSuccess()
    } catch (err) {
      setCtaError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setCtaSubmitting(false)
    }
  }

  return (
    <section id="final-cta" className="w-full bg-[#27262b] px-4 md:px-10 py-[80px] md:py-[120px]">
      <div className="max-w-[500px] mx-auto">

        <Reveal className="text-center mb-10">
          <span className="inline-flex items-center alt text-[11px] uppercase tracking-[0.08em] text-[#e8637a] bg-[#862737]/20 border border-[#862737]/30 rounded-full px-3 py-1 mb-5 w-fit">
            Limited Early Access
          </span>
          <h2 className="title text-[24px] md:text-[36px] leading-[1.04] tracking-[-0.04em]! uppercase text-white">
            Launching March 17th
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="rounded-[22px] bg-white/6 border border-white/8 px-7 py-8 md:px-10 md:py-10">

          <div className="rounded-[14px] bg-white/9 border border-white/10 px-5 py-4 mb-6 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-2.5 mb-0.5">
                <span className="title text-[44px] leading-none tracking-[-0.04em] text-white">€12</span>
                <span className="alt text-[13px] text-white/40 line-through">€17</span>
              </div>
              <p className="alt text-[12px] text-white/40 leading-snug">Per bottle — early bird price</p>
            </div>
            <span className="alt text-[12px] text-[#e8637a] font-semibold bg-[#862737]/25 border border-[#862737]/35 rounded-full px-3 py-1.5 whitespace-nowrap shrink-0">Save 40%</span>
          </div>
          <p className="alt text-[12px] text-white/35 mb-5 leading-snug">
            First 500 backers only. Price increases after launch.
          </p>

          <p className="alt text-[13px] text-white/50 mb-4">
            Join <span className="font-semibold text-white/80">{waitlistCount.toLocaleString()}+ people</span> already on the waitlist
          </p>

          <form className="flex flex-col gap-2.5 mb-6" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="your@email.com"
              value={ctaEmail}
              onChange={(e) => setCtaEmail(e.target.value)}
              required
              className="w-full h-fit px-[16px] py-[11px] alt bg-white/8 border border-white/12 rounded-[12px] hover:border-white/20 transition-all duration-150 ease-out focus:outline-none focus:border-white/25 text-[15px] text-white placeholder:text-white/30"
            />
            <div className="flex gap-2.5">
              <button
                type="submit"
                disabled={ctaSubmitting}
                className="flex-1 h-fit px-[16px] py-[11px] bg-[#862737] text-white! rounded-[12px] alt text-[15px] cursor-pointer hover:bg-[#9e2f42] transition-all duration-150 ease-out disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {ctaSubmitting ? 'Joining...' : 'Join the waitlist'}
              </button>
              <button
                type="button"
                onClick={onVip}
                className="flex-1 h-fit px-[16px] py-[11px] bg-white text-[#1b1b1f]! rounded-[12px] alt text-[15px] cursor-pointer hover:bg-white/90 transition-all duration-150 ease-out"
              >
                Become VIP
              </button>
            </div>
          </form>

          {ctaError && (
            <p className="alt text-[13px] mb-4 text-center text-[#e8637a]">{ctaError}</p>
          )}

          <ul className="flex flex-col gap-2.5 border-t border-white/8 pt-5">
            {[
              'Launch day notification (March 17th)',
              'Exclusive early bird pricing',
              'Behind-the-scenes updates',
              'First access to new scents',
            ].map((benefit) => (
              <li key={benefit} className="flex items-start gap-2.5">
                <span className="text-[#e8637a] text-[13px] font-bold shrink-0 mt-px">✓</span>
                <span className="alt text-[13px] text-white/55 leading-snug">{benefit}</span>
              </li>
            ))}
          </ul>

        </Reveal>
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
  const [copied, setCopied] = useState(false)
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

      <div className="absolute inset-x-0 top-0 pointer-events-none select-none flex justify-center overflow-hidden pt-16 md:pt-24">
        <span className="title leading-none whitespace-nowrap text-white/5" style={{ fontSize: 'clamp(110px, 28vw, 320px)' }}>
          Sapone
        </span>
      </div>

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

      <div className="hidden md:block absolute inset-x-0 top-0 bottom-[57px] pointer-events-none select-none z-15" aria-hidden="true">
        <Motion.div style={{ y: bottle0Y, rotate: -13 }} className="absolute left-[1%] bottom-0 w-[170px] lg:w-[210px]">
          <img src={`${baseUrl}images/raudonas.webp`} alt="" className="w-full h-auto object-contain" loading="lazy" />
        </Motion.div>
        <Motion.div style={{ y: bottle1Y, rotate: 8 }} className="absolute left-[20%] bottom-0 w-[148px] lg:w-[185px]">
          <img src={`${baseUrl}images/geltonas.webp`} alt="" className="w-full h-auto object-contain" loading="lazy" />
        </Motion.div>
        <Motion.div style={{ y: bottle2Y, rotate: -6 }} className="absolute right-[20%] bottom-0 w-[148px] lg:w-[185px]">
          <img src={`${baseUrl}images/zalias.webp`} alt="" className="w-full h-auto object-contain" loading="lazy" />
        </Motion.div>
        <Motion.div style={{ y: bottle3Y, rotate: 12 }} className="absolute right-[1%] bottom-0 w-[170px] lg:w-[210px]">
          <img src={`${baseUrl}images/melynas.webp`} alt="" className="w-full h-auto object-contain" loading="lazy" />
        </Motion.div>
      </div>

      <div className="relative z-20 bg-white/5 backdrop-blur-md border-t border-white/10 px-5 md:px-10 py-5">
        <div className="max-w-[860px] mx-auto flex flex-row items-center justify-between">
          <span className="alt text-[14px] md:text-[15px] text-white/65">© Sapone 2026</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText('hello@sapone.store')
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            }}
            className="alt text-[14px] md:text-[15px] text-white/65 hover:text-white transition-colors duration-150 cursor-pointer"
          >
            {copied ? 'Copied!' : 'hello@sapone.store'}
          </button>
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
    q: "Won't it get slippery in the shower?",
    a: "Fair question. The bar is compact, shaped for grip, and textured to hold under running water, your fingers wrap around it naturally. Tested by real customers and lab-validated.",
  },
  {
    q: 'Is this like that other product that scammed people?',
    a: 'We know about that. We\'re different.',
    bullets: ['Backed by one of Lithuania\'s wealthiest investors', 'Legally binding delivery contract signed', 'Already shipped 1,000+', 'Real company, real product, real commitment'],
  },
]

const VIP_PERKS = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="1" y="5" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M5 5V4a3 3 0 0 1 6 0v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <circle cx="8" cy="9.5" r="1.2" fill="currentColor"/>
      </svg>
    ),
    title: 'Free Soap Dish',
    desc: 'A premium soap dish — yours with your first order. Keeps your bar perfectly dry between uses.',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 1.5L9.8 5.8L14.5 6.3L11.2 9.4L12.1 14L8 11.7L3.9 14L4.8 9.4L1.5 6.3L6.2 5.8L8 1.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'The Surprise Perk',
    desc: 'Every 50th backer is randomly upgraded — order doubled, free tier, mystery color, or a free year subscription.',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M14 8c0 3.314-2.686 6-6 6a5.97 5.97 0 0 1-3.5-1.127L2 13.5l.627-2.5A5.97 5.97 0 0 1 2 8c0-3.314 2.686-6 6-6s6 2.686 6 6Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
        <path d="M5.5 8h5M5.5 6h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Private WhatsApp Community',
    desc: 'Direct line to the founders. Early previews, votes on scents and colors, behind-the-scenes updates.',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 1v4M8 11v4M1 8h4M11 8h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
    title: 'First Access to the Kickstarter',
    desc: 'Hours before the public — and at early backer pricing.',
  },
]

function VipModal({ onClose }) {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [openPerk, setOpenPerk] = useState(null)

  useEffect(() => {
    globalLenis?.stop()
    document.body.classList.add('scroll-locked')
    return () => {
      globalLenis?.start()
      document.body.classList.remove('scroll-locked')
    }
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (submitting) return
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      window.location.href = data.url
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <Motion.div
      key="vip-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
      onClick={onClose}
    >
      <Motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[620px] max-h-[90svh] overflow-y-auto rounded-[24px] border border-border"
        style={{ backgroundColor: 'var(--bg)', scrollbarWidth: 'none', overscrollBehavior: 'contain' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full border border-border text-alt hover:text-text transition-colors cursor-pointer"
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        <div className="p-6 md:p-8">
          {done ? (
            /* Success state */
            <div className="flex flex-col items-center text-center py-8">
              <div className="w-12 h-12 rounded-full bg-red/10 border border-red/20 flex items-center justify-center mb-5">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10.5l4 4 8-8" stroke="var(--red)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="title text-[22px] md:text-[26px] leading-[1.06] tracking-[-0.03em]! uppercase mb-2">You're in.</h3>
              <p className="alt text-[14px] text-alt leading-relaxed max-w-[340px]">
                Welcome to the inner circle. We'll reach out before the Kickstarter goes live — you'll be first.
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-8 py-[11px] bg-red text-white! alt text-[14px] rounded-[12px] cursor-pointer hover:bg-red/90 transition-all duration-150 ease-out"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6 pr-8">
                <span className="inline-flex items-center alt text-[11px] uppercase tracking-[0.08em] text-red bg-red/8 border border-red/15 rounded-full px-3 py-1 mb-4">
                  €1 · Early Believer Access
                </span>
                <h2 className="title text-[22px] md:text-[28px] leading-[1.06] tracking-[-0.04em]! uppercase mb-2">
                  One coffee.<br />A lifetime of bragging rights.
                </h2>
                <p className="alt text-[13px] text-alt leading-relaxed">
                  You're not just joining a waitlist. You're one of the first people to back a Shark Tank-funded brand before it hits global shelves.
                </p>
              </div>

              <div className="mb-6">
                <div className="sm:hidden flex flex-col border border-border rounded-[14px] overflow-hidden divide-y divide-border">
                  {VIP_PERKS.map(({ icon, title, desc }, i) => (
                    <div key={title}>
                      <button
                        type="button"
                        onClick={() => setOpenPerk(openPerk === i ? null : i)}
                        className="w-full flex items-center gap-3 px-4 py-3.5 text-left cursor-pointer bg-white/60"
                      >
                        <span className="shrink-0 text-red">{icon}</span>
                        <span className="alt text-[13px] font-semibold text-text flex-1">{title}</span>
                        <svg
                          width="14" height="14" viewBox="0 0 14 14" fill="none"
                          className={`shrink-0 text-alt transition-transform duration-200 ${openPerk === i ? 'rotate-180' : ''}`}
                        >
                          <path d="M2 5l5 5 5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <AnimatePresence initial={false}>
                        {openPerk === i && (
                          <Motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden bg-white/60"
                          >
                            <p className="alt text-[12px] text-alt leading-relaxed px-4 pt-3 pb-4">{desc}</p>
                          </Motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

                <div className="hidden sm:grid sm:grid-cols-2 gap-2.5">
                  {VIP_PERKS.map(({ icon, title, desc }) => (
                    <div key={title} className="flex gap-3 rounded-[14px] border border-border bg-white/60 px-4 py-3.5">
                      <span className="shrink-0 mt-px text-red">{icon}</span>
                      <div>
                        <p className="alt text-[13px] font-semibold text-text mb-0.5">{title}</p>
                        <p className="alt text-[11px] text-alt leading-snug">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full h-fit px-[16px] py-[11px] alt bg-white border border-border rounded-[12px] hover:border-red/30 transition-all duration-150 ease-out focus:outline-none focus:border-red/30 text-[15px] text-text placeholder:text-alt/40"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-fit px-[16px] py-[11px] bg-[#27262b] text-white! alt text-[15px] rounded-[12px] cursor-pointer hover:bg-[#333138] transition-all duration-150 ease-out disabled:opacity-60"
                >
                  {submitting ? 'Redirecting to payment...' : 'Claim My €1 VIP Spot →'}
                </button>
                {error && <p className="alt text-[12px] text-red">{error}</p>}
                <p className="alt text-[11px] text-alt text-center">
                  Secure €1 · One-time · Via Stripe
                </p>
              </form>
            </>
          )}
        </div>
      </Motion.div>
    </Motion.div>
  )
}

function VipSuccess() {
  const [status, setStatus] = useState('loading') // 'loading' | 'success' | 'error'
  const [email, setEmail] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const sessionId = params.get('session_id')

    if (!sessionId) {
      setStatus('error')
      return
    }

    fetch(`/api/confirm-vip?session_id=${encodeURIComponent(sessionId)}`)
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.error || 'Verification failed')
        setEmail(data.email || '')
        setStatus('success')
      })
      .catch(() => setStatus('error'))
  }, [])

  if (status === 'loading') {
    return (
      <div className="min-h-svh flex flex-col items-center justify-center gap-5" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="grain" aria-hidden="true" />
        <svg
          className="animate-spin text-red"
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="18" cy="18" r="15" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.2" />
          <path d="M18 3a15 15 0 0 1 15 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <p className="alt text-[15px] text-alt">Confirming your VIP status...</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-svh flex flex-col items-center justify-center gap-5 px-4" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="grain" aria-hidden="true" />
        <p className="title text-[22px] uppercase">Something went wrong.</p>
        <p className="alt text-[14px] text-alt text-center max-w-[320px]">We couldn't confirm your payment. Please contact us at hello@sapone.store.</p>
        <a href="/" className="alt text-[14px] text-red underline underline-offset-2 mt-2">← Back to homepage</a>
      </div>
    )
  }

  return (
    <div className="min-h-svh flex flex-col items-center justify-center px-4 py-16" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="grain" aria-hidden="true" />
      <div className="relative z-10 w-full max-w-[560px] mx-auto flex flex-col items-center text-center">

        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="w-[72px] h-[72px] rounded-full bg-red/8 border border-red/20 flex items-center justify-center mb-7"
        >
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
            <path d="M6 26h24M7 14l5 7 6-9 6 9 5-7-2 12H9L7 14Z" stroke="var(--red)" strokeWidth="1.8" strokeLinejoin="round"/>
            <circle cx="7" cy="13" r="2" fill="var(--red)"/>
            <circle cx="18" cy="10" r="2" fill="var(--red)"/>
            <circle cx="29" cy="13" r="2" fill="var(--red)"/>
          </svg>
        </Motion.div>

        <Motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.07, ease: [0.22, 1, 0.36, 1] }}
          className="title text-[36px] md:text-[52px] leading-[1.04] tracking-[-0.04em]! uppercase mb-5"
        >
          You're officially VIP.
        </Motion.h1>

        {email && (
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white/60 px-4 py-2 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-red shrink-0" />
            <span className="alt text-[13px] text-text">{email}</span>
          </Motion.div>
        )}

        <Motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="alt text-[15px] md:text-[16px] text-alt leading-relaxed max-w-[440px] mb-10"
        >
          Welcome to the inner circle. You backed us before the world knew — and we won't forget that.
        </Motion.p>

        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-2 gap-2.5 w-full mb-10"
        >
          {VIP_PERKS.map(({ icon, title }) => (
            <div key={title} className="flex items-center gap-3 rounded-[14px] border border-border bg-white/60 px-4 py-3.5">
              <span className="shrink-0 text-red">{icon}</span>
              <p className="alt text-[13px] font-semibold text-text text-left">{title}</p>
            </div>
          ))}
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <a
            href="/"
            className="inline-flex items-center justify-center px-8 py-[11px] bg-[#27262b] text-white! alt text-[15px] rounded-[12px] hover:bg-[#333138] transition-all duration-150 ease-out"
          >
            Back to homepage →
          </a>
        </Motion.div>

      </div>
    </div>
  )
}

function App() {
  const [page] = useState(() => window.location.pathname === '/vip-success' ? 'vip-success' : 'home')
  const [showCarousel, setShowCarousel] = useState(false)
  const longCarousel = useMemo(
    () => [...carouselCards, ...carouselCards],
    [],
  )

  const [openFaq, setOpenFaq] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [showVip, setShowVip] = useState(false)
  const [heroEmail, setHeroEmail] = useState('')
  const [heroSubmitting, setHeroSubmitting] = useState(false)
  const [heroError, setHeroError] = useState('')
  const waitlistCount = usePersistentWaitlistCounter()

  const handleHeroSubmit = async (e) => {
    e.preventDefault()
    if (heroSubmitting) return
    setHeroError('')
    setHeroSubmitting(true)
    try {
      await subscribeToMailerLite(heroEmail)
      setSubmitted(true)
    } catch (err) {
      setHeroError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setHeroSubmitting(false)
    }
  }

  const perspectiveSectionRef = useRef(null)
  const { scrollYProgress: pProgress } = useScroll({
    target: perspectiveSectionRef,
    offset: ['start end', 'end start'],
  })
  const img1Y = useTransform(pProgress, [0, 1], [200, -320])
  const img2Y = useTransform(pProgress, [0, 1], [160, -260])
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
      globalLenis = lenis

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
      globalLenis = null
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

  if (page === 'vip-success') return <VipSuccess />

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
        <a
          href={SAPONE_LAUNCH_EVENT_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Add Sapone launch to Google Calendar"
          className="flex ml-[8px] items-center cursor-pointer justify-center flex-row hover:opacity-80 gap-0.5"
        >
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
        Zero Plastic. 95% Natural. Zero waste.
      </Motion.p>
    </div>

    <form
      className="flex items-center w-full justify-center flex-col mb-[72px] md:mb-[112px]"
      onSubmit={handleHeroSubmit}
    >
      <Motion.input
        initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.55, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        type="email"
        placeholder="Enter your email"
        value={heroEmail}
        onChange={(e) => setHeroEmail(e.target.value)}
        required
        className="max-w-[480px] w-full h-fit px-[16px] py-[10px] alt bg-white border border-border rounded-[12px] hover:border-red/30 transition-all duration-150 ease-out focus:outline-red focus:ring-0 focus:border-red/30 mb-[10px]"
      />

      <Motion.div
        initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.55, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center justify-center gap-2.5 w-full max-w-[480px]"
      >
        <button
          type="submit"
          disabled={heroSubmitting}
          className="flex-1 h-fit px-[16px] py-[10px] bg-red text-white! rounded-[12px] alt text-[15px] cursor-pointer hover:bg-red/90 transition-all duration-150 ease-out disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {heroSubmitting ? 'Joining...' : 'Join the waitlist'}
        </button>
        <button
          type="button"
          onClick={() => setShowVip(true)}
          className="flex-1 h-fit px-[16px] py-[10px] bg-[#27262b] text-white! rounded-[12px] alt text-[15px] cursor-pointer hover:bg-[#333138] transition-all duration-150 ease-out"
        >
          Become VIP
        </button>
      </Motion.div>

      {heroError && (
        <p className="alt text-[13px] mt-2 text-center max-w-[480px]" style={{ color: 'var(--red)' }}>{heroError}</p>
      )}

      <Motion.div
        initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.55, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-0.5 mt-[10px]"
      >
        <p className="alt text-alt/60! text-center text-[13px]">
          Free to join. No spam, ever.
        </p>
        <p className="alt text-text font-semibold text-center text-[13px]">
        Only 500 spots · Free soap dish · Early access · Direct line to the founders.{' '}
          <button
            type="button"
            onClick={() => setShowVip(true)}
            className="text-red underline underline-offset-2 decoration-red/40 hover:decoration-red transition-colors cursor-pointer font-semibold"
          >
            Claim yours →
          </button>
        </p>
      </Motion.div>
    </form>

    <Motion.section
      initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.55, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="w-full mb-[8px]"
    >
      <div className="mx-auto grid w-full max-w-[820px] grid-cols-2 gap-1 md:grid-cols-4 md:gap-1">
          <article className="rounded-[12px] border border-border bg-white/80 px-3 py-2 md:px-3.5 md:py-2">
            <p className="alt text-[19px] leading-[1.06] tracking-[-0.02em] text-red md:text-[20px]">{waitlistCount.toLocaleString()}+</p>
            <p className="alt mt-0.5 text-[11px] text-alt/80">Signed up</p>
          </article>
          
          <article className="rounded-[12px] border border-border bg-white/80 px-3 py-2 md:px-3.5 md:py-2">
            <p className="alt text-[19px] leading-[1.06] tracking-[-0.02em] text-red md:text-[20px] ">SHARK TANK</p>
            <p className="alt mt-0.5 text-[11px] text-alt/80">Featured on</p>
          </article>
          <article className="rounded-[12px] border border-border bg-white/80 px-3 py-2 md:px-3.5 md:py-2">
            <p className="alt text-[19px] leading-[1.06] tracking-[-0.02em] text-red md:text-[20px]">1000+</p>
            <p className="alt mt-0.5 text-[11px] text-alt/80">Pieces sold</p>
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

      <div className="flex items-center gap-3 mt-4 mb-10">
        <span className="text-[13px] alt text-muted-foreground tracking-wide">Follow us:</span>
        <a
          href="https://www.instagram.com/sapone_global/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="text-red opacity-100 hover:opacity-50 transition-opacity duration-150"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </a>
        <a
          href="https://www.tiktok.com/@sapone_global"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="TikTok"
          className="text-red opacity-100 hover:opacity-50 transition-opacity duration-150"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
          </svg>
        </a>
      </div>

        <ProblemSection />

        <section
          ref={perspectiveSectionRef}
          className="relative w-full min-h-screen lg:min-h-[70vh] flex items-center justify-center"
        >
          <Motion.figure
            style={{ y: img1Y }}
            className="hidden lg:block absolute top-[26%] left-[11%] w-[138px] aspect-4/5 rounded-[16px] overflow-hidden m-0 -rotate-12"
          >
            <img src={`${baseUrl}images/geltonas.webp`} alt="Sapone product" className="size-full object-cover" loading="lazy" decoding="async" />
          </Motion.figure>

          <Motion.figure
            style={{ y: img2Y }}
            className="hidden lg:block absolute top-[18%] right-[10%] w-[145px] aspect-4/5 rounded-[16px] overflow-hidden m-0 rotate-9"
          >
            <img src={`${baseUrl}images/melynas.webp`} alt="Sapone product" className="size-full object-cover" loading="lazy" decoding="async" />
          </Motion.figure>

          <Motion.figure
            style={{ y: img3Y }}
            className="hidden lg:block absolute top-[63%] left-[24%] w-[215px] aspect-3/4 rounded-[16px] overflow-hidden m-0 -rotate-5"
          >
            <img src={`${baseUrl}images/zalias.webp`} alt="Sapone product" className="size-full object-cover" loading="lazy" decoding="async" />
          </Motion.figure>

          <Motion.figure
            style={{ y: img4Y }}
            className="hidden lg:block absolute top-[67%] right-[23%] w-[200px] aspect-3/4 rounded-[16px] overflow-hidden m-0 rotate-7"
          >
            <img src={`${baseUrl}images/raudonas.webp`} alt="Sapone product" className="size-full object-cover" loading="lazy" decoding="async" />
          </Motion.figure>

          <Motion.figure
            style={{ y: img1Y }}
            className="lg:hidden absolute top-[2%] left-[-2%] w-[145px] aspect-3/4 rounded-[16px] overflow-hidden m-0 z-20 -rotate-6"
          >
            <img src={`${baseUrl}images/melynas.webp`} alt="Sapone product" className="size-full object-cover" loading="lazy" decoding="async" />
          </Motion.figure>

          <Motion.figure
            style={{ y: img2Y }}
            className="lg:hidden absolute top-[14%] right-[-2%] w-[118px] aspect-3/4 rounded-[16px] overflow-hidden m-0 z-20 rotate-12"
          >
            <img src={`${baseUrl}images/zalias.webp`} alt="Sapone product" className="size-full object-cover" loading="lazy" decoding="async" />
          </Motion.figure>

          <Motion.figure
            style={{ y: img3Y }}
            className="lg:hidden absolute bottom-[2%] left-[0%] w-[150px] aspect-3/4 rounded-[16px] overflow-hidden m-0 z-20 rotate-6"
          >
            <img src={`${baseUrl}images/geltonas.webp`} alt="Sapone product" className="size-full object-cover" loading="lazy" decoding="async" />
          </Motion.figure>

          <Motion.figure
            style={{ y: img4Y }}
            className="lg:hidden absolute bottom-[13%] right-[-1%] w-[125px] aspect-3/4 rounded-[16px] overflow-hidden m-0 z-20 -rotate-12"
          >
            <img src={`${baseUrl}images/raudonas.webp`} alt="Sapone product" className="size-full object-cover" loading="lazy" decoding="async" />
          </Motion.figure>

          <Reveal className="relative z-10 text-center max-w-[420px]">
            <h2 className="title text-[32px]   md:text-[36px] leading-[1.08] tracking-[-0.04em]! mb-[8px]">
              WHAT IF THE BOTTLE WAS THE PRODUCT?
            </h2>
            <p className="alt text-[15px] md:text-[16px] text-alt! mb-8">
              Zero waste. Nothing left.
            </p>
            <button onClick={scrollToCta} className="px-8 py-[10px] bg-red text-white! alt text-[15px] rounded-[12px] cursor-pointer hover:bg-red/90 transition-all duration-150 ease-out">
              Join the waitlist
            </button>
          </Reveal>
        </section>

        <section className="w-full max-w-[1100px] px-4 md:px-10 pt-[32px] md:pt-[142px] pb-[72px] md:pb-[112px]">

          <Reveal className="flex flex-col items-center text-center mb-[48px] md:mb-[64px]">
            <span className="inline-flex items-center alt text-[11px] uppercase tracking-[0.08em] text-red bg-red/8 border border-red/15 rounded-full px-3 py-1 mb-5">
              The Solution
            </span>
            <h2 className="title text-[24px] md:text-[36px] leading-[1.06] tracking-[-0.04em]! mb-4 max-w-[560px] uppercase">
              HOW SAPONE WORKS
            </h2>
            <p className="alt text-[15px] md:text-[16px] text-alt! max-w-[360px] leading-relaxed">
              One bar. Two functions. Zero waste left behind.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {[
              {
                n: '1',
                title: 'WASH YOUR HAIR',
                desc: 'Start with the shampoo core. Work it through wet hair exactly like a regular shampoo — rich lather, full clean.',
                delay: 0,
                video: '/video/step1.mp4',
              },
              {
                n: '2',
                title: 'WASH YOUR BODY',
                desc: 'The outer soap layer is right there. No second product needed. Lather up and wash your body with the same bar.',
                delay: 0.08,
                video: '/video/step2.mp4',
              },
              {
                n: '3',
                title: 'NOTHING LEFT BEHIND',
                desc: "As the shampoo core is used up, only a tiny sliver of soap remains — and then that's gone too. No bottle. No waste. Nothing left behind.",
                delay: 0.16,
                video: null,
              },
            ].map(({ n, title, desc, delay, video }) => (
              <Reveal key={n} delay={delay} className="flex flex-col">
              <article className="flex flex-col bg-white/80 border border-border rounded-[20px] overflow-hidden h-full">
                <div className="relative w-full aspect-square bg-[#ece8e0] flex items-center justify-center border-b border-border overflow-hidden">
                  {video ? (
                    <video
                      src={video}
                      autoPlay
                      muted
                      loop
                      playsInline
                      disablePictureInPicture
                      disableRemotePlayback
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                      tabIndex={-1}
                    />
                  ) : (
                    <>
                      <span className="title text-[80px] leading-none tracking-[-0.04em] text-[#1b1b1f]/[0.06] select-none">{n}</span>
                      <p className="absolute alt text-[11px] text-alt/35 uppercase tracking-widest select-none">Image / Video</p>
                    </>
                  )}
                  <div className="absolute top-3.5 left-3.5 flex items-center border border-red gap-1 bg-[#862737]/70 backdrop-blur-sm rounded-full px-2.5 py-1">
                    <span className="alt text-[11px] font-semibold text-white/80 uppercase tracking-[0.06em]">Step</span>
                    <span className="alt text-[12px] font-bold text-white">{n}</span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="title text-[18px] md:text-[20px] leading-[1.15] tracking-[-0.02em] mb-2.5 uppercase">
                    {title}
                  </h3>
                  <p className="alt text-[14px] !text-alt leading-relaxed flex-1">
                    {desc}
                  </p>
                </div>
              </article>
              </Reveal>
            ))}
          </div>

        </section>

        <section className="w-full">
          <div className="max-w-[1080px] mx-auto px-4 md:px-10">

            <div className="hidden lg:grid lg:grid-cols-[1.1fr_1fr] gap-16 py-[72px] md:py-[112px]">

              <div className="self-start sticky" style={{ top: 'calc(50svh - 150px)' }}>
                <Reveal className="w-full">
                  <div className="relative rounded-[20px] overflow-hidden bg-[#ece8e0] border border-border aspect-video flex items-center justify-center">
                    <video
                      className="absolute inset-0 w-full h-full object-cover"
                      src={`${baseUrl}video/sharktank.mp4`}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                    />
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-bg/90 backdrop-blur-sm border border-border rounded-full px-3.5 py-2">
                      <Tv size={13} className="text-red shrink-0" strokeWidth={1.8} />
                      <span className="alt text-[12px] font-semibold text-text">Shark Tank — Season 2025</span>
                    </div>
                  </div>
                </Reveal>
              </div>

              <Reveal delay={0.1} className="flex flex-col justify-center">
                <span className="inline-flex items-center alt text-[11px] uppercase tracking-[0.08em] text-red bg-red/8 border border-red/15 rounded-full px-3 py-1 mb-5 w-fit">
                  As seen on Shark Tank
                </span>

                <h2 className="title text-[26px] md:text-[36px] leading-[1.06] tracking-[-0.04em]! mb-6 uppercase">
                  We took Sapone to Shark&nbsp;Tank at 17 — and walked out with a&nbsp;deal.
                </h2>

                <div className="flex flex-col gap-5 alt text-[14px] md:text-[15px] text-alt leading-relaxed">
                  <p>
                    The sharks don't hand out investments. They tear apart your margins, your formula, your market size, your competition. They've seen thousands of pitches. They know when something is real.
                  </p>
                  <p>
                    We got every hard question. Why would someone switch from a bottle they've used their whole life? Can you actually scale this without losing quality?
                    <span className="text-text font-medium"> We had an answer for every single one.</span>
                  </p>
                  <p>
                    The room went quiet when we revealed the numbers —{' '}
                    <span className="text-text font-medium">552 million bottles landfilled every year in the US alone</span>,
                    a $700B beauty industry that has never once offered a real solution, and a product that costs less to produce, lasts longer, and performs at a premium level.
                  </p>
                  <blockquote className="border-l-2 border-red pl-4 text-text">
                    You're one of the first people to back a Shark Tank-funded brand before it hits global shelves.
                  </blockquote>
                  <p>
                    We closed the deal. Since then we've been backed by cosmetic chemists, certified testing labs, and sustainability specialists who helped us take the formula from great to flawless.
                  </p>
                  <p className="text-text font-medium">
                    Sapone has been validated. Now it needs to be launched. This Kickstarter is the moment it goes from a Shark Tank deal to a global brand — and you're here before anyone else.
                  </p>
                </div>
              </Reveal>

            </div>

            <div className="lg:hidden py-[72px]">
              <div className="relative rounded-[20px] overflow-hidden bg-[#ece8e0] border border-border aspect-video flex items-center justify-center mb-8">
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  src={`${baseUrl}video/sharktank.mp4`}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                />
                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-bg/90 backdrop-blur-sm border border-border rounded-full px-3.5 py-2">
                  <Tv size={13} className="text-red shrink-0" strokeWidth={1.8} />
                  <span className="alt text-[12px] font-semibold text-text">Shark Tank — Season 2025</span>
                </div>
              </div>

              <span className="inline-flex items-center alt text-[11px] uppercase tracking-[0.08em] text-red bg-red/8 border border-red/15 rounded-full px-3 py-1 mb-5 w-fit">
                As seen on Shark Tank
              </span>

              <h2 className="title text-[26px] leading-[1.06] tracking-[-0.04em]! mb-6 uppercase">
                We took Sapone to Shark Tank at 17 — and walked out with a deal.
              </h2>

              <div className="flex flex-col gap-5 alt text-[14px] text-alt leading-relaxed">
                <p>
                  The sharks don't hand out investments. They tear apart your margins, your formula, your market size, your competition. They've seen thousands of pitches. They know when something is real.
                </p>
                <p>
                  We got every hard question. Why would someone switch from a bottle they've used their whole life? Can you actually scale this without losing quality?
                  <span className="text-text font-medium"> We had an answer for every single one.</span>
                </p>
                <p>
                  The room went quiet when we revealed the numbers —{' '}
                  <span className="text-text font-medium">552 million bottles landfilled every year in the US alone</span>,
                  a $700B beauty industry that has never once offered a real solution.
                </p>
                <blockquote className="border-l-2 border-red pl-4 italic text-text">
                  "I've been waiting for someone to do this properly."
                </blockquote>
                <p className="text-text font-medium">
                  Sapone has been validated. Now it needs to be launched.
                </p>
              </div>
            </div>

          </div>
        </section>

        <section className="w-full max-w-[740px] px-4 md:px-10 pt-[48px] md:pt-[72px] pb-[96px] md:pb-[128px]">

          <Reveal className="flex flex-col items-center text-center mb-[48px] md:mb-[64px]">
            <span className="inline-flex items-center alt text-[11px] uppercase tracking-[0.08em] text-red bg-red/8 border border-red/15 rounded-full px-3 py-1 mb-5">
              FAQ
            </span>
            <h2 className="title text-[24px] md:text-[36px] leading-[1.06] tracking-[-0.04em]! uppercase">
              Your questions answered
            </h2>
          </Reveal>

          <div className="flex flex-col">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i
              return (
                <Reveal key={i} delay={i * 0.06} className="border-t border-border last:border-b">
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
                </Reveal>
              )
            })}
          </div>

          <div className="flex justify-center mt-[48px]">
            <button
              onClick={scrollToCta}
              className="px-10 py-[11px] bg-red text-white! alt text-[15px] rounded-[12px] cursor-pointer hover:bg-red/90 transition-all duration-150 ease-out"
            >
              Join the waitlist
            </button>
          </div>

        </section>

      </div>

      <TrustStackSection />

      <IngredientsSection onViewFull={() => setShowIngredients(true)} onVip={() => setShowVip(true)} />

      <AboutSection />

      <FinalCtaSection onSuccess={() => setSubmitted(true)} onVip={() => setShowVip(true)} waitlistCount={waitlistCount} />

      <SiteFooter />

      <AnimatePresence>
        {submitted && <SuccessOverlay onBack={() => setSubmitted(false)} />}
        {showVip && <VipModal onClose={() => setShowVip(false)} />}
      </AnimatePresence>

    </main>
  )
}

export default App
