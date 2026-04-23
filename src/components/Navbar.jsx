import { useState, useEffect, useRef } from 'react'
import { ChevronRight, Menu, X } from 'lucide-react'
import { gsap } from 'gsap'

const navLinks = [
  { label: 'Propósito', href: '#purpose' },
  { label: 'O Local', href: '#venue' },
  { label: 'Público', href: '#audience' },
  { label: 'Mentores', href: '#speakers' },
  { label: 'Programação', href: '#schedule' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navRef = useRef(null)
  const menuRef = useRef(null)
  const backdropRef = useRef(null)
  const linksRef = useRef([])

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20
      
      gsap.to(navRef.current, {
        backgroundColor: isScrolled ? 'rgba(26, 26, 26, 0.8)' : 'rgba(26, 26, 26, 0)',
        backdropFilter: isScrolled ? 'blur(12px)' : 'blur(0px)',
        borderColor: isScrolled ? 'rgba(74, 222, 128, 0.1)' : 'rgba(74, 222, 128, 0)',
        y: isScrolled ? 0 : 0,
        paddingTop: isScrolled ? '0.75rem' : '1.25rem',
        paddingBottom: isScrolled ? '0.75rem' : '1.25rem',
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto'
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Mobile Menu Animation
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
      const tl = gsap.timeline()
      tl.to(backdropRef.current, { opacity: 1, visibility: 'visible', duration: 0.3 })
        .to(menuRef.current, { y: 0, opacity: 1, visibility: 'visible', duration: 0.4, ease: 'back.out(1.2)' }, '-=0.1')
        .fromTo(linksRef.current, 
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.05, duration: 0.3, ease: 'power2.out' },
          '-=0.2'
        )
    } else {
      document.body.style.overflow = ''
      const tl = gsap.timeline()
      tl.to(menuRef.current, { y: -10, opacity: 0, duration: 0.2, onComplete: () => gsap.set(menuRef.current, { visibility: 'hidden' }) })
        .to(backdropRef.current, { opacity: 0, duration: 0.2, onComplete: () => gsap.set(backdropRef.current, { visibility: 'hidden' }) }, '-=0.1')
    }
  }, [mobileOpen])

  const scrollToSection = (e, href) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) {
      setMobileOpen(false)
      const offset = 100
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset
      window.scrollTo({ top: targetPosition, behavior: 'smooth' })
    }
  }

  const scrollToForm = () => {
    const target = document.getElementById('application-form')
    if (target) {
      setMobileOpen(false)
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <div ref={backdropRef} onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] invisible opacity-0 md:hidden" />

      <nav
        ref={navRef}
        className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 rounded-full px-5 md:px-8 flex items-center justify-between gap-6 w-[92%] max-w-5xl border will-change-transform shadow-2xl shadow-black/20"
      >
        <a 
          href="#" 
          className="flex items-center shrink-0 hover:opacity-80 transition-opacity"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
        >
          <span className="font-heading font-bold text-white text-[11px] md:text-sm tracking-tight-custom uppercase">
            Jovens do Futuro
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="font-body text-[11px] text-zinc-400 hover:text-accent transition-colors duration-300 uppercase tracking-widest"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={scrollToForm} className="btn-magnetic btn-primary text-[10px] md:text-xs px-4 md:px-6 py-2 md:py-2.5 hidden sm:inline-flex">
            Aplicar Agora
            <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex items-center justify-center p-1.5 text-accent hover:bg-accent/10 rounded-full transition-colors"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <div ref={menuRef} className="absolute top-[calc(100%+1rem)] left-0 right-0 bg-surface/98 backdrop-blur-3xl rounded-[2rem] border border-accent/10 p-8 md:hidden invisible opacity-0 shadow-3xl overflow-hidden">
          {/* Decorative background for menu */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl pointer-events-none" />
          
          <div className="flex flex-col gap-6 relative z-10">
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                ref={el => linksRef.current[i] = el}
                onClick={(e) => scrollToSection(e, link.href)}
                className="font-heading text-xl font-bold text-zinc-200 hover:text-accent transition-colors py-1 flex items-center justify-between group"
              >
                {link.label}
                <ChevronRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </a>
            ))}
            <div className="h-px bg-accent/10 my-2" />
            <button onClick={scrollToForm} className="btn-magnetic btn-primary w-full py-4 text-sm">
              Iniciar Protocolo
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>
    </>
  )
}

