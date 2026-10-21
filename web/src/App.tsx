import { useEffect, useMemo, useState } from 'react'
import { FloatingNotices } from '@/components/FloatingNotices'
import { ComparePage } from '@/components/ComparePage'
import { Faq } from '@/components/Faq'
import { CandidatePage } from '@/components/CandidatePage'
import { CuratoriaPage } from '@/components/CuratoriaPage'
import { DocumentViewerPage } from '@/components/DocumentViewerPage'
import { Hero } from '@/components/Hero'
import { IncumbentsDashboard } from '@/components/IncumbentsDashboard'
import { IncumbentsTeaser } from '@/components/IncumbentsTeaser'
import { HowItWorks } from '@/components/HowItWorks'
import { TermsPage } from '@/components/TermsPage'
import { UsageLogPage } from '@/components/UsageLogPage'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { UploadPlanDialog } from '@/components/UploadPlanDialog'
import { TooltipProvider } from '@/components/ui/tooltip'
import { CATALOG } from '@/data/candidates'
import { buildSeedLabels } from '@/data/labelSeeds'
import { SEED_SUBMISSIONS } from '@/data/submissions'
import type { Candidate, Profile, Submission, ThemeId, Weight } from '@/data/types'
import { initAnalytics, trackPageView } from '@/lib/analytics'
import { initUsageLog, logEvent } from '@/lib/usageLog'
import { EMPTY_PROFILE, suggestWeights } from '@/lib/profile'
import { useRoute } from '@/lib/route'
import type { Step } from '@/lib/steps'

const MAX_CANDIDATES = 3

