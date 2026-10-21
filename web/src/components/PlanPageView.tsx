import { useRef, useState } from 'react'
import type { PageBox } from '@/data/types'
import { LINE, MARGIN, PAGE_H, PAGE_W, type PageContent } from '@/lib/planDocument'
import { cn } from '@/lib/utils'

export type AnnotationTone = 'official' | 'selected' | 'community' | 'mine' | 'focus'

export interface Annotation {
  id: string
  box: PageBox
  tone: AnnotationTone
  caption?: string
}

const TONE: Record<AnnotationTone, string> = {
  official: 'border-success bg-success/15',
  selected: 'border-primary bg-primary/15 ring-2 ring-primary/40',
  community: 'border-dashed border-link bg-link/10',
  mine: 'border-dashed border-brand-orange bg-brand-orange/10',
  focus: 'border-dashed border-link bg-link/15 ring-2 ring-link/40',
}

const CAPTION_TONE: Record<AnnotationTone, string> = {
  official: 'bg-success text-white',
  selected: 'bg-primary text-white',
  community: 'bg-link text-white',
  mine: 'bg-brand-orange text-white',
  focus: 'bg-link text-white',
}

interface Props {
  content: PageContent
  title: string
  annotations: Annotation[]
  /** When true, the visitor can drag an area or tap a paragraph to label it. */
  labeling: boolean
  draft: PageBox | null
  onPick: (box: PageBox, blockIndex?: number) => void
}

const clamp = (n: number) => Math.min(1, Math.max(0, n))

/** One page of the plan with highlighted boxes and, in labeling mode, an interaction layer. */
export function PlanPageView({ content, title, annotations, labeling, draft, onPick }: Props) {
  const layer = useRef<HTMLDivElement>(null)
  const start = useRef<{ x: number; y: number; id: number; px: number; py: number } | null>(null)
  const [drag, setDrag] = useState<PageBox | null>(null)

  const point = (e: React.PointerEvent) => {
    const r = layer.current!.getBoundingClientRect()
    return { x: clamp((e.clientX - r.left) / r.width), y: clamp((e.clientY - r.top) / r.height), px: e.clientX, py: e.clientY }
  }

  const down = (e: React.PointerEvent) => {
    if (e.button !== 0) return
    const p = point(e)
    start.current = { x: p.x, y: p.y, id: e.pointerId, px: p.px, py: p.py }
  }

  const move = (e: React.PointerEvent) => {
    const s = start.current
    if (!s) return
    const p = point(e)
    if (!drag && Math.hypot(p.px - s.px, p.py - s.py) < 6) return
    if (!drag) layer.current?.setPointerCapture(s.id)
    setDrag({ x: Math.min(s.x, p.x), y: Math.min(s.y, p.y), w: Math.abs(p.x - s.x), h: Math.abs(p.y - s.y) })
  }

  const up = () => {
    const box = drag
    start.current = null
    setDrag(null)
    if (box && box.w > 0.03 && box.h > 0.012) onPick(box)
  }

  return (
    <div
      className="relative overflow-hidden rounded-md border border-hairline bg-white shadow-card select-none"
      style={{ aspectRatio: `${PAGE_W} / ${PAGE_H}` }}
    >
      <svg viewBox={`0 0 ${PAGE_W} ${PAGE_H}`} className="absolute inset-0 size-full" role="img" aria-label={`${title}, página ${content.number}. ${content.heading}.`}>
        <rect width={PAGE_W} height={PAGE_H} fill="#fff" />
        <text x={MARGIN} y={42} fontSize="9" fill="#787671">
          {title}
        </text>
        <line x1={MARGIN} y1={52} x2={PAGE_W - MARGIN} y2={52} stroke="#e5e3df" />
        <text x={MARGIN} y={104} fontSize="19" fontWeight="600" fill="#1a1a1a">
          {content.heading}
        </text>
        {content.blocks.map((b, i) => (
          <text key={i} fontSize="11" fill={b.promiseId ? '#000' : '#37352f'} fontWeight={b.promiseId ? 600 : 400}>
            {b.lines.map((line, li) => (
              <tspan key={li} x={MARGIN} y={b.y + li * LINE}>
                {line}
              </tspan>
            ))}
          </text>
        ))}
        <text x={PAGE_W / 2} y={PAGE_H - 28} fontSize="9" fill="#787671" textAnchor="middle">
          {content.number}
        </text>
      </svg>

      <div className="pointer-events-none absolute inset-0">
        {annotations.map((a) => (
          <div
            key={a.id}
            className={cn('absolute rounded-sm border-2', TONE[a.tone])}
            style={{ left: `${a.box.x * 100}%`, top: `${a.box.y * 100}%`, width: `${a.box.w * 100}%`, height: `${a.box.h * 100}%` }}
          >
            {a.caption && (
              <span className={cn('absolute -top-5 left-0 rounded-sm px-1.5 py-0.5 text-[10px] leading-none font-semibold whitespace-nowrap', CAPTION_TONE[a.tone])}>
                {a.caption}
              </span>
            )}
          </div>
        ))}
        {draft && (
          <div
            className="absolute rounded-sm border-2 border-dashed border-primary bg-primary/15"
            style={{ left: `${draft.x * 100}%`, top: `${draft.y * 100}%`, width: `${draft.w * 100}%`, height: `${draft.h * 100}%` }}
          />
        )}
        {drag && (
          <div
            className="absolute rounded-sm border-2 border-dashed border-primary bg-primary/20"
            style={{ left: `${drag.x * 100}%`, top: `${drag.y * 100}%`, width: `${drag.w * 100}%`, height: `${drag.h * 100}%` }}
          />
        )}
      </div>

      {labeling && (
        <div
          ref={layer}
          className="absolute inset-0 cursor-crosshair touch-none"
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={() => {
            start.current = null
            setDrag(null)
          }}
        >
          {content.blocks.map((b, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Marcar o parágrafo ${i + 1}: ${b.lines.join(' ').slice(0, 90)}…`}
              onClick={() => onPick(b.box, i)}
              className="absolute rounded-sm border border-transparent hover:border-primary/60 hover:bg-primary/10 focus-visible:border-primary focus-visible:bg-primary/10 focus-visible:outline-none"
              style={{ left: `${b.box.x * 100}%`, top: `${b.box.y * 100}%`, width: `${b.box.w * 100}%`, height: `${b.box.h * 100}%` }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
