import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion as Motion, useScroll, useTransform } from 'framer-motion'
import { Tv, Package, Globe, ShieldCheck, Leaf, Truck } from 'lucide-react'

const baseUrl = import.meta.env.BASE_URL
const SAPONE_LAUNCH_DATE = '20260317'
const SAPONE_LAUNCH_EVENT_URL = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Sapone Launch')}&dates=${SAPONE_LAUNCH_DATE}/${'20260318'}&details=${encodeURIComponent('Sapone officially launches today.')}&location=${encodeURIComponent('Online')}`

const MAILERLITE_API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiN2I1OWQ0Y2Q2NmNmNmI3YTExYWNmZTAzMGNkM2NjYmVmYTQ4MDExYjI3OGI0NDA5MDExYTk0NzI4YjZiODBkMmJiMzNlNmE4ODE4NGRhYmYiLCJpYXQiOjE3NzI2MTIzNjUuMTc4OTYsIm5iZiI6MTc3MjYxMjM2NS4xNzg5NjMsImV4cCI6NDkyODI4NTk2NS4xNzI1ODYsInN1YiI6IjIxNzY2ODkiLCJzY29wZXMiOltdfQ.RNaemqn2z2_-rBzjPqqZmQq1V9PPziqBEe9lOG6c6BtqIxsdALu4HtFBVGw74vHI1BeOwizZX6pUSEIEQPqpO8n7Jg5HNJeaasc6JcPFAZgUv4Pvg0emkaouf_H8AT9RUZSJSo1fQ7thTy_YrzFqUfTmuSYPvGbuymj1phk1WZlle6Bp50Oqw9ZL8wpxTGotO_b15NrauThExmhcKU4_JpmmEdJsgbGMj_qaWIPmqMvNSm9iKh0J4N_eq9dyC6SDWlJVE6pruCKllyWT3SrjiyXuaU7EfckFL8EZL06JS7PTKlJ8JtVoHljf_rj0eAXKpjkaC5TziCdCCZAZ6fHEFxEFikI6vu-VarBmg8l_vFR9Hipnszy-c8VvyJootir6elhdv788X23_3qcqfyHzepSCXv3N8srvSKDZjJt-b-8uOXoMjfL5YeuqYFjDa-j4xZKyUSVhPxWhKHnZL7QudYnCovhXdX2BoPcpo5MSwTgCMEExDx25G9B8iM8LGpYg-tmKQJlDpmSk7n7S34ifBwL7v2D8Jxxf0X5deLJr8B0dGoU4ovyyCMa4Cl-jgRXxrRDMy377wJwlv49ZqRXG0vN-3TFr4aETtTN0Ep_Z6BSAxNCLRphe7qu61LhJ5dLSfbDyDv8aiqsSm3RDU2S4QjT6WVRUbs8ozonfkTx_acA'
const MAILERLITE_GROUP_ID = '180952494130595440'

