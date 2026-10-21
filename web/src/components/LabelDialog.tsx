import { useState } from 'react'
import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { THEMES } from '@/data/themes'
import type { Candidate, Mandate, PageBox, Submission, ThemeId } from '@/data/types'

const NEW = '__new'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  candidate: Candidate
  mandate: Mandate
  page: number
  box: PageBox | null
  excerpt: string
  defaultPromiseId?: string
  onSubmit: (s: Submission) => void
}

export function LabelDialog(props: Props) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-lg overflow-y-auto rounded-lg shadow-modal">
        {/* Mounted only while open, so the form starts clean every time. */}
        {props.box && <Body {...props} box={props.box} onClose={() => props.onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  )
}

function Body({ candidate, mandate, page, box, excerpt, defaultPromiseId, onSubmit, onClose }: Props & { box: PageBox; onClose: () => void }) {
  const [target, setTarget] = useState(defaultPromiseId ?? mandate.promises.find((p) => p.planPage === page)?.id ?? NEW)
  const [text, setText] = useState('')
  const [theme, setTheme] = useState<ThemeId>('economia')
  const [note, setNote] = useState('')
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const promise = mandate.promises.find((p) => p.id === target)

  const submit = () => {
    if (target === NEW && text.trim().length < 10) return setError('Descreva o compromisso com suas palavras (mínimo de 10 caracteres).')
    if (!consent) return setError('Confirme que entendeu como a curadoria funciona.')
    const isNew = target === NEW
    onSubmit({
      id: `s-${Date.now()}`,
      candidateId: candidate.id,
      kind: 'marcacao',
      type: 'marcacao',
      title: isNew ? `Novo compromisso na p. ${page}: ${text.trim()}` : `Marcação na p. ${page}: ${promise!.text}`,
      description: note.trim() || (isNew ? text.trim() : 'Trecho do plano da campanha onde este compromisso aparece.'),
      ...(isNew ? {} : { promiseId: target }),
      label: { page, box, ...(isNew ? { newPromise: { text: text.trim(), theme } } : {}) },
      status: 'recebida',
      votes: 0,
      createdAt: new Date().toLocaleDateString('pt-BR'),
    })
    onClose()
  }

  return (
    <form
      className="min-w-0 space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
    >
      <DialogHeader>
        <DialogTitle className="text-[22px]">O que está marcado?</DialogTitle>
        <DialogDescription>
          Página {page} do plano da campanha de {mandate.campaignYear}, de {candidate.name}.
        </DialogDescription>
      </DialogHeader>

      {excerpt && (
        <blockquote className="rounded-md border-l-4 border-primary bg-surface p-3 text-sm text-slate">
          <p className="text-micro-caps mb-1 text-steel">Trecho marcado</p>“{excerpt}”
        </blockquote>
      )}

      <div className="space-y-2">
        <Label htmlFor="lbl-target">Este trecho é de qual compromisso?</Label>
        <Select value={target} onValueChange={setTarget}>
          <SelectTrigger id="lbl-target" className="h-11 w-full text-base">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {mandate.promises.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.text}
              </SelectItem>
            ))}
            <SelectItem value={NEW}>Um compromisso que não está na lista</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {target === NEW && (
        <>
          <div className="space-y-2">
            <Label htmlFor="lbl-text">Qual é o compromisso?</Label>
            <Textarea id="lbl-text" rows={3} maxLength={200} value={text} onChange={(e) => setText(e.target.value)} placeholder="Ex.: Construir 10 creches até 2026" className="text-base" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lbl-theme">Tema</Label>
            <Select value={theme} onValueChange={(v) => setTheme(v as ThemeId)}>
              <SelectTrigger id="lbl-theme" className="h-11 w-full text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {THEMES.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="lbl-note">
          Observação <span className="font-normal text-steel">(opcional)</span>
        </Label>
        <Textarea id="lbl-note" rows={2} maxLength={300} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Algo que ajude a curadoria a conferir." className="text-base" />
      </div>

      <p className="flex gap-2 rounded-md bg-tint-yellow p-3 text-sm text-charcoal" role="note">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
        <span>A marcação vai para a fila da <strong>Curadoria</strong>, onde todos podem votar. Só vira oficial depois de aprovada.</span>
      </p>

      <div className="flex items-start gap-3">
        <Checkbox id="lbl-consent" checked={consent} onCheckedChange={(v) => setConsent(v === true)} className="mt-0.5" />
        <Label htmlFor="lbl-consent" className="text-sm leading-relaxed font-normal text-slate">
          Entendo que a marcação ficará visível na tela de Curadoria, que é pública.
        </Label>
      </div>

      {error && (
        <p role="alert" className="text-sm font-medium text-danger">
          {error}
        </p>
      )}

      <DialogFooter className="gap-2 sm:gap-2">
        <Button type="button" variant="outline" size="lg" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" size="lg">
          Enviar marcação
        </Button>
      </DialogFooter>
    </form>
  )
}
