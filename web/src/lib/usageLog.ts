import { useSyncExternalStore } from 'react'
import { privacySignalActive } from '@/lib/analytics'
import type { Step } from '@/lib/steps'
import type { ThemeId } from '@/data/types'

/**
 * Local usage log + section feedback.
 *
 * Privacy design (see docs/16):
 *  - Navigation events (what the visitor sees) are recorded ONLY with a separate, opt-in consent,
 *    because which candidates someone looks at can reveal political preference.
 *  - Feedback ("faz sentido" / "não faz sentido") is a voluntary, explicit gesture and is always
 *    recorded, but candidate context is attached only if the navigation consent was given.
 *  - The log is anonymous: a random per-visit session id, no profile fields, no IP, no link to analytics.
 *  - The prototype keeps everything in this browser. The visitor can view, download and erase it.
 */

export type Verdict = 'faz-sentido' | 'nao-faz-sentido'
export type UsageConsent = 'unset' | 'granted' | 'denied'

export type LogEvent =
  | { type: 'route'; name: string; candidate?: string }
  | { type: 'step'; step: Step }
  | { type: 'tab'; tab: string }
  | { type: 'theme_open'; theme: ThemeId }
  | { type: 'compare'; candidates: string[] }
  | {
      type: 'feedback'
      key: string
      section: string
      label: string
      verdict: Verdict
      comment?: string
      candidates?: string[]
      theme?: ThemeId
    }

export interface LogEntry {
  id: string
  at: string
  session: string
  event: LogEvent
}

export interface UsageSnapshot {
  entries: LogEntry[]
  consent: UsageConsent
  session: string
}

const ENTRIES_KEY = 'confere:usage-log'
const CONSENT_KEY = 'confere:usage-consent'
const SESSION_KEY = 'confere:session'
const MAX_ENTRIES = 500
export const MAX_COMMENT = 500

const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    /* storage unavailable: the log lasts only for this visit */
  }
}

function readSession(): string {
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY)
    if (existing) return existing
    const created = newId()
    window.sessionStorage.setItem(SESSION_KEY, created)
    return created
  } catch {
    return newId()
  }
}

function readConsent(): UsageConsent {
  if (privacySignalActive()) return 'denied' // GPC / Do Not Track: never track navigation
  try {
    const v = window.localStorage.getItem(CONSENT_KEY)
    return v === 'granted' || v === 'denied' ? v : 'unset'
  } catch {
    return 'unset'
  }
}

let snapshot: UsageSnapshot = { entries: [], consent: 'unset', session: '' }
let started = false
const listeners = new Set<() => void>()

function commit(next: UsageSnapshot) {
  snapshot = next
  write(ENTRIES_KEY, JSON.stringify(next.entries))
  listeners.forEach((l) => l())
}

export function initUsageLog() {
  if (started || typeof window === 'undefined') return
  started = true
  snapshot = {
    entries: readJson<LogEntry[]>(ENTRIES_KEY, []),
    consent: readConsent(),
    session: readSession(),
  }
  listeners.forEach((l) => l())
}

const cap = (entries: LogEntry[]) =>
  entries.length <= MAX_ENTRIES
    ? entries
    : // drop the oldest navigation entries first, keep feedback
      (() => {
        let extra = entries.length - MAX_ENTRIES
        return entries.filter((e) => (extra > 0 && e.event.type !== 'feedback' ? (extra--, false) : true))
      })()

const sameEvent = (a: LogEvent, b: LogEvent) => JSON.stringify(a) === JSON.stringify(b)

/** Records a navigation event. Silently ignored without consent. */
export function logEvent(event: Exclude<LogEvent, { type: 'feedback' }>) {
  if (snapshot.consent !== 'granted') return
  const last = snapshot.entries[snapshot.entries.length - 1]
  if (last && sameEvent(last.event, event) && Date.now() - Date.parse(last.at) < 1500) return
  commit({
    ...snapshot,
    entries: cap([
      ...snapshot.entries,
      { id: newId(), at: new Date().toISOString(), session: snapshot.session, event },
    ]),
  })
}

export interface FeedbackInput {
  key: string
  section: string
  label: string
  verdict: Verdict
  comment?: string
  candidates?: string[]
  theme?: ThemeId
}

/** Records (or replaces) the feedback for one section. Always allowed: it is a voluntary gesture. */
export function submitFeedback(input: FeedbackInput) {
  const event: LogEvent = {
    type: 'feedback',
    key: input.key,
    section: input.section,
    label: input.label,
    verdict: input.verdict,
    ...(input.comment?.trim() ? { comment: input.comment.trim().slice(0, MAX_COMMENT) } : {}),
    // Candidate context only with the navigation consent: it can reveal political preference.
    ...(snapshot.consent === 'granted' && input.candidates ? { candidates: input.candidates } : {}),
    ...(snapshot.consent === 'granted' && input.theme ? { theme: input.theme } : {}),
  }
  const rest = snapshot.entries.filter((e) => !(e.event.type === 'feedback' && e.event.key === input.key))
  commit({
    ...snapshot,
    entries: cap([...rest, { id: newId(), at: new Date().toISOString(), session: snapshot.session, event }]),
  })
}

export function setUsageConsent(consent: 'granted' | 'denied') {
  write(CONSENT_KEY, consent)
  // Withdrawing consent erases the navigation history already recorded. Feedback stays.
  const entries = consent === 'denied' ? snapshot.entries.filter((e) => e.event.type === 'feedback') : snapshot.entries
  commit({ ...snapshot, consent, entries })
}

export function clearUsageLog() {
  commit({ ...snapshot, entries: [] })
}

export function exportUsageLog(): string {
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      note: 'Registro anônimo do Confere. Sem nome, perfil, IP ou identificadores de pessoa.',
      consent: snapshot.consent,
      entries: snapshot.entries,
    },
    null,
    2,
  )
}

export function useUsageLog(): UsageSnapshot {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => snapshot,
  )
}

export function useFeedback(key: string): Extract<LogEvent, { type: 'feedback' }> | undefined {
  const { entries } = useUsageLog()
  for (let i = entries.length - 1; i >= 0; i--) {
    const e = entries[i].event
    if (e.type === 'feedback' && e.key === key) return e
  }
  return undefined
}
