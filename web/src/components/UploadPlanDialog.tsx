import { useEffect, useRef, useState } from 'react'
import { CheckCircle2, FileUp, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { OFFICES, OFFICE_BY_VALUE } from '@/data/offices'
import { UFS, UF_BY_SIGLA } from '@/data/ufs'
import type { Candidate, OfficeType } from '@/data/types'
import { simulateUploadedPlan } from '@/lib/upload'

const STAGES = [
  'Validando o PDF',
  'Extraindo texto e estrutura',
  'Identificando propostas',
  'Classificando por tema',
  'Gerando o índice de busca',
]

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  uploadCount: number
  onProcessed: (candidate: Candidate) => void
}

export function UploadPlanDialog({ open, onOpenChange, uploadCount, onProcessed }: Props) {
  const [busy, setBusy] = useState(false)
  return (
    <Dialog open={open} onOpenChange={(o) => !busy && onOpenChange(o)}>
      <DialogContent className="max-w-lg rounded-lg shadow-modal">
        {/* Mounted only while open, so the form state resets on close. */}
        <UploadBody
          uploadCount={uploadCount}
          onBusy={setBusy}
          onCancel={() => onOpenChange(false)}
          onProcessed={(c) => {
            setBusy(false)
            onProcessed(c)
            onOpenChange(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

interface BodyProps {
  uploadCount: number
  onBusy: (busy: boolean) => void
  onCancel: () => void
  onProcessed: (candidate: Candidate) => void
}

function UploadBody({ uploadCount, onBusy, onCancel, onProcessed }: BodyProps) {
  const [file, setFile] = useState<File | null>(null)
  const [name, setName] = useState('')
  const [type, setType] = useState<OfficeType>('presidente')
  const [uf, setUf] = useState('')
  const [city, setCity] = useState('')
  const [hood, setHood] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<number | null>(null)
  const timer = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (timer.current) window.clearInterval(timer.current)
    },
    [],
  )

  const processing = progress !== null
  const stage = progress === null ? 0 : Math.min(STAGES.length - 1, Math.floor((progress / 100) * STAGES.length))

  const submit = () => {
    if (!file) return setError('Selecione um arquivo PDF.')
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      return setError('O arquivo precisa estar em PDF.')
    }
    if (file.size > 25 * 1024 * 1024) return setError('O PDF deve ter até 25 MB.')
    if (!name.trim()) return setError('Informe o nome do candidato.')
    setError(null)
    setProgress(0)
    onBusy(true)
    let value = 0
    timer.current = window.setInterval(() => {
      value += 4
      setProgress(Math.min(100, value))
      if (value >= 100) {
        if (timer.current) window.clearInterval(timer.current)
        const hasLocation = OFFICE_BY_VALUE[type].hasLocation
        const place = [hood.trim(), city.trim(), uf ? UF_BY_SIGLA[uf].sigla : ''].filter(Boolean).join(', ')
        onProcessed(
          simulateUploadedPlan({
            file,
            name: name.trim(),
            type,
            office: place && hasLocation ? `${OFFICE_BY_VALUE[type].label} · ${place}` : OFFICE_BY_VALUE[type].label,
            location:
              hasLocation && uf ? { uf, city: city.trim() || undefined, neighborhood: hood.trim() || undefined } : undefined,
            index: uploadCount,
          }),
        )
      }
    }, 90)
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-[22px]">Adicionar político por PDF</DialogTitle>
        <DialogDescription>
          O plano vale só para a sua visita e recebe o selo <strong>não verificado</strong>. Neste protótipo, o
          arquivo não sai do seu navegador e a análise é simulada.
        </DialogDescription>
      </DialogHeader>

      {processing ? (
        <div className="space-y-4 py-2" role="status" aria-live="polite">
          <Progress value={progress} className="h-2" />
          <ul className="space-y-2 text-sm">
            {STAGES.map((s, i) => (
              <li key={s} className={i <= stage ? 'text-ink' : 'text-stone'}>
                <span className="inline-flex items-center gap-2">
                  {i < stage ? (
                    <CheckCircle2 className="size-4 text-success" aria-hidden />
                  ) : i === stage ? (
                    <Loader2 className="size-4 animate-spin text-primary" aria-hidden />
                  ) : (
                    <span className="size-4 rounded-full border border-hairline-strong" aria-hidden />
                  )}
                  {s}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="plan-file">Arquivo PDF do plano de governo</Label>
            <label
              htmlFor="plan-file"
              className="flex cursor-pointer items-center gap-3 rounded-md border border-dashed border-input bg-surface px-4 py-4 text-sm text-slate focus-within:ring-[3px] focus-within:ring-ring/40"
            >
              <FileUp className="size-5 shrink-0 text-primary" aria-hidden />
              <span className="truncate">{file ? file.name : 'Selecionar PDF (até 25 MB)'}</span>
              <input
                id="plan-file"
                type="file"
                accept="application/pdf,.pdf"
                className="sr-only"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="plan-name">Nome do político</Label>
            <Input
              id="plan-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11"
              placeholder="Ex.: Maria da Silva"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="plan-office">Cargo</Label>
            <Select value={type} onValueChange={(v) => setType(v as OfficeType)}>
              <SelectTrigger id="plan-office" className="h-11 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {OFFICES.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {OFFICE_BY_VALUE[type].hasLocation && (
            <fieldset className="space-y-3 rounded-md border border-hairline p-3">
              <legend className="px-1 text-sm text-steel">Local de atuação (opcional)</legend>
              <Select value={uf} onValueChange={setUf}>
                <SelectTrigger className="h-11 w-full" aria-label="Estado">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  {UFS.slice()
                    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
                    .map((u) => (
                      <SelectItem key={u.sigla} value={u.sigla}>
                        {u.nome}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input aria-label="Cidade" value={city} onChange={(e) => setCity(e.target.value)} className="h-11" placeholder="Cidade" />
                <Input aria-label="Bairro" value={hood} onChange={(e) => setHood(e.target.value)} className="h-11" placeholder="Bairro" />
              </div>
            </fieldset>
          )}
          {error && (
            <p role="alert" className="text-sm font-medium text-danger">
              {error}
            </p>
          )}
          <DialogFooter className="gap-2 sm:gap-2">
            <Button type="button" variant="outline" size="lg" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" size="lg">
              Processar plano
            </Button>
          </DialogFooter>
        </form>
      )}
    </>
  )
}