async function subscribeToMailerLite(email) {
  const res = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
      'Accept': 'application/json',
    },
    body: JSON.stringify({ email, groups: [MAILERLITE_GROUP_ID] }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || 'Subscription failed. Please try again.')
  }
}
const carouselFiles = Array.from({ length: 20 }, (_, i) => ({
  file: `${String(i + 1).padStart(2, '0')}.webp`,
  width: 720,
  height: 960,
}))
const carouselCards = carouselFiles.map(({ file, width, height }) => ({
  src: encodeURI(`${baseUrl}scroller/${file}`),
  width,
  height,
}))

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
  { image: `${baseUrl}cards/02.webp`, label: 'Shark Tank vetted and publicly validated', rotate: 1.1, Icon: Tv },
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
    <section className="w-full px-4 md:px-10 pt-[72px] md:pt-[112px] pb-[72px] md:pb-[92px]">
      <div className="max-w-[980px] mx-auto">

        {/* Top: left copy + right image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-5 items-stretch">

          {/* Left */}
          <Reveal className="flex flex-col">
            <span className="inline-flex items-center alt text-[11px] uppercase tracking-[0.08em] text-red bg-red/8 border border-red/15 rounded-full px-3 py-1 mb-5 w-fit">
              Ingredients
            </span>
            <h2 className="title text-[24px] md:text-[36px] leading-[1.06] tracking-[-0.04em]! mb-8 max-w-[480px] uppercase">
              91% Natural Origin Formula
            </h2>
            <ul className="flex flex-col gap-3.5 mb-9 flex-1">
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
          </Reveal>

          {/* Right: image/video placeholder — full height */}
          <Reveal delay={0.12} className="rounded-[20px] bg-white/60 border border-border flex items-center justify-center min-h-[320px]">
            <p className="alt text-[12px] text-alt/50 tracking-wide uppercase">Image / Video</p>
          </Reveal>
        </div>

        {/* NO row — 3 equal columns */}
        <Reveal delay={0.08} className="grid grid-cols-3 gap-2.5 mt-8 mb-5">
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
        </Reveal>

        {/* Full ingredient list — collapsible */}
        <Reveal delay={0.1} className="flex flex-col items-center mt-3">
          <button
            onClick={() => setListOpen(!listOpen)}
            className="flex items-center gap-1.5 alt text-[13px] text-alt hover:text-text transition-colors duration-150 cursor-pointer py-2"
          >
            See full ingredient list
            <Motion.span
              animate={{ rotate: listOpen ? 90 : 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
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
        </Reveal>

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

          {/* Left: image placeholder — full height of right column */}
          <Reveal delay={0.14} className="rounded-[20px] bg-white/60 border border-border w-full flex items-center justify-center order-2 lg:order-1 min-h-[320px]">
            <p className="alt text-[12px] text-alt/50 tracking-wide uppercase">Image</p>
          </Reveal>

          {/* Right: story */}
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
                <button className="px-8 py-[10px] bg-red text-white! alt text-[15px] rounded-[12px] cursor-pointer hover:bg-red/90 transition-all duration-150 ease-out">
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
    img: null,
  },
  {
    stat: '450',
    unit: 'years',
    headline: '450 years to decompose',
    desc: 'One bottle used for 5 minutes. Polluting for 450 years.',
    img: null,
  },
  {
    stat: '91%',
    unit: 'never recycled',
    headline: '91% of plastic is never recycled',
    desc: 'Nearly all plastic bottles end up in landfills or the ocean.',
    img: null,
  },
  {
    stat: '480',
    unit: 'bottles lifetime',
    headline: '480 bottles in your lifetime',
    desc: 'Just from shampoo alone — before counting everything else.',
    img: null,
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
        {/* Left/Right grid */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch">

          {/* LEFT */}
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

            {/* Cards with vertical progress bar on left */}
            <div className="flex flex-col gap-2 flex-1">
              {PROBLEM_ITEMS.map((item, i) => (
                <Reveal key={i} delay={0.14 + i * 0.08} className="flex items-stretch gap-2.5">
                  {/* Vertical progress track */}
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
                  {/* Card */}
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

          {/* RIGHT: image — full height matching left column */}
          <Reveal delay={0.15} className="w-full lg:w-[400px] xl:w-[440px] shrink-0">
            <div className="relative w-full h-full min-h-[340px] lg:min-h-0 rounded-[20px] overflow-hidden bg-[#e8e4da]">
              <AnimatePresence mode="wait">
                <Motion.div
                  key={active}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {/* Stat as giant watermark — replace with real image later */}
                  <span className="title leading-none tracking-[-0.05em] text-[#1b1b1f]/[0.08] select-none" style={{ fontSize: 'clamp(100px, 18vw, 160px)' }}>
                    {PROBLEM_ITEMS[active].stat}
                  </span>
                </Motion.div>
              </AnimatePresence>

              {/* Active indicator dots */}
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

function SuccessOverlay() {
  const gif = SUCCESS_GIFS[new Date().getDay() % SUCCESS_GIFS.length]

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
      </Motion.div>
    </Motion.div>
  )
}

function FinalCtaSection({ onSuccess }) {
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

        {/* Header */}
        <Reveal className="text-center mb-10">
          <span className="inline-flex items-center alt text-[11px] uppercase tracking-[0.08em] text-[#e8637a] bg-[#862737]/20 border border-[#862737]/30 rounded-full px-3 py-1 mb-5 w-fit">
            Limited Early Access
          </span>
          <h2 className="title text-[24px] md:text-[36px] leading-[1.04] tracking-[-0.04em]! uppercase text-white">
            Launching March 17th
          </h2>
        </Reveal>

        {/* Inner card — slightly lighter */}
        <Reveal delay={0.1} className="rounded-[22px] bg-white/6 border border-white/8 px-7 py-8 md:px-10 md:py-10">

          {/* Price box */}
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
            Join <span className="font-semibold text-white/80">847+ people</span> already on the waitlist
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
            <button
              type="submit"
              disabled={ctaSubmitting}
              className="w-full h-fit px-[16px] py-[11px] bg-[#862737] text-white! rounded-[12px] alt text-[15px] cursor-pointer hover:bg-[#9e2f42] transition-all duration-150 ease-out disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {ctaSubmitting ? 'Joining...' : 'Get Early Access'}
            </button>
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
  const [submitted, setSubmitted] = useState(false)
  const [heroEmail, setHeroEmail] = useState('')
  const [heroSubmitting, setHeroSubmitting] = useState(false)
  const [heroError, setHeroError] = useState('')

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
        Zero Plastic. Premium Quality. Zero waste.
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
        className="max-w-[320px] w-full h-fit px-[16px] py-[8px] alt bg-white border border-border rounded-[12px] hover:border-red/30 transition-all duration-150 ease-out focus:outline-red focus:ring-0 focus:border-red/30 mb-[12px]"
      />


      <Motion.div
        initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.55, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center justify-center w-full"
      >
        <button
          type="submit"
          disabled={heroSubmitting}
          className="max-w-[320px] w-full h-fit px-[16px] py-[8px] bg-red text-white! rounded-[12px] alt cursor-pointer hover:bg-red/90 transition-all duration-50 ease-out disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {heroSubmitting ? 'Joining...' : 'Join the waitlist!'}
        </button>
      </Motion.div>

      {heroError && (
        <p className="alt text-[13px] mt-2 text-center max-w-[320px]" style={{ color: 'var(--red)' }}>{heroError}</p>
      )}

      <Motion.p
        initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.55, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="alt text-alt/80! text-center text-[14px] mt-[8px]"
      >
        Get early bird access - 40% off for first 500!
      </Motion.p>
    </form>


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





        <ProblemSection />

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
          <Reveal className="relative z-10 text-center max-w-[420px]">
            <h2 className="title text-[32px]   md:text-[36px] leading-[1.08] tracking-[-0.04em]! mb-[8px]">
              WHAT IF THE BOTTLE WAS THE PRODUCT?
            </h2>
            <p className="alt text-[15px] md:text-[16px] text-alt! mb-8">
              Zero waste. Nothing left.
            </p>
            <button className="px-8 py-[10px] bg-red text-white! alt text-[15px] rounded-[12px] cursor-pointer hover:bg-red/90 transition-all duration-150 ease-out">
              Join the waitlist
            </button>
          </Reveal>
        </section>



        {/* SECTION 3: THE SOLUTION */}
        <section className="w-full max-w-[1100px] px-4 md:px-10 pt-[32px] md:pt-[142px] pb-[72px] md:pb-[112px]">

          {/* Header */}
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

          {/* 3-step cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {[
              {
                n: '1',
                title: 'Lather on body first',
                desc: 'Use it exactly like regular soap. The outer layer works up a rich lather to wash your body.',
                delay: 0,
              },
              {
                n: '2',
                title: 'Soap dissolves, shampoo reveals',
                desc: 'As the outer layer wears down with use, a concentrated shampoo core is naturally exposed.',
                delay: 0.08,
              },
              {
                n: '3',
                title: 'Apply to hair. Done.',
                desc: 'Work the shampoo core through your hair. Zero plastic bottles. Zero waste. Nothing left.',
                delay: 0.16,
              },
            ].map(({ n, title, desc, delay }) => (
              <Reveal key={n} delay={delay} className="flex flex-col">
              <article className="flex flex-col bg-white/80 border border-border rounded-[20px] overflow-hidden h-full">
                {/* Media area */}
                <div className="relative w-full aspect-[3/2] bg-[#ece8e0] flex items-center justify-center border-b border-border overflow-hidden">
                  <span className="title text-[80px] leading-none tracking-[-0.04em] text-[#1b1b1f]/[0.06] select-none">{n}</span>
                  <p className="absolute alt text-[11px] text-alt/35 uppercase tracking-widest select-none">Image / Video</p>
                  {/* Step badge */}
                  <div className="absolute top-3.5 left-3.5 flex items-center border border-red gap-1 bg-[#862737]/70 backdrop-blur-sm rounded-full px-2.5 py-1">
                    <span className="alt text-[11px] font-semibold text-white/80 uppercase tracking-[0.06em]">Step</span>
                    <span className="alt text-[12px] font-bold text-white">{n}</span>
                  </div>
                </div>
                {/* Content */}
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

        {/* SECTION 4: FAQ */}
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
              onClick={() => document.getElementById('final-cta')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-[11px] bg-red text-white! alt text-[15px] rounded-[12px] cursor-pointer hover:bg-red/90 transition-all duration-150 ease-out"
            >
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
      <FinalCtaSection onSuccess={() => setSubmitted(true)} />

      {/* FOOTER */}
      <SiteFooter />

      <AnimatePresence>
        {submitted && <SuccessOverlay />}
      </AnimatePresence>

    </main>
  )
}

export default App
