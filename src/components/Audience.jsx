import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { GraduationCap, Rocket, Compass, ArrowRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const audienceItems = [
  {
    icon: GraduationCap,
    title: 'O Universitário Inconformado',
    description: 'Para estudantes que já perceberam que apenas o diploma não será suficiente. É para quem quer ir muito além da teoria da sala de aula, buscando atalhos práticos, vivência de mercado e conexões reais para sair na frente antes mesmo de se formar.',
    tag: 'Foco em Carreira',
  },
  {
    icon: Rocket,
    title: 'O Jovem Empreendedor',
    description: 'Para quem já está colocando a mão na massa, vendendo seus serviços, criando projetos ou estruturando o próprio negócio. Jovens que precisam ouvir estratégias validadas por grandes executivos para escalar suas ideias e não cometer os erros de quem tenta fazer tudo sozinho.',
    tag: 'Foco em Escala',
  },
  {
    icon: Compass,
    title: 'O Jovem em Busca de Direção',
    description: 'Para quem tem muita vontade de crescer, mas sente que falta um norte. Se você sabe que precisa conhecer pessoas novas, entender como as empresas contratam e descobrir as habilidades do futuro, mas não sabe por onde começar: este evento é o seu ponto de partida.',
    tag: 'Foco em Propósito',
  },
]

export default function Audience() {
  const sectionRef = useRef(null)
  const rowsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      rowsRef.current.forEach((row, i) => {
        const direction = i === 0 ? -100 : i === 1 ? 100 : 0
        const yOffset = i === 2 ? 60 : 0

        gsap.fromTo(row,
          { x: direction, y: yOffset, opacity: 0 },
          {
            x: 0, y: 0, opacity: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: row,
              start: 'top 85%',
            }
          }
        )
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="audience" ref={sectionRef} className="section-padding bg-black/20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-24">
          <span className="font-mono text-xs text-accent tracking-[0.3em] uppercase block mb-4">
            PARA QUEM É ESTE ENCONTRO?
          </span>
          <h2 className="font-heading font-extrabold text-3xl md:text-5xl text-white tracking-tight-custom mb-6">
            Desenhado para quem não quer apenas<br />
            <span className="text-accent text-glow italic">esperar o futuro chegar.</span>
          </h2>
          <p className="font-body text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Se você se identifica com um desses perfis, este é o lugar onde sua transformação começa.
          </p>
        </div>

        {/* Z-Layout Rows */}
        <div className="space-y-32 md:space-y-48">
          {/* Item 1: Icon Left, Text Right */}
          <div
            ref={el => rowsRef.current[0] = el}
            className="flex flex-col md:flex-row items-center gap-12 md:gap-24"
          >
            <div className="flex-1 flex justify-center md:justify-end">
              <div className="relative group">
                <div className="absolute inset-0 bg-accent/20 blur-[80px] rounded-full group-hover:bg-accent/30 transition-all duration-700" />
                <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-3xl bg-surface border border-accent/20 flex items-center justify-center rotate-3 group-hover:rotate-6 transition-transform duration-500">
                  <GraduationCap className="w-16 h-16 md:w-24 md:h-24 text-accent" />
                </div>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <span className="font-mono text-[10px] text-accent tracking-widest uppercase mb-4 block">
                {audienceItems[0].tag}
              </span>
              <h3 className="font-heading font-bold text-3xl text-white mb-6 tracking-tight-custom">
                {audienceItems[0].title}
              </h3>
              <p className="font-body text-zinc-400 text-lg leading-relaxed mb-8">
                {audienceItems[0].description}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-2 text-accent/60 font-mono text-xs uppercase tracking-widest">
                <ArrowRight className="w-4 h-4" />
                Vá além da teoria
              </div>
            </div>
          </div>

          {/* Item 2: Text Left, Icon Right */}
          <div
            ref={el => rowsRef.current[1] = el}
            className="flex flex-col-reverse md:flex-row items-center gap-12 md:gap-24"
          >
            <div className="flex-1 text-center md:text-right">
              <span className="font-mono text-[10px] text-accent tracking-widest uppercase mb-4 block">
                {audienceItems[1].tag}
              </span>
              <h3 className="font-heading font-bold text-3xl text-white mb-6 tracking-tight-custom">
                {audienceItems[1].title}
              </h3>
              <p className="font-body text-zinc-400 text-lg leading-relaxed mb-8">
                {audienceItems[1].description}
              </p>
              <div className="flex items-center justify-center md:justify-end gap-2 text-accent/60 font-mono text-xs uppercase tracking-widest">
                Escale suas ideias
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
            <div className="flex-1 flex justify-center md:justify-start">
              <div className="relative group">
                <div className="absolute inset-0 bg-accent/20 blur-[80px] rounded-full group-hover:bg-accent/30 transition-all duration-700" />
                <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-3xl bg-surface border border-accent/20 flex items-center justify-center -rotate-3 group-hover:-rotate-6 transition-transform duration-500">
                  <Rocket className="w-16 h-16 md:w-24 md:h-24 text-accent" />
                </div>
              </div>
            </div>
          </div>

          {/* Item 3: Centered Content */}
          <div
            ref={el => rowsRef.current[2] = el}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="relative inline-block mb-12 group">
              <div className="absolute inset-0 bg-accent/20 blur-[80px] rounded-full group-hover:bg-accent/40 transition-all duration-700" />
              <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-[2.5rem] bg-accent flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                <Compass className="w-16 h-16 md:w-24 md:h-24 text-deep-slate" />
              </div>
            </div>
            <span className="font-mono text-[10px] text-accent tracking-widest uppercase mb-4 block">
              {audienceItems[2].tag}
            </span>
            <h3 className="font-heading font-bold text-3xl md:text-4xl text-white mb-6 tracking-tight-custom">
              {audienceItems[2].title}
            </h3>
            <p className="font-body text-zinc-400 text-lg leading-relaxed mb-8">
              {audienceItems[2].description}
            </p>
            <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-accent/10 border border-accent/20">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-mono text-[10px] text-accent tracking-widest uppercase">Seu ponto de partida está aqui</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
