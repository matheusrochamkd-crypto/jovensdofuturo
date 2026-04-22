import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BookOpen, Users, Cpu } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const challenges = [
  {
    icon: BookOpen,
    label: '01',
    title: 'A Teoria vs. O Mundo Real',
    description: 'A distância perigosa entre a teoria da sala de aula e a execução prática na trincheira do mercado de trabalho.',
  },
  {
    icon: Users,
    label: '02',
    title: 'A Falta de Contatos (Networking)',
    description: 'Jovens paralisados pela falta de ferramentas e conexões certas para transformar potencial em resultado e contratos.',
  },
  {
    icon: Cpu,
    label: '03',
    title: 'A Falta de Direcionamento',
    description: 'O sentimento de estar perdido diante de tantas mudanças, sem saber qual caminho seguir para se destacar.',
  },
]

export default function Challenge() {
  const sectionRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardsRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
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
    <section id="challenge" ref={sectionRef} className="section-padding">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-mono text-xs text-accent tracking-[0.3em] uppercase block mb-4">
            O DESAFIO
          </span>
          <h2 className="font-heading font-extrabold text-3xl md:text-5xl text-white tracking-tight-custom">
            O Desafio da<br />
            <span className="text-accent text-glow">Nova Geração</span>
          </h2>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {challenges.map((item, i) => {
            const Icon = item.icon
            return (
              <div
                key={i}
                ref={el => cardsRef.current[i] = el}
                className="card-surface p-8 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <span className="font-mono text-xs text-accent/60">{item.label}</span>
                </div>
                <h3 className="font-heading font-bold text-xl text-white mb-3 tracking-tight-custom">
                  {item.title}
                </h3>
                <p className="font-body text-sm text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
                {/* Decorative Line */}
                <div className="mt-auto pt-6">
                  <div className="h-px bg-gradient-to-r from-accent/20 to-transparent" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
