import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ArrowDown, MapPin, CalendarDays } from 'lucide-react'

export default function Hero() {
  const containerRef = useRef(null)
  const line1Ref = useRef(null)
  const line2Ref = useRef(null)
  const subRef = useRef(null)
  const ctaRef = useRef(null)
  const infoRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo(line1Ref.current,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2 }
      )
      .fromTo(line2Ref.current,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2 },
        '-=0.7'
      )
      .fromTo(subRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        '-=0.5'
      )
      .fromTo(infoRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        '-=0.3'
      )
      .fromTo(ctaRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        '-=0.3'
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const scrollToForm = () => {
    document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] flex flex-col items-center justify-center text-center overflow-hidden px-6 pt-24 pb-12"
    >
      {/* Radial Glow Background */}
      <div className="absolute inset-0 bg-deep-slate">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[800px] md:h-[800px] rounded-full bg-primary/20 blur-[100px] md:blur-[200px] animate-pulse-glow" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[150px] md:w-[600px] md:h-[300px] bg-accent/5 blur-[80px] md:blur-[150px]" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(74,222,128,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,0.3) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      {/* Content */}
      <div className="relative z-10 container-elite">
        {/* Main Headline */}
        <h1>
          <span
            ref={line1Ref}
            className="block font-heading font-extrabold text-[28px] sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-tight-custom leading-[1.1] opacity-0"
          >
            O SEU FUTURO NÃO ESPERA.
          </span>
          <span
            ref={line2Ref}
            className="block font-mono font-bold italic text-3xl sm:text-6xl md:text-7xl lg:text-8xl text-accent tracking-tight-custom leading-[1.1] sm:leading-[0.95] mt-4 sm:mt-2 text-glow opacity-0"
          >
            ELE SE CONSTRÓI HOJE.
          </span>
        </h1>

        {/* Sub-headline */}
        <p
          ref={subRef}
          className="font-body text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto mt-8 leading-relaxed opacity-0"
        >
          Conexões reais, direcionamento prático e oportunidades para os jovens que vão movimentar São José dos Pinhais.
        </p>

        {/* Event Info */}
        <div ref={infoRef} className="flex flex-wrap justify-center items-center gap-6 mt-8 opacity-0">
          <div className="flex items-center gap-2 text-zinc-400">
            <CalendarDays className="w-4 h-4 text-accent" />
            <span className="font-body text-sm">12 de Maio, 2026 — 18h30 às 21h</span>
          </div>
          <div className="w-px h-4 bg-accent/20 hidden sm:block" />
          <div className="flex items-center gap-2 text-zinc-400">
            <MapPin className="w-4 h-4 text-accent" />
            <span className="font-body text-sm">Executive Gastronomia — São José dos Pinhais</span>
          </div>
        </div>

        {/* CTA */}
        <div ref={ctaRef} className="mt-10 opacity-0">
          <button onClick={scrollToForm} className="btn-magnetic btn-primary text-base px-10 py-4">
            Garantir minha vaga
            <ArrowDown className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span className="font-mono text-[10px] text-accent uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-accent to-transparent" />
      </div>
    </section>
  )
}
