import { useState } from 'react'
import { CheckCircle2, FileUp, Globe, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { THEME_BY_ID } from '@/data/themes'
import type { Candidate, Submission, SubmissionKind, SubmissionType } from '@/data/types'
import { formatSize, hostOf, parseWebUrl } from '@/lib/submissions'

const MAX_FILE = 25 * 1024 * 1024
const ACCEPT = '.pdf,.png,.jpg,.jpeg,.docx,.xlsx,.csv'
const NONE = 'none'

interface Props {
  candidate: Candidate
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (s: Submission) => void
}

export function SubmitContributionDialog({ candidate, open, onOpenChange, onSubmit }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-xl overflow-y-auto rounded-lg shadow-modal">
        {/* Mounted only while open, so the form resets every time. */}
        <Body candidate={candidate} onClose={() => onOpenChange(false)} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  )
}

function Body({
  candidate,
  onClose,
  onSubmit,
}: {
  candidate: Candidate
  onClose: () => void
  onSubmit: (s: Submission) => void
}) {
  const [kind, setKind] = useState<SubmissionKind>('site')
  const [type, setType] = useState<SubmissionType>('informacao')
  const [url, setUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [promiseId, setPromiseId] = useState(NONE)
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState<Submission | null>(null)

  const promises = candidate.mandate?.promises ?? []

  const submit = () => {
    if (kind === 'site') {
      if (!parseWebUrl(url)) return setError('Informe um link válido, começando com http:// ou https://.')
    } else {
      if (!file) return setError('Selecione um arquivo.')
      if (file.size > MAX_FILE) return setError('O arquivo deve ter até 25 MB.')
    }
    if (title.trim().length < 5) return setError('Dê um título curto que resuma a contribuição.')
    if (description.trim().length < 20) return setError('Explique em poucas frases o que a fonte mostra (mínimo de 20 caracteres).')
    if (!consent) return setError('Confirme que entendeu como a curadoria funciona.')
    setError(null)

    const submission: Submission = {
      id: `s-${Date.now()}`,
      candidateId: candidate.id,
      kind,
      type,
      title: title.trim(),
      description: description.trim(),
      ...(kind === 'site' ? { url: parseWebUrl(url)!.toString() } : { fileName: file!.name, fileSize: file!.size }),
      ...(promiseId !== NONE ? { promiseId } : {}),
      status: 'recebida',
      votes: 0,
      createdAt: new Date().toLocaleDateString('pt-BR'),
    }
    onSubmit(submission)
    setSent(submission)
  }

  if (sent) {
    return (
      <div className="space-y-5 py-2" role="status" aria-live="polite">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[22px]">
            <CheckCircle2 className="size-6 text-success" aria-hidden /> Contribuição enviada
          </DialogTitle>
          <DialogDescription>
            Ela entrou na fila da curadoria com o status <strong>Recebida</strong>. A aprovação e a inclusão aparecerão na
            tela de Curadoria, onde qualquer pessoa pode acompanhar e votar para priorizar a análise.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-md bg-tint-sky p-4 text-sm text-charcoal">
          <p className="font-semibold">{sent.title}</p>
          <p className="mt-1">
            {sent.kind === 'site' ? hostOf(sent.url!) : sent.fileName} · sobre {candidate.name}
          </p>
        </div>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" size="lg" onClick={onClose}>
            Fechar
          </Button>
          <Button asChild size="lg">
            <a href={`#/curadoria/${candidate.id}`}>Acompanhar na Curadoria</a>
          </Button>
        </DialogFooter>
      </div>
    )
  }

  return (
    <form
      className="min-w-0 space-y-5"
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
    >
      <DialogHeader>
        <DialogTitle className="text-[22px]">Enviar informação ou correção</DialogTitle>
        <DialogDescription>
          Sobre <strong>{candidate.name}</strong>. Envie um site ou um arquivo para a curadoria da plataforma avaliar.
        </DialogDescription>
      </DialogHeader>

      <p className="flex gap-2 rounded-md bg-tint-yellow p-3 text-sm text-charcoal" role="note">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
        <span>
          Nada entra no perfil automaticamente. A <strong>aprovação e a inclusão aparecerão na tela de Curadoria</strong>,
          que é pública. Só entram fontes públicas ou documentos comprováveis.
        </span>
      </p>

      <div className="space-y-2">
        <Label>O que você quer enviar?</Label>
        <ToggleGroup
          type="single"
          variant="outline"
          value={type}
          onValueChange={(v) => v && setType(v as SubmissionType)}
          aria-label="Tipo de contribuição"
          className="flex-wrap"
        >
          <ToggleGroupItem value="informacao" className="h-11 px-4 data-[state=on]:bg-ink-deep data-[state=on]:text-white">
            Informação adicional
          </ToggleGroupItem>
          <ToggleGroupItem value="correcao" className="h-11 px-4 data-[state=on]:bg-ink-deep data-[state=on]:text-white">
            Correção de informação
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="space-y-2">
        <Label>Fonte</Label>
        <ToggleGroup
          type="single"
          variant="outline"
          value={kind}
          onValueChange={(v) => v && setKind(v as SubmissionKind)}
          aria-label="Tipo de fonte"
          className="flex-wrap"
        >
          <ToggleGroupItem value="site" className="h-11 gap-2 px-4 data-[state=on]:bg-ink-deep data-[state=on]:text-white">
            <Globe className="size-4" aria-hidden /> Site
          </ToggleGroupItem>
          <ToggleGroupItem value="arquivo" className="h-11 gap-2 px-4 data-[state=on]:bg-ink-deep data-[state=on]:text-white">
            <FileUp className="size-4" aria-hidden /> Arquivo
          </ToggleGroupItem>
        </ToggleGroup>

        {kind === 'site' ? (
          <div className="space-y-1.5 pt-1">
            <Label htmlFor="c-url" className="text-sm font-normal text-slate">
              Link da fonte
            </Label>
            <Input
              id="c-url"
              type="url"
              inputMode="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="h-11 text-base"
              autoComplete="off"
            />
          </div>
        ) : (
          <div className="space-y-1.5 pt-1">
            <Label htmlFor="c-file" className="text-sm font-normal text-slate">
              Arquivo (PDF, imagem, DOCX, XLSX ou CSV, até 25 MB)
            </Label>
            <label
              htmlFor="c-file"
              className="flex cursor-pointer items-center gap-3 rounded-md border border-dashed border-input bg-surface px-4 py-4 text-sm text-slate focus-within:ring-[3px] focus-within:ring-ring/40"
            >
              <FileUp className="size-5 shrink-0 text-primary" aria-hidden />
              <span className="truncate">
                {file ? `${file.name} · ${formatSize(file.size)}` : 'Selecionar arquivo'}
              </span>
              <input
                id="c-file"
                type="file"
                accept={ACCEPT}
                className="sr-only"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="c-title">Título</Label>
        <Input
          id="c-title"
          value={title}
          maxLength={120}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex.: Painel oficial mostra 10 bases, não 8"
          className="h-11 text-base"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="c-desc">O que esta fonte mostra?</Label>
        <Textarea
          id="c-desc"
          value={description}
          maxLength={500}
          rows={4}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={
            type === 'correcao'
              ? 'Diga o que está errado no perfil e o que a fonte mostra de correto.'
              : 'Diga que informação nova a fonte traz e onde encontrá-la.'
          }
          className="text-base"
        />
        <p className="text-right text-xs text-steel">{description.length}/500</p>
      </div>

      {promises.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="c-promise">Sobre qual compromisso? (opcional)</Label>
          <Select value={promiseId} onValueChange={setPromiseId}>
            <SelectTrigger id="c-promise" className="h-11 w-full text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE}>Nenhum em especial</SelectItem>
              {promises.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {THEME_BY_ID[p.theme].short}: {p.text}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex items-start gap-3">
        <Checkbox id="c-consent" checked={consent} onCheckedChange={(v) => setConsent(v === true)} className="mt-0.5" />
        <Label htmlFor="c-consent" className="text-sm leading-relaxed font-normal text-slate">
          Entendo que a contribuição ficará visível na tela de Curadoria, que é pública, e que não devo enviar dados
          pessoais de terceiros. Neste protótipo, o arquivo não sai do meu navegador.
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
          Enviar para a curadoria
        </Button>
      </DialogFooter>
    </form>
  )
}
