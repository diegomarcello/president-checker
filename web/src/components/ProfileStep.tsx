import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { BrazilTileMap } from '@/components/BrazilTileMap'
import { PriorityEditor } from '@/components/PriorityEditor'
import { SectionFeedback } from '@/components/SectionFeedback'
import { UF_BY_SIGLA } from '@/data/ufs'
import type { Profile, ThemeId, Weight } from '@/data/types'
import {
  EMPTY_PROFILE,
  FAIXAS_ETARIAS,
  FAIXAS_RENDA,
  MORADIAS,
  RAMOS,
  VINCULOS,
  profileIsFilled,
} from '@/lib/profile'

const NONE = 'none'

interface Props {
  profile: Profile
  onProfile: (p: Profile) => void
  weights: Record<ThemeId, Weight>
  reasons: Record<ThemeId, string[]>
  overridden: ThemeId[]
  onWeight: (id: ThemeId, w: Weight) => void
  onResetWeights: () => void
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      {children}
    </div>
  )
}

function OptionSelect({
  id,
  value,
  placeholder = 'Prefiro não informar',
  options,
  onChange,
}: {
  id: string
  value: string | null
  placeholder?: string
  options: { value: string; label: string }[]
  onChange: (v: string | null) => void
}) {
  return (
    <Select value={value ?? ''} onValueChange={(v) => onChange(v === NONE ? null : v)}>
      <SelectTrigger id={id} className="h-11 w-full border-input text-base">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={NONE}>Prefiro não informar</SelectItem>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function ProfileStep(props: Props) {
  const { profile, onProfile } = props
  const set = <K extends keyof Profile>(key: K, value: Profile[K]) => onProfile({ ...profile, [key]: value })
  const rendaOptions = FAIXAS_RENDA.map((label, i) => ({ value: String(i), label }))

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <div className="space-y-6">
        <Card className="gap-5 rounded-lg shadow-none">
          <CardHeader>
            <CardTitle className="text-[22px]">Onde você vive</CardTitle>
            <CardDescription>
              {profile.uf
                ? `${UF_BY_SIGLA[profile.uf].nome} selecionado. Toque de novo para limpar.`
                : 'Toque no seu estado. Usamos só para destacar propostas regionais.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <BrazilTileMap value={profile.uf} onChange={(uf) => set('uf', uf)} />
            <Field id="municipio" label="Município (opcional)">
              <Input
                id="municipio"
                value={profile.municipio}
                onChange={(e) => set('municipio', e.target.value)}
                placeholder="Ex.: Campinas"
                className="h-11 text-base"
                autoComplete="off"
              />
            </Field>
          </CardContent>
        </Card>

        <Card className="gap-5 rounded-lg shadow-none">
          <CardHeader>
            <CardTitle className="text-[22px]">Sua vida profissional</CardTitle>
            <CardDescription>Tudo em faixas. Nenhum campo é obrigatório.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            <Field id="faixa-etaria" label="Faixa etária">
              <OptionSelect
                id="faixa-etaria"
                value={profile.faixaEtaria}
                options={FAIXAS_ETARIAS.map((f) => ({ value: f, label: `${f} anos` }))}
                onChange={(v) => set('faixaEtaria', v)}
              />
            </Field>
            <Field id="vinculo" label="Vínculo de trabalho">
              <OptionSelect id="vinculo" value={profile.vinculo} options={VINCULOS} onChange={(v) => set('vinculo', v)} />
            </Field>
            <Field id="ramo" label="Ramo de atuação">
              <OptionSelect id="ramo" value={profile.ramo} options={RAMOS} onChange={(v) => set('ramo', v)} />
            </Field>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Moradia</Label>
              <ToggleGroup
                type="single"
                variant="outline"
                value={profile.moradia ?? ''}
                onValueChange={(v) => set('moradia', v || null)}
                aria-label="Situação de moradia"
                className="flex-wrap"
              >
                {MORADIAS.map((m) => (
                  <ToggleGroupItem
                    key={m.value}
                    value={m.value}
                    className="h-11 px-4 data-[state=on]:bg-ink-deep data-[state=on]:text-white"
                  >
                    {m.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
            <Field id="renda-atual" label="Renda atual">
              <OptionSelect
                id="renda-atual"
                value={profile.rendaAtual === null ? null : String(profile.rendaAtual)}
                options={rendaOptions}
                onChange={(v) => set('rendaAtual', v === null ? null : Number(v))}
              />
            </Field>
            <Field id="renda-futura" label="Renda esperada em 5 anos">
              <OptionSelect
                id="renda-futura"
                value={profile.rendaFutura === null ? null : String(profile.rendaFutura)}
                options={rendaOptions}
                onChange={(v) => set('rendaFutura', v === null ? null : Number(v))}
              />
            </Field>
            <div className="flex items-center justify-between gap-4 rounded-md border border-hairline bg-surface-soft px-4 py-3 sm:col-span-2">
              <Label htmlFor="filhos" className="text-sm font-medium">
                Moro com filhos em idade escolar
              </Label>
              <Switch id="filhos" checked={profile.filhos} onCheckedChange={(v) => set('filhos', v)} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <aside className="flex items-start gap-3 rounded-lg bg-tint-sky p-5 text-charcoal">
          <Lock className="mt-0.5 size-5 shrink-0" aria-hidden />
          <div className="text-sm leading-relaxed">
            <p className="font-semibold">Seus dados ficam com você</p>
            <p className="mt-1">
              Nada é enviado nem salvo: o perfil existe só nesta página. Não pedimos nome, CPF, e-mail nem
              preferência política.
            </p>
          </div>
        </aside>

        <Card className="gap-5 rounded-lg shadow-none">
          <CardHeader>
            <CardTitle className="text-[22px]">O que pesa mais para você</CardTitle>
            <CardDescription>
              Sugerimos a relevância de cada tema pelo seu perfil. A sua escolha sempre prevalece.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PriorityEditor
              weights={props.weights}
              reasons={props.reasons}
              overridden={props.overridden}
              onChange={props.onWeight}
              onReset={props.onResetWeights}
            />
            <SectionFeedback className="mt-5" section="perfil:prioridades" label="Seu perfil · prioridades sugeridas" prompt="As prioridades sugeridas fazem sentido?" />
          </CardContent>
        </Card>

        {profileIsFilled(profile) && (
          <Button variant="ghost" size="lg" onClick={() => onProfile(EMPTY_PROFILE)}>
            Limpar perfil
          </Button>
        )}
      </div>
    </div>
  )
}
