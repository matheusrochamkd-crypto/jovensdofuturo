export default function Footer() {
  return (
    <footer className="border-t border-accent/5 py-12">
      <div className="container-elite">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="font-mono text-accent font-bold text-sm">JF</span>
            </div>
            <div>
              <span className="font-heading font-bold text-white text-sm tracking-tight-custom block">
                JOVENS DO FUTURO
              </span>
              <span className="font-mono text-[9px] text-zinc-600">
                by Eletron Digital × Nutrimental × Executive Gastronomia
              </span>
            </div>
          </div>

          {/* Center */}
          <div className="text-center">
            <p className="font-mono text-xs text-zinc-500">
              São José dos Pinhais, PR — 2025
            </p>
            <p className="font-mono text-[10px] text-accent/30 mt-1">
              Seleção Exclusiva
            </p>
          </div>

          {/* Right */}
          <div className="text-right">
            <p className="font-mono text-[10px] text-zinc-600 leading-relaxed">
              Cultivando o amanhã,<br />conectando o hoje.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-accent/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[10px] text-zinc-700">
            © 2025 Eletron Digital. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-accent/30" />
            <span className="font-mono text-[10px] text-accent/30">CONEXÃO ATIVA</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
