import { useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { privacySignalActive, setConsent, useConsent } from '@/lib/analytics'
import { setUsageConsent, useUsageLog } from '@/lib/usageLog'

/** Two independent, opt-in choices: visit counting (Google Analytics) and the visitor's own usage log. */
export function ConsentBanner() {
  const { bannerOpen } = useConsent()
  const usage = useUsageLog()
  const blocked = privacySignalActive()
  const open = bannerOpen || (usage.consent === 'unset' && !blocked)
  return open ? <Preferences /> : null
}

/** Mounted only while open, so the switches start from what the visitor already chose. */
function Preferences() {
  const analyticsState = useConsent()
  const usage = useUsageLog()
  const [analytics, setAnalytics] = useState(analyticsState.consent === 'granted')
  const [log, setLog] = useState(usage.consent === 'granted')
  const blocked = privacySignalActive()

  const save = (a: boolean, l: boolean) => {
    setConsent(a ? 'granted' : 'denied')
    setUsageConsent(l ? 'granted' : 'denied')
  }

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
      className="pointer-events-auto w-[calc(100vw-1.5rem)] rounded-lg border border-hairline bg-white p-5 shadow-modal sm:w-[28rem]"
    >
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-tint-sky text-charcoal">
          <ShieldCheck className="size-[18px]" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="consent-title" className="text-[17px]">
            Suas escolhas de privacidade
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-slate">
            Tudo vem <strong>desligado</strong>. Você pode ligar o que quiser e mudar depois em &quot;Preferências de
            cookies&quot;. O site funciona igual sem nenhuma das duas.
          </p>

          {blocked && (
            <p className="mt-2 text-sm text-steel">
              Seu navegador pede para não ser rastreado (Global Privacy Control ou Do Not Track), então as duas opções
              ficam desligadas.
            </p>
          )}

          <div className="mt-4 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Label htmlFor="opt-analytics" className="text-sm font-medium">
                  Contar visitas (Google Analytics)
                </Label>
                <p className="mt-0.5 text-xs leading-relaxed text-steel">
                  Usa cookies. Só conta acessos, nunca candidatos, perfil ou prioridades.
                </p>
              </div>
              <Switch id="opt-analytics" checked={analytics && !blocked} disabled={blocked} onCheckedChange={setAnalytics} />
            </div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <Label htmlFor="opt-log" className="text-sm font-medium">
                  Registrar o que eu vejo para melhorar
                </Label>
                <p className="mt-0.5 text-xs leading-relaxed text-steel">
                  Guarda as etapas, abas, temas e candidatos que você abre. Isso pode indicar seus interesses, por isso é
                  opcional. Anônimo, e você vê, baixa e apaga em &quot;Meu registro de uso&quot;.
                </p>
              </div>
              <Switch id="opt-log" checked={log && !blocked} disabled={blocked} onCheckedChange={setLog} />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Button size="lg" onClick={() => save(analytics && !blocked, log && !blocked)}>
              Salvar escolhas
            </Button>
            <Button size="lg" variant="outline" onClick={() => save(false, false)}>
              Recusar tudo
            </Button>
          </div>
          <p className="mt-3 text-xs text-steel">
            O seu feedback (&quot;faz sentido&quot; ou &quot;não faz sentido&quot;) é sempre voluntário e funciona com tudo
            desligado.
          </p>
        </div>
      </div>
    </div>
  )
}
