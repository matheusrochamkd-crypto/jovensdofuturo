import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Heart } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function Purpose() {
  const sectionRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 1, ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          }
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="purpose" ref={sectionRef} className="section-padding bg-accent/5 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10" ref={contentRef}>
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-8">
            <Heart className="w-6 h-6 text-accent animate-pulse" />
          </div>
          
          <span className="font-mono text-xs text-accent tracking-[0.3em] uppercase block mb-4">
            NOSSO PROPÓSITO
          </span>
          
          <h2 className="font-heading font-extrabold text-3xl md:text-5xl text-white tracking-tight-custom mb-6">
            Mais que um evento.<br />
            <span className="text-accent text-glow">Um movimento por São José dos Pinhais.</span>
          </h2>
          
          <p className="font-heading font-bold text-xl text-zinc-300 mb-10 italic">
            "Por que grandes executivos e empresários resolveram abrir as portas para os jovens?"
          </p>
          
          <div className="space-y-6 text-zinc-400 font-body text-lg leading-relaxed text-left md:text-center">
            <p>
              Nós acreditamos que o futuro da nossa região não está nas máquinas, mas nas pessoas. O mercado está sedento por novos talentos, mas existe um abismo entre as empresas que querem contratar e os jovens que buscam a primeira grande chance ou querem acelerar seus negócios.
            </p>
            <p>
              Este encontro nasceu com um único objetivo: <span className="text-white font-semibold">ser a ponte.</span> Não estamos aqui para vender cursos. Estamos aqui para descobrir quem são os jovens que vão liderar o mercado de São José dos Pinhais nos próximos anos, entregar a eles as ferramentas certas e conectá-los com quem já chegou lá.
            </p>
          </div>

          <div className="mt-12 h-px w-24 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        </div>
      </div>
    </section>
  )
}
