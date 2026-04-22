import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function Manifesto() {
  const sectionRef = useRef(null)
  const passiveRef = useRef(null)
  const activeRef = useRef(null)
  const networkRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Passive block
      gsap.fromTo(passiveRef.current,
        { x: -60, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: passiveRef.current, start: 'top 80%' }
        }
      )

      // Active block
      gsap.fromTo(activeRef.current,
        { x: 60, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: activeRef.current, start: 'top 80%' }
        }
      )

      // Network block
      gsap.fromTo(networkRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: networkRef.current, start: 'top 85%' }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="manifesto" ref={sectionRef} className="section-padding overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Section Label */}
        <span className="font-mono text-xs text-accent tracking-[0.3em] uppercase block mb-16 text-center">
          O MANIFESTO
        </span>

        {/* Contrast Grid */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center mb-20">
          {/* The Passive (Generic Education) */}
          <div ref={passiveRef} className="relative">
            <span className="font-mono text-[10px] text-zinc-600 tracking-[0.2em] uppercase block mb-4">
              A maioria da educação foca em:
            </span>
            <h3 className="font-heading font-semibold text-2xl md:text-3xl text-zinc-500 leading-tight">
              Educação Passiva<br />
              <span className="text-zinc-600">e Força Bruta.</span>
            </h3>
            <p className="font-body text-sm text-zinc-600 mt-4 leading-relaxed">
              Teoria desconectada da prática. Esforço sem direção.
              Repetição sem resultado. O modelo que forma desempregados qualificados.
            </p>
            {/* Strikethrough decoration */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-zinc-700/50 -rotate-2" />
          </div>

          {/* The Active (Our Model) */}
          <div ref={activeRef}>
            <span className="font-mono text-[10px] text-accent tracking-[0.2em] uppercase block mb-4">
              Nós focamos em:
            </span>
            <h3 className="font-heading font-extrabold text-3xl md:text-5xl text-white leading-tight tracking-tight-custom">
              Educação <span className="text-accent text-glow italic">Ativa</span><br />
              e Escala via{' '}
              <span className="text-accent text-glow italic">
                Inteligência Artificial
              </span>.
            </h3>
            <p className="font-body text-sm text-zinc-400 mt-4 leading-relaxed">
              Prática imediata. Ferramentas de multiplicação. Conexões que geram contratos.
              O modelo que forma líderes preparados.
            </p>
          </div>
        </div>

        {/* Networking Statement */}
        <div ref={networkRef} className="card-surface p-8 md:p-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-accent/30" />
            <span className="font-mono text-xs text-accent tracking-[0.3em] uppercase">Networking</span>
            <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-accent/30" />
          </div>
          <p className="font-heading font-bold text-xl md:text-2xl text-white max-w-3xl mx-auto">
            Saia do <span className="text-zinc-500 line-through">esforço solo isolado</span> para o{' '}
            <span className="text-accent text-glow">networking estratégico</span> com gigantes do mercado.
          </p>
          <div className="flex items-center justify-center gap-2 mt-6 text-accent">
            <span className="font-mono text-xs">São José dos Pinhais</span>
            <ArrowRight className="w-4 h-4" />
            <span className="font-mono text-xs">O Mundo</span>
          </div>
        </div>
      </div>
    </section>
  )
}
