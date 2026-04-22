import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MapPin, CalendarDays, Clock, ChevronLeft, ChevronRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const images = [
  { src: '/venue/venue-1.jpg', alt: 'Ambiente Executive Gastronomia' },
  { src: '/venue/venue-2.jpg', alt: 'Detalhes do espaço' },
  { src: '/venue/venue-3.jpg', alt: 'Integração do espaço' },
]

export default function Venue() {
  const sectionRef = useRef(null)
  const [currentImg, setCurrentImg] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.venue-content',
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          }
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImg(prev => (prev + 1) % images.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const nextImg = () => setCurrentImg(prev => (prev + 1) % images.length)
  const prevImg = () => setCurrentImg(prev => (prev - 1 + images.length) % images.length)

  return (
    <section id="venue" ref={sectionRef} className="section-padding">
      <div className="container-elite">
        {/* Header */}
        <div className="text-center mb-16 venue-content">
          <span className="font-mono text-xs text-accent tracking-[0.3em] uppercase block mb-4">
            Onde tudo acontece
          </span>
          <h2 className="font-heading font-extrabold text-3xl md:text-5xl text-white tracking-tight-custom">
            O Local
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="venue-content relative rounded-[2rem] overflow-hidden aspect-[4/3] group">
            {images.map((img, i) => (
              <img
                key={i}
                src={img.src}
                alt={img.alt}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                  i === currentImg ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-deep-slate/60 via-transparent to-transparent" />

            {/* Navigation */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={prevImg} className="p-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={nextImg} className="p-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImg(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentImg ? 'bg-accent w-6' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Info + Video */}
          <div className="flex flex-col gap-6">
            {/* Details Card */}
            <div className="venue-content card-surface p-8 flex-1">
              <h3 className="font-heading font-bold text-2xl text-white tracking-tight-custom mb-6">
                Executive Gastronomia
              </h3>
              <p className="font-body text-zinc-400 leading-relaxed mb-8">
                Um espaço sofisticado onde cada detalhe é cuidadosamente pensado para promover a perfeita integração entre pessoas, ideias e oportunidades. O cenário ideal para um evento que conecta liderança, tecnologia e mercado.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <CalendarDays className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <span className="text-xs text-zinc-500 block">Data</span>
                    <span className="font-heading font-semibold text-white">12 de Maio, 2026</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <span className="text-xs text-zinc-500 block">Horário</span>
                    <span className="font-heading font-semibold text-white">18h30 às 21h00</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <span className="text-xs text-zinc-500 block">Local</span>
                    <span className="font-heading font-semibold text-white">São José dos Pinhais, PR</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Video */}
            <div className="venue-content rounded-[2rem] overflow-hidden aspect-video">
              <video
                src="/venue/venue-video.mp4"
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
