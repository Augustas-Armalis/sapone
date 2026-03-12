import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion as Motion } from 'framer-motion'

const shampooBase = [
  { name: 'Water', benefit: 'carrier' },
  { name: 'Sodium Cocoyl Isethionate', benefit: 'creamy lather' },
  { name: 'Sodium Cocoyl Glutamate', benefit: 'gentle cleanse' },
  { name: 'Coco Glucoside', benefit: 'enhances lather' },
  { name: 'Cocamidopropyl Betaine', benefit: 'foam booster' },
  { name: 'Xanthan Gum', benefit: 'thickener' },
  { name: 'Sodium Benzoate & Potassium Sorbate', benefit: 'preservation' },
  { name: 'Citric Acid', benefit: 'pH balance' },
  { name: 'Phytic Acid', benefit: 'stabilizer' },
]

const shampooVariants = [
  {
    name: 'Curly Hair',
    tagline: 'Tames frizz, defines curls, seals moisture in.',
    actives: [
      { name: 'Mongongo Oil', benefit: 'Frizz control — deeply penetrates the hair shaft to smooth and define.' },
      { name: 'Mango Butter', benefit: 'Seals moisture in — creates a protective layer that locks hydration.' },
      { name: 'Panthenol', benefit: 'Elasticity — strengthens each strand and prevents breakage.' },
      { name: 'Marshmallow Root', benefit: 'Detangling — natural slip that makes combing effortless.' },
      { name: 'Baobab Protein', benefit: 'Strengthens — fills gaps in the cuticle for resilient curls.' },
    ],
  },
  {
    name: 'Straight Hair',
    tagline: 'Mirror shine, lightweight volume, smooth cuticle.',
    actives: [
      { name: 'Camellia Oil', benefit: 'Mirror shine — ultra-lightweight oil that adds glass-like gloss.' },
      { name: 'Rice Protein', benefit: 'Adds volume — plumps each strand from root to tip.' },
      { name: 'Silk Amino Acids', benefit: 'Smooths cuticle — fills micro-damage for a flat, reflective surface.' },
      { name: 'Green Tea Extract', benefit: 'Scalp protection — antioxidant shield against daily pollution.' },
      { name: 'Bamboo Extract', benefit: 'Fortifies — silica-rich, strengthens the hair structure.' },
    ],
  },
  {
    name: 'Colored Hair',
    tagline: 'Protects color, rebuilds fiber, slows fade.',
    actives: [
      { name: 'Quinoa Protein', benefit: 'Reduces fade — binds to color molecules and slows oxidation.' },
      { name: 'Sunflower Seed Oil', benefit: 'UV protection — shields pigment from light degradation.' },
      { name: 'Hydrolyzed Keratin', benefit: 'Rebuilds fiber — restores the protein matrix damaged by coloring.' },
      { name: 'Sea Buckthorn', benefit: 'Restores shine — omega-rich oil that revives vibrancy.' },
      { name: 'Vitamin C', benefit: 'Slows oxidation — neutralizes free radicals that dull color.' },
    ],
  },
  {
    name: 'Oily Hair',
    tagline: 'Regulates sebum, unclogs follicles, purifies.',
    actives: [
      { name: 'Salicylic Acid 0.5%', benefit: 'Unclogs follicles — dissolves buildup at the scalp level.' },
      { name: 'Zinc PCA', benefit: 'Regulates sebum — balances oil production without drying.' },
      { name: 'Kaolin Clay', benefit: 'Absorbs oil — draws out excess sebum between washes.' },
      { name: 'Peppermint Oil', benefit: 'Stimulates scalp — improves circulation for healthier roots.' },
      { name: 'Green Tea Extract', benefit: 'Purifies — antioxidant cleanse that keeps the scalp fresh.' },
    ],
  },
  {
    name: 'Anti-Dandruff',
    tagline: 'Eliminates flakes, calms the scalp, restores balance.',
    actives: [
      { name: 'Piroctone Olamine', benefit: 'Anti-dandruff — clinically proven to eliminate flakes at the source.' },
      { name: 'Tea Tree Oil', benefit: 'Antifungal — natural antimicrobial that prevents recurrence.' },
      { name: 'Niacinamide', benefit: 'Reduces inflammation — calms redness and scalp irritation.' },
      { name: 'Willow Bark', benefit: 'Dissolves flakes — natural salicylate that gently exfoliates.' },
      { name: 'Allantoin', benefit: 'Calms scalp — soothes and accelerates skin cell renewal.' },
    ],
  },
  {
    name: 'Universal',
    tagline: 'Works for everyone. Ideal for daily use.',
    actives: [
      { name: 'Argan Oil', benefit: 'Shine & softness — a single drop equivalent that transforms texture.' },
      { name: 'Panthenol B5', benefit: 'Hydrates — draws moisture from air into the hair shaft.' },
      { name: 'Aloe Vera', benefit: 'Soothes scalp — anti-inflammatory, instantly calming.' },
      { name: 'Hydrolyzed Wheat Protein', benefit: 'Strengthens — fills in weak spots along the hair fiber.' },
      { name: 'Chamomile Extract', benefit: 'Gentle daily use — brightens and softens with every wash.' },
    ],
  },
]

