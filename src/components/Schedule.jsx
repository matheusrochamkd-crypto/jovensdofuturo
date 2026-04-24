import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Clock, Coffee, Lightbulb, Zap, BarChart3, Trophy, Users } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const scheduleItems = [
  {
    time: '18:30',
    title: 'Credenciamento e Networking',
    description: 'O início da sua jornada. Conecte-se com outros jovens visionários e comece a construir sua rede antes mesmo da primeira palestra.',
    icon: Coffee,
  },
  {
    time: '19:00',
    title: 'Olhar de empreendedora',
    mentor: 'Miriam Ferreira',
    description: 'Como se posicionar como um líder talentoso e despertar o interesse dos grandes tomadores de decisão.',
    icon: Lightbulb,
  },
  {
    time: '19:30',
    title: 'IA: Sua Vantagem Competitiva',
    mentor: 'Matheus Binotti',
    description: 'Aprenda a dominar as ferramentas que vão multiplicar sua produtividade e te colocar anos à frente da concorrência.',
    icon: Zap,
  },
  {
    time: '20:00',
    title: 'A voz da indústria',
    mentor: 'Robson Alves',
    description: 'Os bastidores das grandes indústrias e o mapa exato do que o mercado de São José dos Pinhais busca hoje.',
    icon: BarChart3,
  },
  {
    time: '20:30',
    title: 'Futuro em Debate',
    mentor: 'Miriam Ferreira, Matheus Binotti e Robson Alves',
    description: 'Uma conversa aberta entre os mentores e o público. O momento de tirar dúvidas, aprofundar conceitos e trocar experiências reais.',
    icon: Users,
  },
  {
    time: '21:00',
    title: 'Encerramento e Oportunidades',
    description: 'O momento decisivo. Próximos passos para os selecionados e o início de uma nova fase na sua carreira.',
    icon: Trophy,
  },
]

export default function Schedule() {
  const sectionRef = useRef(null)
  const itemsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      itemsRef.current.forEach((item, i) => {
        gsap.fromTo(item,
          { x: i % 2 === 0 ? -40 : 40, opacity: 0 },
          {
            x: 0, opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
            }
          }
        )
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="schedule" ref={sectionRef} className="section-padding bg-black/40">
      <div className="container-elite">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="font-mono text-xs text-accent tracking-[0.3em] uppercase block mb-4">
            PROGRAMAÇÃO
          </span>
          <h2 className="font-heading font-extrabold text-3xl md:text-5xl text-white tracking-tight-custom mb-6">
            Como será a sua <span className="text-accent text-glow italic">noite?</span>
          </h2>
          <p className="font-body text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Esqueça as palestras cansativas. Desenhamos uma experiência imersiva e focada em ação.
          </p>
        </div>

        {/* Timeline Items */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-[23px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent/50 via-accent/10 to-transparent md:-translate-x-1/2" />

          <div className="space-y-12">
            {scheduleItems.map((item, i) => {
              const Icon = item.icon
              const isEven = i % 2 === 0

              return (
                <div
                  key={i}
                  ref={el => itemsRef.current[i] = el}
                  className={`relative flex items-center gap-8 md:gap-0 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  {/* Icon Node */}
                  <div className="absolute left-0 md:left-1/2 w-12 h-12 rounded-full bg-deep-slate border-2 border-accent/20 flex items-center justify-center z-10 md:-translate-x-1/2">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>

                  {/* Content Card */}
                  <div className={`flex-1 md:w-1/2 ${isEven ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'} ml-16 md:ml-0`}>
                    <div className="card-surface p-6 hover:border-accent/20 transition-colors">
                      <span className="font-mono text-accent text-sm font-bold block mb-1">{item.time}</span>
                      <h3 className="font-heading font-bold text-xl text-white mb-2">{item.title}</h3>
                      {item.mentor && (
                        <p className="font-mono text-[10px] text-accent/60 uppercase tracking-widest mb-3">Mentor: {item.mentor}</p>
                      )}
                      <p className="font-body text-sm text-zinc-400 leading-relaxed">{item.description}</p>
                    </div>
                  </div>

                  {/* Empty space for balance */}
                  <div className="hidden md:block md:w-1/2" />
                </div>
              )
            })}
          </div>
        </div>

        {/* Dynamic Footer */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/5 border border-accent/10">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-[10px] text-accent tracking-[0.2em] uppercase">Evento 100% Dinâmico e Interativo</span>
          </div>
        </div>
      </div>
    </section>
  )
}
