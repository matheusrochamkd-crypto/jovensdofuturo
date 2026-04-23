import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { enrichLeadData } from '../lib/gemini'
import {
  Users, TrendingUp, MapPin, Briefcase, CalendarDays,
  RefreshCw, Shield, ChevronLeft, Search, Eye, X,
  UserCheck, Clock, BarChart3, Globe, Linkedin, Phone, Mail,
  ChevronDown, ChevronUp, Sparkles, Instagram, ExternalLink,
  Target, Award
} from 'lucide-react'
import { getCandidates } from '../lib/supabase'

const genderLabels = {
  masculino: 'Masculino',
  feminino: 'Feminino',
  outro: 'Outro',
  prefiro_nao_dizer: 'Prefiro não dizer',
}

export default function Admin() {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(true) // Desabilitado conforme pedido
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState(false)
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [sortField, setSortField] = useState('created_at')
  const [sortDir, setSortDir] = useState('desc')

  const handleLogin = (e) => {
    e.preventDefault()
    // Simple but effective gatekeeper for the event
    if (password === 'SJP-FUTURO-2026') {
      setIsAuthenticated(true)
      localStorage.setItem('admin_auth', 'true')
    } else {
      setAuthError(true)
      setTimeout(() => setAuthError(false), 2000)
    }
  }

  useEffect(() => {
    if (localStorage.getItem('admin_auth') === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const fetchCandidates = async () => {
    setLoading(true)
    try {
      const data = await getCandidates()
      setCandidates(data)
    } catch (err) {
      console.error('Error fetching candidates:', err)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCandidates()
  }, [])

  // ─── METRICS ──────────────────────────────────────────────────
  const metrics = useMemo(() => {
    const total = candidates.length
    const ages = candidates.map(c => c.age).filter(Boolean)
    const avgAge = ages.length ? (ages.reduce((a, b) => a + b, 0) / ages.length).toFixed(1) : 0

    const genderCount = {}
    candidates.forEach(c => {
      if (c.gender) genderCount[c.gender] = (genderCount[c.gender] || 0) + 1
    })

    const cityCount = {}
    candidates.forEach(c => {
      if (c.city) cityCount[c.city] = (cityCount[c.city] || 0) + 1
    })
    const topCities = Object.entries(cityCount).sort((a, b) => b[1] - a[1]).slice(0, 5)

    const areaCount = {}
    candidates.forEach(c => {
      if (c.area) areaCount[c.area] = (areaCount[c.area] || 0) + 1
    })
    const topAreas = Object.entries(areaCount).sort((a, b) => b[1] - a[1]).slice(0, 5)

    const institutionCount = {}
    candidates.forEach(c => {
      if (c.institution) institutionCount[c.institution] = (institutionCount[c.institution] || 0) + 1
    })
    const topInstitutions = Object.entries(institutionCount).sort((a, b) => b[1] - a[1]).slice(0, 5)

    // Age distribution
    const ageRanges = { '14-17': 0, '18-21': 0, '22-25': 0, '26-30': 0, '31+': 0 }
    ages.forEach(age => {
      if (age <= 17) ageRanges['14-17']++
      else if (age <= 21) ageRanges['18-21']++
      else if (age <= 25) ageRanges['22-25']++
      else if (age <= 30) ageRanges['26-30']++
      else ageRanges['31+']++
    })

    // Signups per day (last 7 days)
    const dailySignups = {}
    candidates.forEach(c => {
      const day = new Date(c.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
      dailySignups[day] = (dailySignups[day] || 0) + 1
    })

    return { total, avgAge, genderCount, topCities, topAreas, topInstitutions, ageRanges, dailySignups }
  }, [candidates])

  // ─── FILTERED + SORTED ───────────────────────────────────────
  const filtered = useMemo(() => {
    let list = candidates
    if (searchTerm) {
      const q = searchTerm.toLowerCase()
      list = list.filter(c =>
        c.full_name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.city?.toLowerCase().includes(q) ||
        c.institution?.toLowerCase().includes(q) ||
        c.area?.toLowerCase().includes(q)
      )
    }
    return list.sort((a, b) => {
      const aVal = a[sortField] || ''
      const bVal = b[sortField] || ''
      if (sortDir === 'asc') return aVal > bVal ? 1 : -1
      return aVal < bVal ? 1 : -1
    })
  }, [candidates, searchTerm, sortField, sortDir])

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
  }

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null
    return sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
  }

  // ─── BAR HELPER ──────────────────────────────────────────────
  const handleStatusUpdate = async (id, status) => {
    setActionLoading(status)
    try {
      const { updateCandidateStatus } = await import('../lib/supabase')
      await updateCandidateStatus(id, status)
      await fetchCandidates()
      if (selectedCandidate) {
        setSelectedCandidate(prev => ({ ...prev, status }))
      }
    } catch (err) {
      console.error('Error updating status:', err)
    }
    setActionLoading(null)
  }

  const handleSendTicket = async (id) => {
    setActionLoading('email')
    try {
      const { sendEmail } = await import('../lib/supabase')
      await sendEmail('golden_ticket', id)
      alert('Golden Ticket enviado com sucesso!')
    } catch (err) {
      console.error('Error sending ticket:', err)
      alert('Erro ao enviar e-mail. Verifique os logs.')
    }
    setActionLoading(null)
  }

  const handleEnrich = async (candidate) => {
    setActionLoading('enrich')
    try {
      // Removendo simulação hardcoded para evitar links errados.
      // O Gemini tentará usar seu conhecimento ou processar apenas os dados reais.
      const enrichment = await enrichLeadData(candidate, "")
      
      if (enrichment) {
        const { enrichCandidate } = await import('../lib/supabase')
        const updated = await enrichCandidate(candidate.id, enrichment)
        await fetchCandidates()
        setSelectedCandidate(updated)
      }
    } catch (err) {
      console.error('Error enriching lead:', err)
      alert('Erro ao enriquecer lead.')
    }
    setActionLoading(null)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-deep-slate flex items-center justify-center p-6 font-mono">
        <div className="absolute inset-0 bg-accent/5 blur-[120px]" />
        <div className="card-surface p-8 w-full max-w-md relative z-10 border-accent/20">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-accent" />
            </div>
            <h1 className="font-heading font-bold text-xl text-white uppercase tracking-widest">
              Acesso Restrito
            </h1>
            <p className="text-zinc-500 text-xs mt-2">
              Digite o código de acesso para entrar n'O CÉREBRO.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="PASSWORD_PROTOCOL"
                className={`input-elite text-center tracking-[0.5em] ${authError ? 'border-red-500 shadow-red-500/20' : ''}`}
                autoFocus
              />
            </div>
            <button type="submit" className="btn-magnetic btn-primary w-full py-4">
              Autenticar
            </button>
            {authError && (
              <p className="text-red-500 text-[10px] text-center">
                ACESSO NEGADO. TENTE NOVAMENTE.
              </p>
            )}
          </form>
        </div>
      </div>
    )
  }

  const BarChart = ({ data, color = 'bg-accent', maxItems = 5 }) => {
    const max = Math.max(...Object.values(data), 1)
    const entries = Object.entries(data).slice(0, maxItems)
    return (
      <div className="space-y-2.5">
        {entries.map(([label, value]) => (
          <div key={label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-zinc-300 truncate max-w-[65%]">{label}</span>
              <span className="text-[11px] text-accent font-bold">{value}</span>
            </div>
            <div className="h-1.5 bg-accent/5 rounded-full overflow-hidden">
              <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${(value / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-deep-slate text-white font-mono">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-accent/10 px-6 py-4 bg-deep-slate/90 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1 text-zinc-500 hover:text-accent transition-colors text-xs"
            >
              <ChevronLeft className="w-4 h-4" />
              Landing
            </button>
            <div className="w-px h-6 bg-accent/10" />
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent" />
              <span className="text-sm text-white font-semibold tracking-tight-custom font-heading">
                ADMIN — O CÉREBRO
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchCandidates}
              className="flex items-center gap-2 text-xs text-zinc-400 hover:text-accent transition-colors px-3 py-1.5 rounded-lg border border-accent/10 hover:border-accent/30"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] text-accent/60">ONLINE</span>
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 py-8">

        {/* ─── KPI CARDS ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Inscritos', value: metrics.total, icon: Users, color: 'text-accent', glow: 'shadow-accent/10' },
            { label: 'Idade Média', value: metrics.avgAge, icon: TrendingUp, color: 'text-blue-400', glow: 'shadow-blue-400/10' },
            { label: 'Cidades', value: metrics.topCities.length, icon: MapPin, color: 'text-purple-400', glow: 'shadow-purple-400/10' },
            { label: 'Áreas', value: metrics.topAreas.length, icon: Briefcase, color: 'text-amber-400', glow: 'shadow-amber-400/10' },
          ].map((stat, i) => (
            <div key={i} className={`bg-surface rounded-[2rem] border border-accent/5 p-6 shadow-lg ${stat.glow}`}>
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-[9px] text-zinc-600 uppercase tracking-widest">{stat.label}</span>
              </div>
              <span className={`text-4xl font-bold ${stat.color} font-heading`}>{stat.value}</span>
            </div>
          ))}
        </div>

        {/* ─── ANALYTICS GRID ────────────────────────────────── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">

          {/* Gender Distribution */}
          <div className="bg-surface rounded-[2rem] border border-accent/5 p-6">
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 className="w-4 h-4 text-accent/40" />
              <span className="text-[10px] text-accent/40 uppercase tracking-wider">Distribuição por Gênero</span>
            </div>
            {Object.keys(metrics.genderCount).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(metrics.genderCount).map(([gender, count]) => {
                  const pct = metrics.total ? ((count / metrics.total) * 100).toFixed(0) : 0
                  const colors = {
                    masculino: 'bg-blue-400',
                    feminino: 'bg-pink-400',
                    outro: 'bg-purple-400',
                    prefiro_nao_dizer: 'bg-zinc-500'
                  }
                  return (
                    <div key={gender}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] text-zinc-300">{genderLabels[gender] || gender}</span>
                        <span className="text-[11px] text-zinc-400">{count} ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-accent/5 rounded-full overflow-hidden">
                        <div className={`h-full ${colors[gender] || 'bg-accent'} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-xs text-zinc-600">Nenhum dado ainda</p>
            )}
          </div>

          {/* Age Distribution */}
          <div className="bg-surface rounded-[2rem] border border-accent/5 p-6">
            <div className="flex items-center gap-2 mb-5">
              <CalendarDays className="w-4 h-4 text-accent/40" />
              <span className="text-[10px] text-accent/40 uppercase tracking-wider">Faixa Etária</span>
            </div>
            <BarChart data={metrics.ageRanges} />
          </div>

          {/* Top Cities */}
          <div className="bg-surface rounded-[2rem] border border-accent/5 p-6">
            <div className="flex items-center gap-2 mb-5">
              <Globe className="w-4 h-4 text-accent/40" />
              <span className="text-[10px] text-accent/40 uppercase tracking-wider">Top Cidades</span>
            </div>
            {metrics.topCities.length > 0 ? (
              <BarChart data={Object.fromEntries(metrics.topCities)} color="bg-purple-400" />
            ) : (
              <p className="text-xs text-zinc-600">Nenhum dado ainda</p>
            )}
          </div>

          {/* Top Areas */}
          <div className="bg-surface rounded-[2rem] border border-accent/5 p-6">
            <div className="flex items-center gap-2 mb-5">
              <Briefcase className="w-4 h-4 text-accent/40" />
              <span className="text-[10px] text-accent/40 uppercase tracking-wider">Top Áreas de Atuação</span>
            </div>
            {metrics.topAreas.length > 0 ? (
              <BarChart data={Object.fromEntries(metrics.topAreas)} color="bg-amber-400" />
            ) : (
              <p className="text-xs text-zinc-600">Nenhum dado ainda</p>
            )}
          </div>

          {/* Top Institutions */}
          <div className="bg-surface rounded-[2rem] border border-accent/5 p-6">
            <div className="flex items-center gap-2 mb-5">
              <Briefcase className="w-4 h-4 text-accent/40" />
              <span className="text-[10px] text-accent/40 uppercase tracking-wider">Top Instituições</span>
            </div>
            {metrics.topInstitutions.length > 0 ? (
              <BarChart data={Object.fromEntries(metrics.topInstitutions)} color="bg-blue-400" />
            ) : (
              <p className="text-xs text-zinc-600">Nenhum dado ainda</p>
            )}
          </div>

          {/* Signups Timeline */}
          <div className="bg-surface rounded-[2rem] border border-accent/5 p-6">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="w-4 h-4 text-accent/40" />
              <span className="text-[10px] text-accent/40 uppercase tracking-wider">Inscrições por Dia</span>
            </div>
            {Object.keys(metrics.dailySignups).length > 0 ? (
              <BarChart data={metrics.dailySignups} />
            ) : (
              <p className="text-xs text-zinc-600">Nenhum dado ainda</p>
            )}
          </div>
        </div>

        {/* ─── SEARCH + TABLE ────────────────────────────────── */}
        <div className="bg-surface rounded-[2rem] border border-accent/5 overflow-hidden">
          {/* Search Bar */}
          <div className="p-5 border-b border-accent/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-accent" />
              <span className="text-sm text-white font-heading font-semibold">
                Inscritos
              </span>
              <span className="text-[10px] text-zinc-600 ml-1">
                ({filtered.length} de {metrics.total})
              </span>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome, email, cidade..."
                className="w-full pl-9 pr-4 py-2 bg-deep-slate rounded-xl border border-accent/10 focus:border-accent/30 text-xs text-zinc-300 placeholder:text-zinc-600 outline-none transition-colors"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-16 text-center">
              <RefreshCw className="w-6 h-6 text-accent animate-spin mx-auto mb-3" />
              <p className="text-xs text-zinc-500">Carregando inscritos...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center">
              <Users className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
              <p className="text-sm text-zinc-500">Nenhum inscrito encontrado.</p>
              <p className="text-[10px] text-zinc-700 mt-1">
                {searchTerm ? 'Tente um termo diferente.' : 'Os inscritos aparecerão aqui após submissão.'}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-accent/5">
                      <th onClick={() => handleSort('full_name')} className="text-left p-4 text-accent/40 font-normal uppercase tracking-wider cursor-pointer hover:text-accent transition-colors">
                        <span className="flex items-center gap-1">Nome <SortIcon field="full_name" /></span>
                      </th>
                      <th onClick={() => handleSort('age')} className="text-center p-4 text-accent/40 font-normal uppercase tracking-wider cursor-pointer hover:text-accent transition-colors hidden md:table-cell">
                        <span className="flex items-center justify-center gap-1">Idade <SortIcon field="age" /></span>
                      </th>
                      <th className="text-center p-4 text-accent/40 font-normal uppercase tracking-wider hidden md:table-cell">Gênero</th>
                      <th onClick={() => handleSort('city')} className="text-left p-4 text-accent/40 font-normal uppercase tracking-wider cursor-pointer hover:text-accent transition-colors hidden lg:table-cell">
                        <span className="flex items-center gap-1">Cidade <SortIcon field="city" /></span>
                      </th>
                      <th className="text-left p-4 text-accent/40 font-normal uppercase tracking-wider hidden lg:table-cell">Área</th>
                      <th onClick={() => handleSort('created_at')} className="text-left p-4 text-accent/40 font-normal uppercase tracking-wider cursor-pointer hover:text-accent transition-colors hidden xl:table-cell">
                        <span className="flex items-center gap-1">Data <SortIcon field="created_at" /></span>
                      </th>
                      <th className="text-center p-4 text-accent/40 font-normal uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c) => (
                      <tr
                        key={c.id}
                        className="border-b border-accent/5 hover:bg-accent/[0.02] transition-colors"
                      >
                        <td className="p-4">
                          <span className="text-white font-medium block">{c.full_name}</span>
                          <span className="text-[10px] text-zinc-600 block mt-0.5">{c.email}</span>
                        </td>
                        <td className="p-4 text-center text-zinc-400 hidden md:table-cell">{c.age || '—'}</td>
                        <td className="p-4 text-center text-zinc-400 hidden md:table-cell">
                          {c.gender ? (
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] ${
                              c.gender === 'masculino' ? 'bg-blue-400/10 text-blue-400' :
                              c.gender === 'feminino' ? 'bg-pink-400/10 text-pink-400' :
                              'bg-zinc-500/10 text-zinc-400'
                            }`}>
                              {genderLabels[c.gender]?.[0] || '?'}
                            </span>
                          ) : '—'}
                        </td>
                        <td className="p-4 text-zinc-400 hidden lg:table-cell">{c.city || '—'}</td>
                        <td className="p-4 text-zinc-400 hidden lg:table-cell">{c.area || '—'}</td>
                        <td className="p-4 text-zinc-500 hidden xl:table-cell">
                          {new Date(c.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => setSelectedCandidate(c)}
                            className="p-2 rounded-lg bg-accent/5 text-accent/60 hover:bg-accent/10 hover:text-accent transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-accent/5">
                {filtered.map((c) => (
                  <div key={c.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-medium truncate">{c.full_name}</span>
                        <span className={`px-1.5 py-0.5 rounded-md text-[8px] border ${
                          c.status === 'aprovado' ? 'bg-accent/10 text-accent border-accent/20' :
                          c.status === 'rejeitado' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                          'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
                        }`}>
                          {c.status === 'aprovado' ? 'APV' : c.status === 'rejeitado' ? 'REJ' : 'PEND'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-zinc-500">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {c.city || 'SJP'}</span>
                        <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {c.area || 'Diversos'}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedCandidate(c)}
                      className="p-3 rounded-xl bg-accent/5 text-accent/60 active:scale-95 transition-transform"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ─── DETAIL MODAL ──────────────────────────────────── */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedCandidate(null)} />
          <div className="relative bg-surface rounded-[2rem] border border-accent/10 w-full max-w-2xl max-h-[85vh] overflow-y-auto p-8 md:p-10 shadow-2xl shadow-black/50">
            {/* Close */}
            <button
              onClick={() => setSelectedCandidate(null)}
              className="absolute top-6 right-6 p-2 rounded-lg bg-accent/5 text-zinc-500 hover:text-accent transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="mb-8">
              <span className="font-mono text-[10px] text-accent/40 uppercase tracking-wider">Perfil do Inscrito</span>
              <h3 className="font-heading font-bold text-2xl text-white mt-2">
                {selectedCandidate.full_name}
              </h3>
              <div className="flex items-center gap-3 mt-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] border ${
                  selectedCandidate.status === 'aprovado' ? 'bg-accent/10 text-accent border-accent/20' :
                  selectedCandidate.status === 'rejeitado' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                  'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                }`}>
                  <UserCheck className="w-3 h-3" />
                  {selectedCandidate.status === 'aprovado' ? 'Aprovado' : 
                   selectedCandidate.status === 'rejeitado' ? 'Rejeitado' : 'Pendente'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mb-8 pb-8 border-b border-accent/5">
              <button
                onClick={() => handleStatusUpdate(selectedCandidate.id, 'aprovado')}
                disabled={actionLoading === 'aprovado'}
                className={`btn-magnetic px-6 py-2.5 text-[10px] ${selectedCandidate.status === 'aprovado' ? 'bg-accent text-deep-slate opacity-50 cursor-not-allowed' : 'btn-primary'}`}
              >
                {actionLoading === 'aprovado' ? 'Processando...' : 'Aprovar'}
              </button>
              <button
                onClick={() => handleStatusUpdate(selectedCandidate.id, 'rejeitado')}
                disabled={actionLoading === 'rejeitado'}
                className="btn-magnetic btn-outline px-6 py-2.5 text-[10px] border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white"
              >
                {actionLoading === 'rejeitado' ? 'Processando...' : 'Rejeitar'}
              </button>
              {selectedCandidate.status === 'aprovado' && (
                <button
                  onClick={() => handleSendTicket(selectedCandidate.id)}
                  disabled={actionLoading === 'email'}
                  className="btn-magnetic btn-outline px-6 py-2.5 text-[10px] border-accent/30 text-accent"
                >
                  {actionLoading === 'email' ? 'Enviando...' : 'Enviar Golden Ticket'}
                </button>
              )}
              <button
                onClick={() => handleEnrich(selectedCandidate)}
                disabled={actionLoading === 'enrich'}
                className="btn-magnetic flex items-center gap-2 px-6 py-2.5 text-[10px] bg-gradient-to-r from-accent to-emerald-500 text-deep-slate font-bold hover:scale-[1.05] transition-transform"
              >
                {actionLoading === 'enrich' ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  <Sparkles className="w-3 h-3" />
                )}
                {actionLoading === 'enrich' ? 'Enriquecendo...' : 'Enriquecer com IA'}
              </button>
            </div>

            {/* AI Enrichment Data Section */}
            {selectedCandidate.enrichment_data && Object.keys(selectedCandidate.enrichment_data).length > 0 && (
              <div className="mb-8 p-6 rounded-[1.5rem] bg-accent/5 border border-accent/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <Sparkles className="w-8 h-8 text-accent/10" />
                </div>
                <h4 className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-widest mb-4">
                  <Target className="w-4 h-4" /> Inteligência do Lead
                </h4>
                
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                      <span className="text-[10px] text-accent/40 uppercase block mb-1">Score de Fit</span>
                      <div className="flex items-center gap-3">
                        <div className="h-2 flex-1 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-accent rounded-full" 
                            style={{ width: `${(selectedCandidate.enrichment_data.fit_score || 0) * 10}%` }} 
                          />
                        </div>
                        <span className="text-accent font-bold text-lg">
                          {selectedCandidate.enrichment_data.fit_score}/10
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] text-accent/40 uppercase block">Resumo do Perfil</span>
                      <p className="text-zinc-300 text-xs leading-relaxed italic">
                        "{selectedCandidate.enrichment_data.summary}"
                      </p>
                    </div>
                    <div className="space-y-2">
                      <span className="text-[9px] text-accent/40 uppercase block">Interesses & Tópicos</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedCandidate.enrichment_data.interests?.map((tag, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-accent/10 text-accent text-[9px] border border-accent/20">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-accent/10 flex items-center gap-6">
                    {selectedCandidate.enrichment_data.linkedin_url && (
                      <a 
                        href={selectedCandidate.enrichment_data.linkedin_url.startsWith('http') ? selectedCandidate.enrichment_data.linkedin_url : `https://${selectedCandidate.enrichment_data.linkedin_url}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors text-[10px]"
                      >
                        <Linkedin className="w-3.5 h-3.5" /> LinkedIn <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                    {selectedCandidate.enrichment_data.instagram_handle && (
                      <a 
                        href={`https://instagram.com/${selectedCandidate.enrichment_data.instagram_handle.replace('@', '')}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-pink-400 hover:text-pink-300 transition-colors text-[10px]"
                      >
                        <Instagram className="w-3.5 h-3.5" /> Instagram <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-5 text-xs">
              <div className="space-y-1">
                <span className="text-accent/30 uppercase tracking-wider text-[9px] flex items-center gap-1.5">
                  <Mail className="w-3 h-3" /> Email
                </span>
                <p className="text-zinc-300">{selectedCandidate.email}</p>
              </div>
              <div className="space-y-1">
                <span className="text-accent/30 uppercase tracking-wider text-[9px] flex items-center gap-1.5">
                  <Phone className="w-3 h-3" /> Telefone
                </span>
                <p className="text-zinc-300">{selectedCandidate.phone}</p>
              </div>
              <div className="space-y-1">
                <span className="text-accent/30 uppercase tracking-wider text-[9px]">Idade</span>
                <p className="text-zinc-300">{selectedCandidate.age ? `${selectedCandidate.age} anos` : '—'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-accent/30 uppercase tracking-wider text-[9px]">Gênero</span>
                <p className="text-zinc-300">{genderLabels[selectedCandidate.gender] || '—'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-accent/30 uppercase tracking-wider text-[9px] flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" /> Cidade
                </span>
                <p className="text-zinc-300">{selectedCandidate.city || '—'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-accent/30 uppercase tracking-wider text-[9px]">Instituição</span>
                <p className="text-zinc-300">{selectedCandidate.institution || '—'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-accent/30 uppercase tracking-wider text-[9px]">Área</span>
                <p className="text-zinc-300">{selectedCandidate.area || '—'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-accent/30 uppercase tracking-wider text-[9px] flex items-center gap-1.5">
                  <CalendarDays className="w-3 h-3" /> Data de Inscrição
                </span>
                <p className="text-zinc-300">
                  {new Date(selectedCandidate.created_at).toLocaleDateString('pt-BR', {
                    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              </div>
              {selectedCandidate.linkedin && (
                <div className="col-span-2 space-y-1">
                  <span className="text-accent/30 uppercase tracking-wider text-[9px] flex items-center gap-1.5">
                    <Linkedin className="w-3 h-3" /> LinkedIn
                  </span>
                  <a href={selectedCandidate.linkedin} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline break-all">
                    {selectedCandidate.linkedin}
                  </a>
                </div>
              )}
              <div className="col-span-2 space-y-1 pt-4 border-t border-accent/5">
                <span className="text-accent/30 uppercase tracking-wider text-[9px]">Justificativa</span>
                <p className="text-zinc-300 leading-relaxed font-body">{selectedCandidate.justification || '—'}</p>
              </div>
              {selectedCandidate.qr_code_token && (
                <div className="col-span-2 space-y-1 pt-4 border-t border-accent/5">
                  <span className="text-accent/30 uppercase tracking-wider text-[9px]">QR Code Token (Check-in)</span>
                  <p className="text-accent break-all bg-accent/5 p-3 rounded-xl">{selectedCandidate.qr_code_token}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