const soapIngredients = [
  { name: 'Sodium Cocoyl Isethionate', benefit: 'Rich creamy lather. Never strips the skin barrier.' },
  { name: 'Argan Oil', benefit: 'Softens, nourishes, and locks in moisture deeply.' },
  { name: 'Sweet Almond Oil', benefit: 'Reduces dryness and improves overall skin texture.' },
  { name: 'Glycerin', benefit: 'Draws moisture in and keeps skin supple all day.' },
  { name: 'Aloe Vera', benefit: 'Calms redness and soothes any skin irritation.' },
  { name: 'Chamomile Extract', benefit: 'Anti-inflammatory. Especially gentle on sensitive skin.' },
  { name: 'Vitamin E', benefit: 'Protects and actively supports long-term skin health.' },
  { name: 'Rosehip Extract', benefit: 'Conditioning blend of natural vitamins and fatty acids.' },
  { name: 'Amino Acids', benefit: 'Softens skin on contact. Supports natural repair.' },
]

function IngredientsPage() {
  const [activeVariant, setActiveVariant] = useState(0)

  useEffect(() => {
    // Scroll to top immediately on mount
    window.scrollTo(0, 0)

    document.title = "Sapone — Full Ingredient List | What's Inside"
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', "Full ingredient list for Sapone's 2-in-1 shampoo and soap bar. 6 shampoo variants: Curly, Straight, Colored, Oily, Anti-Dandruff, Universal. 91% natural origin. Sulfate-free, paraben-free, microplastic-free.")
    return () => {
      document.title = 'Sapone® — The 2-in-1 Shampoo Bar | Plastic-Free, Shark Tank Backed'
    }
  }, [])

  useEffect(() => {
    const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isTouchDevice() || prefersReducedMotion) return

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

  function goBack() {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      window.location.href = '/'
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="grain" aria-hidden="true" />

      {/* Nav */}
      <div className="sticky top-0 z-10 border-b border-border" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="max-w-[1100px] mx-auto px-4 md:px-10 h-14 flex items-center justify-between">
          <button
            onClick={goBack}
            className="flex items-center gap-2 alt text-[13px] text-alt hover:text-text transition-colors cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 3L6 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>
          <a href="/" className="title text-[16px] tracking-[-0.04em] text-text">Sapone</a>
          <div className="w-16" />
        </div>
      </div>

      <main className="max-w-[1100px] mx-auto px-4 md:px-10 py-12 md:py-20">

        {/* ── HERO ── */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 md:mb-20"
        >
          <span className="inline-flex items-center alt text-[11px] uppercase tracking-[0.08em] text-red bg-red/8 border border-red/15 rounded-full px-3 py-1 mb-4">
            Formulated with purpose
          </span>
          <h1 className="title text-[36px] md:text-[58px] leading-[1.02] tracking-[-0.04em]! mb-4 uppercase max-w-[720px]">
            What's inside Sapone
          </h1>
          <p className="alt text-[15px] md:text-[17px] text-alt leading-relaxed max-w-[520px] mb-7">
            Every ingredient earns its place. No fillers, no greenwashing —
            a formula built around what your hair and skin actually need.
          </p>
          <div className="flex flex-wrap gap-2">
            {['95% Natural Origin', 'Sulfate-Free', 'Paraben-Free', 'Microplastic-Free'].map((badge) => (
              <span key={badge} className="alt text-[12px] font-medium text-text bg-white border border-border rounded-full px-3.5 py-1.5">
                {badge}
              </span>
            ))}
          </div>
        </Motion.div>

        {/* ── SHAMPOO ── */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 md:mb-24"
        >
          {/* Section header */}
          <div className="mb-8 pb-6 border-b border-border">
            <p className="alt text-[11px] uppercase tracking-[0.08em] text-alt mb-2">Part 1 of 2</p>
            <h2 className="title text-[24px] md:text-[34px] tracking-[-0.03em]! uppercase mb-3">
              Shampoo — 6 Variants
            </h2>
            <p className="alt text-[14px] md:text-[15px] text-alt max-w-[520px] leading-relaxed">
              One universal cleansing base — gentle enough for every hair type.
              Then five targeted actives chosen specifically for your hair. Pick your variant.
            </p>
          </div>

         

          {/* Variant tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {shampooVariants.map((v, i) => (
              <button
                key={v.name}
                onClick={() => setActiveVariant(i)}
                className={`alt text-[13px] px-4 py-2 rounded-full border transition-all duration-150 cursor-pointer ${
                  activeVariant === i
                    ? 'bg-red text-white border-red'
                    : 'bg-white/60 text-text border-border hover:border-red/40'
                }`}
              >
                {v.name}
              </button>
            ))}
          </div>

          {/* Base + Actives — 2 columns only, no image squish */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Shared base */}
            <div className="order-last md:order-first rounded-[20px] border border-border bg-white/60 p-6">
              <p className="alt text-[10px] uppercase tracking-[0.1em] text-alt mb-5 font-semibold">
                Shared cleansing base · All 6 variants
              </p>
              <ul className="flex flex-col divide-y divide-border">
                {shampooBase.map(({ name, benefit }) => (
                  <li key={name} className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
                    <span className="alt text-[13px] font-medium text-text leading-snug">{name}</span>
                    <span className="alt text-[11px] text-alt text-right shrink-0 mt-0.5">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Active blend */}
            <AnimatePresence mode="wait">
              <Motion.div
                key={activeVariant}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="order-first md:order-last rounded-[20px] border border-red/20 bg-red/3 p-6"
              >
                <p className="alt text-[10px] uppercase tracking-[0.1em] text-red mb-1 font-semibold">Active blend</p>
                <p className="alt text-[17px] font-semibold text-text mb-1">{shampooVariants[activeVariant].name}</p>
                <p className="alt text-[13px] text-alt mb-6 leading-snug">{shampooVariants[activeVariant].tagline}</p>
                <ul className="flex flex-col gap-4">
                  {shampooVariants[activeVariant].actives.map(({ name, benefit }) => (
                    <li key={name}>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red shrink-0" />
                        <span className="alt text-[14px] font-semibold text-text">{name}</span>
                      </div>
                      <p className="alt text-[12px] text-alt leading-snug pl-3.5">{benefit}</p>
                    </li>
                  ))}
                </ul>
              </Motion.div>
            </AnimatePresence>

          </div>
        </Motion.div>

        {/* ── BASE EXPLAINER ── */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-48px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 md:mb-24 rounded-[22px] border border-border bg-white/50 p-7 md:p-10"
        >
          <p className="alt text-[11px] uppercase tracking-[0.08em] text-alt mb-3">Why the same base for all variants?</p>
          <h3 className="title text-[20px] md:text-[26px] tracking-[-0.03em]! uppercase mb-4 max-w-[540px]">
            The cleanser that started it all
          </h3>
          <p className="alt text-[14px] md:text-[15px] text-alt leading-relaxed max-w-[660px]">
            Sodium Cocoyl Isethionate is a naturally-derived surfactant from coconut oil — it produces a dense, creamy lather
            without ever stripping your scalp. We pair it with Sodium Cocoyl Glutamate (amino acid-derived) for the gentlest
            possible cleanse. Combined with Coco Glucoside and Betaine, the base outperforms most liquid shampoos on the market —
            while being biodegradable and microplastic-free.
          </p>
        </Motion.div>

        {/* ── SOAP ── */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-48px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 md:mb-24"
        >
          <div className="mb-8 pb-6 border-b border-border">
            <p className="alt text-[11px] uppercase tracking-[0.08em] text-alt mb-2">Part 2 of 2</p>
            <h2 className="title text-[24px] md:text-[34px] tracking-[-0.03em]! uppercase mb-3">
              Body Soap
            </h2>
            <p className="alt text-[14px] md:text-[15px] text-alt max-w-[500px] leading-relaxed">
              The outer bar. Every wash is a full skin treatment —
              rich lather, deep moisture, nothing that strips or dries.
            </p>
          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {soapIngredients.map(({ name, benefit }, i) => (
              <Motion.div
                key={name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-24px' }}
                transition={{ duration: 0.4, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-[16px] border border-border bg-white/60 p-5 flex flex-col gap-1.5"
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red shrink-0" />
                  <span className="alt text-[13px] font-semibold text-text">{name}</span>
                </div>
                <p className="alt text-[12px] text-alt leading-snug pl-3.5">{benefit}</p>
              </Motion.div>
            ))}
          </div>
        </Motion.div>

        {/* ── FOOTER CTA ── */}
        <div className="flex flex-col items-center text-center border-t border-border pt-14 pb-6">
          <p className="alt text-[14px] text-alt mb-5 max-w-[360px] leading-relaxed">
            You've read the formula. Now be one of the first to try it.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-8 py-[11px] bg-red text-white! alt text-[15px] rounded-[12px] hover:bg-red/90 transition-all duration-150 ease-out mb-5"
          >
            Join the waitlist
          </a>
          <button
            onClick={goBack}
            className="alt text-[13px] text-alt underline underline-offset-4 decoration-border hover:text-text transition-colors cursor-pointer"
          >
            ← Back to Sapone
          </button>
        </div>

      </main>
    </div>
  )
}

export default IngredientsPage
