import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Handshake, Target, Zap, CheckCircle2 } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const outcomes = [
  {
    icon: Handshake,
    title: 'Acesso a Quem Decide',
    description: 'Esqueça o currículo frio. Você vai sentar e conversar de igual para igual com executivos que lideram equipes, contratam e geram grandes negócios na nossa região. Venha apertar as mãos certas.',
    label: 'NETWORKING REAL',
  },
  {
    icon: Target,
    title: 'O Mapa do Mundo Real',
    description: 'A faculdade te dá a teoria, nós mostramos a prática. Entenda com quem tem 30 anos de mercado o que as empresas de verdade buscam hoje e descubra atalhos que ninguém te ensina para acelerar sua carreira.',
    label: 'DIRECIONAMENTO',
  },
  {
    icon: Zap,
    title: 'Ferramentas a seu Favor',
    description: 'Sem termos difíceis. Aprenda a usar a Inteligência Artificial como a sua maior aliada para organizar ideias, multiplicar sua produtividade e se tornar um profissional que as empresas não querem perder.',
    label: 'PRODUTIVIDADE',
  },
]

export default function Outcomes() {
  const sectionRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardsRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.8, stagger: 0.08,
          ease: 'power3.out',
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
    <section id="outcomes" ref={sectionRef} className="section-padding">
      <div className="container-elite">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-mono text-xs text-accent tracking-[0.3em] uppercase block mb-4">
            MUITO ALÉM DE UMA PALESTRA
          </span>
          <h2 className="font-heading font-extrabold text-3xl md:text-5xl text-white tracking-tight-custom">
            Por que você não pode<br />
            <span className="text-accent text-glow">ficar de fora?</span>
          </h2>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {outcomes.map((item, i) => {
            const Icon = item.icon
            return (
              <div
                key={i}
                ref={el => cardsRef.current[i] = el}
                className="card-surface p-8 flex flex-col text-center items-center group border-accent/5 hover:border-accent/20 transition-all duration-500"
              >
                <div className="w-16 h-16 rounded-2xl bg-accent/5 flex items-center justify-center mb-6 group-hover:bg-accent/10 transition-colors">
                  <Icon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-heading font-bold text-lg text-white mb-3 tracking-tight-custom">
                  {item.title}
                </h3>
                <p className="font-body text-sm text-zinc-400 leading-relaxed flex-1">
                  {item.description}
                </p>
                <div className="mt-6 pt-4 border-t border-accent/5 w-full">
                  <span className="font-mono text-[10px] text-accent/40 tracking-[0.2em]">
                    {item.label}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Certificate Callout */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-accent/5 border border-accent/10">
            <CheckCircle2 className="w-4 h-4 text-accent" />
            <span className="font-body text-sm text-zinc-300">
              Todos os selecionados receberão <span className="text-white font-semibold">Certificado Oficial de Participação</span> (válido para horas complementares).
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
