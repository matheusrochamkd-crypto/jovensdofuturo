import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import DiagnosticShuffler from './speakers/DiagnosticShuffler'
import TelemetryTypewriter from './speakers/TelemetryTypewriter'
import ProtocolScheduler from './speakers/ProtocolScheduler'

gsap.registerPlugin(ScrollTrigger)

export default function Speakers() {
  const sectionRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardsRef.current,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="speakers" ref={sectionRef} className="section-padding">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-mono text-xs text-accent tracking-[0.3em] uppercase block mb-4">
            OS NOSSOS MENTORES
          </span>
          <h2 className="font-heading font-extrabold text-3xl md:text-5xl text-white tracking-tight-custom">
            Quem vai guiar o seu<br />
            <span className="text-accent text-glow">caminho</span>
          </h2>
          <p className="font-body text-zinc-400 mt-4 max-w-xl mx-auto">
            Três autoridades. Uma missão: transformar o seu potencial em protagonismo real no mercado.
          </p>
        </div>

        {/* Speaker Cards Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div ref={el => cardsRef.current[0] = el}>
            <DiagnosticShuffler />
          </div>
          <div ref={el => cardsRef.current[1] = el}>
            <TelemetryTypewriter />
          </div>
          <div ref={el => cardsRef.current[2] = el}>
            <ProtocolScheduler />
          </div>
        </div>
      </div>
    </section>
  )
}
