import { useState } from 'react'
import { CheckCircle2, ThumbsDown, ThumbsUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import type { ThemeId } from '@/data/types'
import { MAX_COMMENT, submitFeedback, useFeedback, type Verdict } from '@/lib/usageLog'
import { cn } from '@/lib/utils'

interface Props {
  /** Stable id of the section, e.g. "mapa:economia". Never contains a candidate. */
  section: string
  /** Human label shown in the user's own log. */
  label: string
  prompt?: string
  /** Candidates on screen: stored only when the visitor allowed navigation logging. */
  candidates?: string[]
  theme?: ThemeId
  className?: string
}

/** "Faz sentido / Não faz sentido" for the section being viewed, with an optional description. */
export function SectionFeedback({ section, label, prompt = 'Isto faz sentido para você?', candidates, theme, className }: Props) {
  const current = useFeedback(section)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [thanks, setThanks] = useState(false)

  const send = (verdict: Verdict, comment?: string) =>
    submitFeedback({ key: section, section, label, verdict, comment, candidates, theme })

  const vote = (verdict: Verdict) => {
    setDraft(current?.verdict === verdict ? (current.comment ?? '') : '')
    setThanks(false)
    send(verdict, current?.verdict === verdict ? current.comment : undefined)
    setOpen(true)
  }

  const saveComment = () => {
    if (!current) return
    send(current.verdict, draft)
    setOpen(false)
    setThanks(true)
  }

  const closeWithoutComment = () => {
    setOpen(false)
    setThanks(true)
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-x-3 gap-y-2 text-sm', className)}>
      <span className="text-steel">{prompt}</span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <div role="group" aria-label={`Feedback sobre: ${label}`} className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant={current?.verdict === 'faz-sentido' ? 'default' : 'outline'}
              aria-pressed={current?.verdict === 'faz-sentido'}
              onClick={() => vote('faz-sentido')}
            >
              <ThumbsUp /> Faz sentido
            </Button>
            <Button
              type="button"
              size="sm"
              variant={current?.verdict === 'nao-faz-sentido' ? 'default' : 'outline'}
              aria-pressed={current?.verdict === 'nao-faz-sentido'}
              onClick={() => vote('nao-faz-sentido')}
              className={cn(current?.verdict === 'nao-faz-sentido' && 'bg-ink-deep hover:bg-ink-deep')}
            >
              <ThumbsDown /> Não faz sentido
            </Button>
          </div>
        </PopoverAnchor>
        <PopoverContent align="start" className="w-[min(22rem,calc(100vw-2rem))] space-y-3">
          <div>
            <p className="text-sm font-semibold">
              {current?.verdict === 'nao-faz-sentido' ? 'O que não faz sentido? ' : 'Quer explicar? '}
              <span className="font-normal text-steel">(opcional)</span>
            </p>
            <p className="mt-1 text-xs text-steel">Não escreva dados pessoais. Seu voto já foi registrado.</p>
          </div>
          <label className="sr-only" htmlFor={`fb-${section}`}>
            Descrição opcional
          </label>
          <Textarea
            id={`fb-${section}`}
            value={draft}
            maxLength={MAX_COMMENT}
            rows={4}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ex.: este ponto forte não se aplica ao meu caso porque…"
          />
          <p className="text-right text-xs text-steel">
            {draft.length}/{MAX_COMMENT}
          </p>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={closeWithoutComment}>
              Agora não
            </Button>
            <Button type="button" size="sm" onClick={saveComment} disabled={draft.trim() === '' && !current?.comment}>
              Enviar descrição
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      {(thanks || current) && !open && (
        <span className="inline-flex items-center gap-1 text-xs text-success" role="status">
          <CheckCircle2 className="size-3.5" aria-hidden />
          {current?.comment ? 'Feedback e descrição registrados' : 'Feedback registrado'}
        </span>
      )}
    </div>
  )
}
