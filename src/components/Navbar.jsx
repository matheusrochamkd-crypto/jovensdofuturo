import { useState, useEffect } from 'react'
import { ChevronRight } from 'lucide-react'

const navLinks = [
  { label: 'Propósito', href: '#purpose' },
  { label: 'O Local', href: '#venue' },
  { label: 'Público', href: '#audience' },
  { label: 'Mentores', href: '#speakers' },
  { label: 'Programação', href: '#schedule' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToForm = () => {
    document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }

  return (
    <nav
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-700 ease-out
        ${scrolled
          ? 'bg-surface/80 backdrop-blur-xl shadow-2xl shadow-black/40 border border-accent/10'
          : 'bg-transparent border border-transparent'
        }
        rounded-full px-4 md:px-8 py-3 flex items-center justify-between gap-6 w-[95%] max-w-5xl`}
    >
      {/* Logo */}
      <a href="#" className="flex items-center shrink-0">
        <span className="font-heading font-bold text-white text-sm tracking-tight-custom">
          JOVENS DO FUTURO
        </span>
      </a>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-6">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="font-body text-sm text-zinc-400 hover:text-accent transition-colors duration-300"
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={scrollToForm}
        className="btn-magnetic btn-primary text-xs px-5 py-2.5 hidden md:inline-flex"
      >
        Aplicar Agora
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden flex flex-col gap-1.5 p-2"
        aria-label="Menu"
      >
        <span className={`block w-5 h-0.5 bg-accent transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
        <span className={`block w-5 h-0.5 bg-accent transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
        <span className={`block w-5 h-0.5 bg-accent transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
      </button>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 mt-4 bg-surface/95 backdrop-blur-xl rounded-2xl border border-accent/10 p-6 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-body text-zinc-300 hover:text-accent transition-colors py-2"
              >
                {link.label}
              </a>
            ))}
            <button onClick={scrollToForm} className="btn-magnetic btn-primary text-sm mt-2">
              Aplicar Agora
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
