import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Brands() {
  const sectionRef = useRef(null)
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.brand-logo', 
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
          }
        }
      )
    }, sectionRef)
    
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-16 md:py-24 border-b border-accent/5 bg-deep-slate relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.3em] block text-center mb-12">
          Instituições por trás do projeto
        </span>
        
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24">
          <img 
            src="/logos/nutrimental.png" 
            alt="Nutrimental" 
            className="brand-logo h-16 md:h-24 object-contain grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500" 
          />
          <img 
            src="/logos/executive.png" 
            alt="Executive Gastronomia" 
            className="brand-logo h-20 md:h-28 object-contain grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 rounded-sm" 
          />
          <img 
            src="/logos/eletron.png" 
            alt="Eletron Digital" 
            className="brand-logo h-16 md:h-24 object-contain grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500" 
          />
        </div>
      </div>
    </section>
  )
}
