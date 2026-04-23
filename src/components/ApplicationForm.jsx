import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { submitCandidate, sendEmail, enrichCandidate } from '../lib/supabase'
import { enrichLeadData } from '../lib/gemini'

gsap.registerPlugin(ScrollTrigger)

const initialForm = {
  full_name: '',
  email: '',
  phone: '',
  age: '',
  gender: '',
  city: '',
  institution: '',
  area: '',
  linkedin: '',
  justification: '',
}

export default function ApplicationForm() {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('idle') // idle, loading, success, error
  const [errorMsg, setErrorMsg] = useState('')
  const sectionRef = useRef(null)
  const formRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(formRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const payload = {
        ...form,
        age: form.age ? parseInt(form.age) : null,
        status: 'approved',
      }
      const candidate = await submitCandidate(payload)
      
      // Automatic Enrichment after submission
      try {
        const enrichment = await enrichLeadData(candidate, "")
        if (enrichment) {
          await enrichCandidate(candidate.id, enrichment)
        }
      } catch (enrichErr) {
        console.warn('Enrichment background failed:', enrichErr)
        // Non-blocking error, we still show success for the submission
      }

      // Try sending confirmation email
      await sendEmail('application_received', candidate.id)
      setStatus('success')
      setForm(initialForm)
    } catch (err) {
      console.error('Submit error:', err)
      setStatus('error')
      if (err.message?.includes('duplicate')) {
        setErrorMsg('Este e-mail já foi cadastrado.')
      } else {
        setErrorMsg(err.message || 'Erro ao enviar candidatura. Tente novamente.')
      }
    }
  }

  const fillTestData = () => {
    setForm({
      full_name: 'Matheus Binotti Rocha',
      email: 'matheusbinottir@gmail.com',
      phone: '(41) 99999-0000',
      age: '24',
      gender: 'masculino',
      city: 'São José dos Pinhais',
      institution: 'Eletron Digital',
      area: 'Tecnologia',
      linkedin: 'https://www.linkedin.com/in/matheus-binotti-964150259/',
      justification: 'Sou apaixonado por tecnologia e liderança. Acredito que o evento Jovens do Futuro é a oportunidade perfeita para conectar minha visão de IA aplicada com líderes do mercado regional.',
    })
  }

  return (
    <section id="application-form" ref={sectionRef} className="section-padding">
      <div className="container-elite max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="font-mono text-xs text-accent tracking-[0.3em] uppercase block mb-4">
            SUBMETA SUA CANDIDATURA
          </span>
          <h2 className="font-heading font-extrabold text-3xl md:text-5xl text-white tracking-tight-custom">
            Candidatura
          </h2>
          <p className="font-mono text-sm text-accent/60 mt-4">
            "O futuro não é sorte, é seleção."
          </p>
        </div>

        {/* Form */}
        <div ref={formRef} className="card-surface p-8 md:p-12">
          {/* DEV: Test Button - Moved inside and below header */}
          <div className="mb-8 flex justify-end">
            <button
              type="button"
              onClick={fillTestData}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono hover:bg-amber-500/20 transition-colors"
            >
              ⚡ Preencher dados de teste
            </button>
          </div>

          {status === 'success' ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-accent" />
              </div>
              <h3 className="font-heading font-bold text-2xl text-white mb-3">
                Candidatura Recebida
              </h3>
              <p className="font-body text-zinc-400 mb-2">
                Seu perfil entrou no protocolo de análise.
              </p>
              <p className="font-mono text-xs text-accent/60 italic">
                Aguarde o retorno no seu e-mail.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="btn-magnetic btn-outline text-sm mt-8 px-6 py-3"
              >
                Nova candidatura
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="font-mono text-[10px] text-accent/60 uppercase tracking-[0.15em] block mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  required
                  className="input-elite"
                  placeholder="Seu nome completo"
                />
              </div>

              {/* Email + Phone */}
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="font-mono text-[10px] text-accent/60 uppercase tracking-[0.15em] block mb-2">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="input-elite"
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] text-accent/60 uppercase tracking-[0.15em] block mb-2">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className="input-elite"
                    placeholder="(41) 99999-0000"
                  />
                </div>
              </div>

              {/* Age + Gender + City */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                <div>
                  <label className="font-mono text-[10px] text-accent/60 uppercase tracking-[0.15em] block mb-2">
                    Idade *
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={form.age}
                    onChange={handleChange}
                    required
                    min="14"
                    max="99"
                    className="input-elite"
                    placeholder="22"
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] text-accent/60 uppercase tracking-[0.15em] block mb-2">
                    Gênero *
                  </label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    required
                    className="input-elite"
                  >
                    <option value="">Selecione</option>
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                    <option value="outro">Outro</option>
                    <option value="prefiro_nao_dizer">Prefiro não dizer</option>
                  </select>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="font-mono text-[10px] text-accent/60 uppercase tracking-[0.15em] block mb-2">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                    className="input-elite"
                    placeholder="São José dos Pinhais"
                  />
                </div>
              </div>

              {/* Institution + Area */}
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="font-mono text-[10px] text-accent/60 uppercase tracking-[0.15em] block mb-2">
                    Universidade / Empresa *
                  </label>
                  <input
                    type="text"
                    name="institution"
                    value={form.institution}
                    onChange={handleChange}
                    required
                    className="input-elite"
                    placeholder="Onde você atua?"
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] text-accent/60 uppercase tracking-[0.15em] block mb-2">
                    Área de Atuação *
                  </label>
                  <input
                    type="text"
                    name="area"
                    value={form.area}
                    onChange={handleChange}
                    required
                    className="input-elite"
                    placeholder="Tecnologia, Administração..."
                  />
                </div>
              </div>

              {/* LinkedIn */}
              <div>
                <label className="font-mono text-[10px] text-accent/60 uppercase tracking-[0.15em] block mb-2">
                  LinkedIn (opcional)
                </label>
                <input
                  type="url"
                  name="linkedin"
                  value={form.linkedin}
                  onChange={handleChange}
                  className="input-elite"
                  placeholder="https://linkedin.com/in/seu-perfil"
                />
              </div>

              {/* Justification */}
              <div>
                <label className="font-mono text-[10px] text-accent/60 uppercase tracking-[0.15em] block mb-2">
                  Por que você deve ser selecionado? *
                </label>
                <textarea
                  name="justification"
                  value={form.justification}
                  onChange={handleChange}
                  required
                  className="input-elite"
                  placeholder="O futuro não é sorte, é seleção. Conte-nos por que você merece estar entre os 50 selecionados..."
                  rows={4}
                />
              </div>

              {/* Error */}
              {status === 'error' && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                  <p className="font-body text-sm text-red-300">{errorMsg}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-magnetic btn-primary w-full text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submeter minha aplicação
                  </>
                )}
              </button>

              <p className="font-mono text-[10px] text-zinc-600 text-center">
                Seus dados são processados com segurança. Apenas 50 perfis serão selecionados.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
