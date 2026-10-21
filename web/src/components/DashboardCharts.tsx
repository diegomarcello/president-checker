import { Bar, BarChart, CartesianGrid, Cell, Label, Pie, PieChart, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import type { PromiseStatus } from '@/data/types'
import { STATUS_COLOR, STATUS_ORDER } from '@/lib/mandate'

const STATUS_CONFIG: ChartConfig = {
  concluida: { label: 'Concluído', color: STATUS_COLOR.concluida },
  andamento: { label: 'Em andamento / parcial', color: STATUS_COLOR.andamento },
  pendente: { label: 'Pendente / não entregue', color: STATUS_COLOR.pendente },
}

type Counts = Record<PromiseStatus, number>
export type NamedCounts = { name: string } & Counts

const tick = { fontSize: 12, fill: 'var(--slate)' }

/** One stacked bar per politician: how many commitments are in each situation. */
export function StatusByPolitician({ data }: { data: NamedCounts[] }) {
  return (
    <ChartContainer
      config={STATUS_CONFIG}
      className="aspect-auto w-full"
      style={{ height: Math.max(200, data.length * 54 + 70) }}
    >
      <BarChart data={data} layout="vertical" margin={{ left: 4, right: 16 }} barSize={24}>
        <CartesianGrid horizontal={false} stroke="var(--hairline-soft)" />
        <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} tick={{ ...tick, fill: 'var(--steel)' }} />
        <YAxis type="category" dataKey="name" width={104} tickLine={false} axisLine={false} tick={tick} />
        <ChartTooltip content={<ChartTooltipContent />} />
        {STATUS_ORDER.map((s, i) => (
          <Bar key={s} dataKey={s} stackId="s" fill={`var(--color-${s})`} radius={i === STATUS_ORDER.length - 1 ? [0, 4, 4, 0] : 0} />
        ))}
        <ChartLegend itemSorter={null} content={<ChartLegendContent />} />
      </BarChart>
    </ChartContainer>
  )
}

/** Commitments by theme, stacked by situation. */
export function StatusByTheme({ data }: { data: NamedCounts[] }) {
  return (
    <ChartContainer config={STATUS_CONFIG} className="aspect-auto h-[300px] w-full">
      <BarChart data={data} margin={{ left: -12, right: 4, top: 8 }}>
        <CartesianGrid vertical={false} stroke="var(--hairline-soft)" />
        <XAxis dataKey="name" interval={0} tickLine={false} axisLine={false} tick={tick} />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={36} tick={{ ...tick, fill: 'var(--steel)' }} />
        <ChartTooltip content={<ChartTooltipContent />} />
        {STATUS_ORDER.map((s, i) => (
          <Bar key={s} dataKey={s} stackId="s" fill={`var(--color-${s})`} radius={i === STATUS_ORDER.length - 1 ? [4, 4, 0, 0] : 0} />
        ))}
        <ChartLegend itemSorter={null} content={<ChartLegendContent />} />
      </BarChart>
    </ChartContainer>
  )
}

/** Overall share of each situation. */
export function StatusDonut({ counts, total }: { counts: Counts; total: number }) {
  const data = STATUS_ORDER.map((s) => ({ status: s, value: counts[s] }))
  return (
    <ChartContainer config={STATUS_CONFIG} className="mx-auto aspect-square h-[260px] w-full max-w-[300px]">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="status" />} />
        <Pie data={data} dataKey="value" nameKey="status" innerRadius={74} outerRadius={104} paddingAngle={2} strokeWidth={0}>
          {data.map((d) => (
            <Cell key={d.status} fill={`var(--color-${d.status})`} />
          ))}
          <Label
            content={({ viewBox }) =>
              viewBox && 'cx' in viewBox ? (
                <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                  <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) - 6} className="fill-ink text-3xl font-semibold">
                    {total}
                  </tspan>
                  <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 18} className="fill-steel text-xs">
                    compromissos
                  </tspan>
                </text>
              ) : null
            }
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}
