import {
  Bar,
  BarChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { LEVEL_COLOR, LEVEL_LABEL } from '@/lib/analysis'
import type { Candidate, RiskLevel } from '@/data/types'

function candidateConfig(candidates: Candidate[]): ChartConfig {
  return Object.fromEntries(
    candidates.map((c) => [c.id, { label: c.name, color: c.color }]),
  ) as ChartConfig
}

interface ThemeRow {
  tema: string
  [candidateId: string]: string | number
}

export function AdequacyRadar({ candidates, data }: { candidates: Candidate[]; data: ThemeRow[] }) {
  return (
    <ChartContainer config={candidateConfig(candidates)} className="mx-auto aspect-auto h-[340px] w-full max-w-[520px]">
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke="var(--hairline)" />
        <PolarAngleAxis dataKey="tema" tick={{ fontSize: 12, fill: 'var(--slate)' }} />
        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        {candidates.map((c) => (
          <Radar
            key={c.id}
            dataKey={c.id}
            stroke={`var(--color-${c.id})`}
            fill={`var(--color-${c.id})`}
            fillOpacity={0.14}
            strokeWidth={2}
            dot={{ r: 3, fillOpacity: 1 }}
          />
        ))}
        <ChartLegend itemSorter={null} content={<ChartLegendContent />} />
      </RadarChart>
    </ChartContainer>
  )
}

export function ConcretenessBars({ candidates, data }: { candidates: Candidate[]; data: ThemeRow[] }) {
  return (
    <ChartContainer config={candidateConfig(candidates)} className="aspect-auto h-[340px] w-full">
      <BarChart data={data} margin={{ left: -12, right: 4, top: 8 }}>
        <CartesianGrid vertical={false} stroke="var(--hairline-soft)" />
        <XAxis dataKey="tema" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: 'var(--slate)' }} interval={0} />
        <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: 'var(--steel)' }} width={40} />
        <ChartTooltip content={<ChartTooltipContent />} />
        {candidates.map((c) => (
          <Bar key={c.id} dataKey={c.id} fill={`var(--color-${c.id})`} radius={[4, 4, 0, 0]} />
        ))}
        <ChartLegend itemSorter={null} content={<ChartLegendContent />} />
      </BarChart>
    </ChartContainer>
  )
}

const LEVELS: RiskLevel[] = ['baixo', 'medio', 'alto', 'lacuna']

export function RiskDistribution({
  data,
}: {
  data: ({ name: string } & Record<RiskLevel, number>)[]
}) {
  const config = Object.fromEntries(
    LEVELS.map((l) => [l, { label: LEVEL_LABEL[l], color: LEVEL_COLOR[l] }]),
  ) as ChartConfig
  return (
    <ChartContainer
      config={config}
      className="aspect-auto w-full"
      style={{ height: Math.max(180, data.length * 64 + 56) }}
    >
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }} barSize={26}>
        <CartesianGrid horizontal={false} stroke="var(--hairline-soft)" />
        <XAxis type="number" domain={[0, 6]} ticks={[0, 2, 4, 6]} allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: 'var(--steel)' }} />
        <YAxis
          type="category"
          dataKey="name"
          width={96}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: 'var(--charcoal)' }}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        {LEVELS.map((l, i) => (
          <Bar
            key={l}
            dataKey={l}
            stackId="risk"
            fill={`var(--color-${l})`}
            radius={i === LEVELS.length - 1 ? [0, 4, 4, 0] : 0}
          />
        ))}
        <ChartLegend itemSorter={null} content={<ChartLegendContent />} />
      </BarChart>
    </ChartContainer>
  )
}
