import { useSyncExternalStore } from 'react'

/**
 * Google Analytics 4, loaded ONLY after the visitor accepts.
 *
 * Privacy rules (see docs/09 and docs/15):
 *  - gtag.js is not requested before consent (no cookies, no pings).
 *  - Global Privacy Control / Do Not Track count as "denied" without asking.
 *  - No Google Signals, no ad personalization, ad storage always denied.
 *  - Page views carry generic paths only: never a candidate, filter, profile or priority,
 *    because that could reveal political preference.
 */
const MEASUREMENT_ID: string = import.meta.env.VITE_GA_MEASUREMENT_ID ?? 'G-GVSGY87BFQ'
const STORAGE_KEY = 'confere:analytics-consent'

export type ConsentState = 'unset' | 'granted' | 'denied'

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

interface Store {
  consent: ConsentState
  bannerOpen: boolean
}

const browserSaysNo = () =>
  typeof navigator !== 'undefined' &&
  ((navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true ||
    navigator.doNotTrack === '1')

function readStoredConsent(): ConsentState {
  if (browserSaysNo()) return 'denied'
  try {
    const v = window.localStorage.getItem(STORAGE_KEY)
    return v === 'granted' || v === 'denied' ? v : 'unset'
  } catch {
    return 'unset'
  }
}

let store: Store = { consent: 'unset', bannerOpen: false }
let initialized = false
let scriptLoaded = false
const listeners = new Set<() => void>()

function setStore(next: Store) {
  store = next
  listeners.forEach((l) => l())
}

function gtag(...args: unknown[]) {
  window.dataLayer = window.dataLayer || []
  // gtag.js expects the Arguments object, not an array.
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments)
  void args
}

function loadGtag() {
  if (scriptLoaded) return
  scriptLoaded = true
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
  document.head.appendChild(s)
  gtag('js', new Date())
  gtag('config', MEASUREMENT_ID, {
    send_page_view: false, // page views are sent manually with generic paths
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  })
}

function applyConsent(consent: ConsentState) {
  if (typeof window === 'undefined') return
  ;(window as unknown as Record<string, unknown>)[`ga-disable-${MEASUREMENT_ID}`] = consent !== 'granted'
  gtag('consent', 'update', {
    analytics_storage: consent === 'granted' ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  })
  if (consent === 'granted') loadGtag()
  else clearGaCookies()
}

function clearGaCookies() {
  const host = window.location.hostname
  for (const c of document.cookie.split(';')) {
    const name = c.split('=')[0].trim()
    if (name === '_ga' || name.startsWith('_ga_') || name === '_gid') {
      for (const domain of [host, `.${host}`, '']) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain ? `; domain=${domain}` : ''}`
      }
    }
  }
}

/** Call once on startup. */
export function initAnalytics() {
  if (initialized || typeof window === 'undefined') return
  initialized = true
  window.dataLayer = window.dataLayer || []
  // Everything denied until the visitor says otherwise.
  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  })
  const consent = readStoredConsent()
  setStore({ consent, bannerOpen: consent === 'unset' })
  applyConsent(consent)
}

export function setConsent(consent: 'granted' | 'denied') {
  try {
    window.localStorage.setItem(STORAGE_KEY, consent)
  } catch {
    /* storage unavailable: the choice lasts only for this visit */
  }
  setStore({ consent, bannerOpen: false })
  applyConsent(consent)
  if (consent === 'granted' && lastPageView) trackPageView(lastPageView)
}

export function reopenConsentBanner() {
  setStore({ ...store, bannerOpen: true })
}

export function closeConsentBanner() {
  setStore({ ...store, bannerOpen: false })
}

export const privacySignalActive = browserSaysNo

export interface GenericPage {
  path: string
  title: string
}

let lastPageView: GenericPage | null = null

/** Sends a page_view with a generic path. Does nothing without consent. */
export function trackPageView(page: GenericPage) {
  lastPageView = page
  if (store.consent !== 'granted') return
  gtag('event', 'page_view', {
    page_title: page.title,
    page_path: page.path,
    page_location: `${window.location.origin}${page.path}`,
  })
}

export function useConsent(): Store {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => store,
  )
}