function App() {
  const { route, navigate } = useRoute()
  const [uploads, setUploads] = useState<Candidate[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE)
  const [overrides, setOverrides] = useState<Partial<Record<ThemeId, Weight>>>({})
  const [step, setStep] = useState<Step>('perfil')
  const [uploadOpen, setUploadOpen] = useState(false)
  const [submissions, setSubmissions] = useState<Submission[]>(() => [...SEED_SUBMISSIONS, ...buildSeedLabels(CATALOG)])
  const [voted, setVoted] = useState<Set<string>>(new Set())

  const all = useMemo(() => [...CATALOG, ...uploads], [uploads])
  const chosen = useMemo(
    () => selected.map((id) => all.find((c) => c.id === id)).filter((c): c is Candidate => !!c),
    [selected, all],
  )

  const suggestion = useMemo(() => suggestWeights(profile), [profile])
  const weights = useMemo(
    () => ({ ...suggestion.weights, ...overrides }) as Record<ThemeId, Weight>,
    [suggestion, overrides],
  )

  const toggle = (id: string) =>
    setSelected((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : cur.length >= MAX_CANDIDATES ? cur : [...cur, id],
    )

  useEffect(() => {
    initAnalytics()
    initUsageLog()
  }, [])

  // Generic paths only: never a candidate id, filter, profile or priority (could reveal political preference).
  const routeName = route.name
  const stepKey = routeName === 'comparar' ? step : ''
  useEffect(() => {
    const pages = {
      home: { path: '/', title: 'Início' },
      comparar: { path: `/comparar/${stepKey}`, title: `Comparar · ${stepKey}` },
      candidato: { path: '/candidato', title: 'Dados do candidato' },
      curadoria: { path: '/curadoria', title: 'Curadoria' },
      termos: { path: '/termos', title: 'Termos de uso' },
      registro: { path: '/registro', title: 'Meu registro de uso' },
      'em-exercicio': { path: '/em-exercicio', title: 'Painel em exercício' },
      documento: { path: '/documento', title: 'Documento do plano' },
    } as const
    trackPageView(pages[routeName])
  }, [routeName, stepKey])

  // Own usage log (navigation events only with the visitor's separate consent).
  const candidateId = route.name === 'candidato' ? route.id : route.name === 'documento' ? route.candidate : undefined
  useEffect(() => {
    if (routeName === 'comparar') logEvent({ type: 'step', step: stepKey as Step })
    else logEvent({ type: 'route', name: routeName, ...(candidateId ? { candidate: candidateId } : {}) })
  }, [routeName, stepKey, candidateId])

  const addSubmission = (s: Submission) => setSubmissions((cur) => [s, ...cur])

  const toggleVote = (id: string) => {
    const had = voted.has(id)
    setVoted((cur) => {
      const next = new Set(cur)
      if (had) next.delete(id)
      else next.add(id)
      return next
    })
    setSubmissions((cur) => cur.map((s) => (s.id === id ? { ...s, votes: s.votes + (had ? -1 : 1) } : s)))
  }

  const start = () => {
    setStep('perfil')
    navigate({ name: 'comparar' })
  }

  const compareWith = (id: string) => {
    setSelected([id])
    setStep('perfil')
    navigate({ name: 'comparar' })
  }

  const restart = () => {
    setSelected([])
    setProfile(EMPTY_PROFILE)
    setOverrides({})
    setUploads([])
    setStep('perfil')
  }

  return (
    <TooltipProvider>
      {route.name === 'documento' ? (
        <DocumentViewerPage
          key={`${route.candidate}:${route.promise ?? ''}:${route.label ?? ''}`}
          candidate={CATALOG.find((c) => c.id === route.candidate)}
          initialPromiseId={route.promise}
          focusLabelId={route.label}
          submissions={submissions}
          voted={voted}
          onVote={toggleVote}
          onSubmit={addSubmission}
        />
      ) : route.name === 'em-exercicio' ? (
        <IncumbentsDashboard
          candidates={CATALOG}
          onOpen={(id) => navigate({ name: 'candidato', id })}
          onCompare={compareWith}
        />
      ) : route.name === 'registro' ? (
        <UsageLogPage candidates={all} />
      ) : route.name === 'termos' ? (
        <TermsPage />
      ) : route.name === 'curadoria' ? (
        <CuratoriaPage
          key={route.candidate ?? 'todos'}
          candidates={CATALOG}
          submissions={submissions}
          voted={voted}
          onVote={toggleVote}
          initialCandidate={route.candidate}
        />
      ) : route.name === 'candidato' ? (
        <CandidatePage
          candidate={CATALOG.find((c) => c.id === route.id)}
          onCompare={compareWith}
          submissions={submissions}
          onSubmit={addSubmission}
        />
      ) : route.name === 'comparar' ? (
        <>
          <ComparePage
            step={step}
            onStep={setStep}
            onExit={() => navigate({ name: 'home' })}
            all={all}
            chosen={chosen}
            max={MAX_CANDIDATES}
            onToggle={toggle}
            onUpload={() => setUploadOpen(true)}
            profile={profile}
            onProfile={setProfile}
            weights={weights}
            reasons={suggestion.reasons}
            overridden={Object.keys(overrides) as ThemeId[]}
            onWeight={(id, w) => setOverrides((o) => ({ ...o, [id]: w }))}
            onResetWeights={() => setOverrides({})}
            onRestart={restart}
          />
          <UploadPlanDialog
            open={uploadOpen}
            onOpenChange={setUploadOpen}
            uploadCount={uploads.length}
            onProcessed={(c) => {
              setUploads((u) => (u.some((x) => x.id === c.id) ? u : [...u, c]))
              setSelected((cur) => (cur.includes(c.id) || cur.length >= MAX_CANDIDATES ? cur : [...cur, c.id]))
            }}
          />
        </>
      ) : (
        <>
          <SiteHeader onStart={start} />
          <main>
            <Hero onStart={start} />
            <IncumbentsTeaser candidates={CATALOG} onOpen={() => navigate({ name: 'em-exercicio' })} />
            <HowItWorks onStart={start} />
            <Faq />
          </main>
          <SiteFooter />
        </>
      )}
      <FloatingNotices aboveWizardBar={route.name === 'comparar'} />
    </TooltipProvider>
  )
}

export default App
