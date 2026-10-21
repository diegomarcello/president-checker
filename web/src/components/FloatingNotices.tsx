import { Sparkles } from 'lucide-react'
import { ConsentBanner } from '@/components/ConsentBanner'
import { cn } from '@/lib/utils'

/** Always-visible, small notice about AI-generated content. */
function AiNotice() {
  return (
    <p
      role="note"
      className="pointer-events-auto flex max-w-[15.5rem] items-start gap-2 rounded-lg border border-hairline bg-white/95 px-3 py-2 text-xs leading-snug text-slate shadow-card backdrop-blur sm:max-w-xs sm:text-[13px]"
    >
      <Sparkles className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
      <span>
        Informações coletadas e organizadas por <strong className="font-semibold text-ink">IA</strong>. Podem conter
        erros: confira a fonte citada.
      </span>
    </p>
  )
}

/**
 * Bottom-left stack: cookie notice on top, AI notice below, both fixed.
 * On the wizard page it rises above the fixed navigation bar.
 */
export function FloatingNotices({ aboveWizardBar }: { aboveWizardBar: boolean }) {
  return (
    <div
      className={cn(
        'pointer-events-none fixed left-3 z-[60] flex flex-col items-start gap-2 sm:left-5',
        aboveWizardBar ? 'bottom-[5.25rem]' : 'bottom-3 sm:bottom-5',
      )}
    >
      <ConsentBanner />
      <AiNotice />
    </div>
  )
}
