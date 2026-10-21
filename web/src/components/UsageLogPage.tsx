import { useMemo } from 'react'
import { Download, MessageSquare, ThumbsDown, ThumbsUp, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { SubPageHeader } from '@/components/SubPageHeader'
import { THEME_BY_ID } from '@/data/themes'
import type { Candidate } from '@/data/types'
import { privacySignalActive } from '@/lib/analytics'
import { STEPS } from '@/lib/steps'
import {
  clearUsageLog,
  exportUsageLog,
  setUsageConsent,
  useUsageLog,
  type LogEntry,
  type LogEvent,
} from '@/lib/usageLog'

const STEP_LABEL = Object.fromEntries(STEPS.map((s) => [s.value, s.label])) as Record<string, string>
const ROUTE_LABEL: Record<string, string> = {
  home: 'a página inicial',
  candidato: 'a página de um candidato',
  curadoria: 'a Curadoria',
  'em-exercicio': 'o Painel em exercício',
  documento: 'o documento do plano de',
  termos: 'os Termos de uso',
  registro: 'o Meu registro de uso',
}
const TAB_LABEL: Record<string, string> = { mapa: 'Mapa de risco', graficos: 'Gráficos', historico: 'Histórico' }

function describe(event: LogEvent, names: Map<string, string>): string {
  const nameOf = (id: string) => names.get(id) ?? id
  switch (event.type) {
    case 'route':
      return `Abriu ${ROUTE_LABEL[event.name] ?? event.name}${event.candidate ? `: ${nameOf(event.candidate)}` : ''}`
    case 'step':
      return `Viu a etapa "${STEP_LABEL[event.step] ?? event.step}"`
    case 'tab':
      return `Abriu a aba "${TAB_LABEL[event.tab] ?? event.tab}"`
    case 'theme_open':
      return `Abriu o tema "${THEME_BY_ID[event.theme]?.label ?? event.theme}"`
    case 'compare':
      return `Comparou: ${event.candidates.map(nameOf).join(', ')}`
    case 'feedback':
      return `${event.verdict === 'faz-sentido' ? 'Faz sentido' : 'Não faz sentido'} · ${event.label}${
        event.candidates?.length ? ` (candidatos: ${event.candidates.map(nameOf).join(', ')})` : ''
      }`
  }
}

function Row({ entry, names }: { entry: LogEntry; names: Map<string, string> }) {
  const e = entry.event
  const time = new Date(entry.at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'medium' })
  return (
    <li className="flex gap-3 border-t border-hairline-soft py-3 first:border-t-0">
      <span className="mt-0.5 shrink-0 text-steel">
        {e.type === 'feedback' ? (
          e.verdict === 'faz-sentido' ? (
            <ThumbsUp className="size-4 text-success" aria-label="Faz sentido" />
          ) : (
            <ThumbsDown className="size-4 text-danger" aria-label="Não faz sentido" />
          )
        ) : (
          <span className="block size-2 rounded-full bg-stone" aria-hidden />
        )}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium">{describe(e, names)}</p>
        {e.type === 'feedback' && e.comment && (
          <p className="mt-1 flex gap-1.5 rounded-md bg-surface p-2 text-sm text-slate">
            <MessageSquare className="mt-0.5 size-3.5 shrink-0" aria-hidden /> {e.comment}
          </p>
        )}
        <p className="mt-0.5 text-xs text-steel">{time}</p>
      </div>
    </li>
  )
}

export function UsageLogPage({ candidates }: { candidates: Candidate[] }) {
  const { entries, consent } = useUsageLog()
  const names = useMemo(() => new Map(candidates.map((c) => [c.id, c.name])), [candidates])
  const blocked = privacySignalActive()
  const feedbackCount = entries.filter((e) => e.event.type === 'feedback').length
  const ordered = entries.slice().reverse()

  const download = () => {
    const blob = new Blob([exportUsageLog()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'meu-registro-confere.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-white">
      <SubPageHeader />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-8 sm:py-14">
        <p className="text-micro-caps text-link">Meu registro de uso</p>
        <h1 className="text-display mt-3">O que o Confere guarda sobre a sua visita</h1>
        <p className="mt-4 text-lg text-slate">
          Aqui você vê, baixa e apaga tudo. O registro é anônimo: não tem nome, perfil, IP nem identificação de pessoa.
        </p>

        <section className="mt-8 rounded-lg border border-hairline p-5" aria-labelledby="consent-section">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Label htmlFor="log-consent" id="consent-section" className="text-[17px] font-semibold">
                Registrar o que eu vejo
              </Label>
              <p className="mt-1 text-sm leading-relaxed text-slate">
                Guarda etapas, abas, temas e candidatos que você abre, para entender o que ajuda ou confunde. Pode indicar
                seus interesses, por isso só funciona se você ligar. Ao desligar, o histórico de navegação é apagado.
              </p>
              {blocked && (
                <p className="mt-2 text-sm text-steel">
                  Seu navegador pede para não ser rastreado, então esta opção fica desligada.
                </p>
              )}
            </div>
            <Switch
              id="log-consent"
              checked={consent === 'granted'}
              disabled={blocked}
              onCheckedChange={(v) => setUsageConsent(v ? 'granted' : 'denied')}
            />
          </div>
          <p className="mt-4 rounded-md bg-tint-sky p-3 text-sm text-charcoal">
            O seu feedback (&quot;faz sentido&quot; ou &quot;não faz sentido&quot;, com descrição opcional) é sempre
            voluntário e fica aqui mesmo com o registro desligado. Nesse caso, ele não leva o candidato nem o tema da tela.
          </p>
        </section>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-steel" role="status">
            {entries.length} {entries.length === 1 ? 'item' : 'itens'} · {feedbackCount}{' '}
            {feedbackCount === 1 ? 'feedback' : 'feedbacks'}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={download} disabled={entries.length === 0}>
              <Download /> Baixar (JSON)
            </Button>
            <Button variant="outline" onClick={clearUsageLog} disabled={entries.length === 0}>
              <Trash2 /> Apagar tudo
            </Button>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-hairline px-4">
          {ordered.length > 0 ? (
            <ul aria-label="Itens do registro, do mais recente para o mais antigo">
              {ordered.map((e) => (
                <Row key={e.id} entry={e} names={names} />
              ))}
            </ul>
          ) : (
            <p className="py-10 text-center text-slate">
              {consent === 'granted'
                ? 'Nada registrado ainda. Navegue pela comparação e volte aqui.'
                : 'O registro de navegação está desligado e você ainda não deu nenhum feedback.'}
            </p>
          )}
        </div>

        <p className="mt-8 rounded-lg bg-surface p-5 text-sm text-steel">
          Protótipo: o registro fica só neste navegador e nada é enviado a um servidor. Na versão real, ele seria enviado a
          um sistema próprio (nunca ao Google Analytics), com prazo de retenção curto, acesso restrito e relatórios só em
          agregado.
        </p>
      </main>
    </div>
  )
}
