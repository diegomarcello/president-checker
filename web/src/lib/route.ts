import { useCallback, useEffect, useState } from 'react'

export type Route =
  | { name: 'home' }
  | { name: 'comparar' }
  | { name: 'candidato'; id: string }
  | { name: 'curadoria'; candidate?: string }
  | { name: 'termos' }
  | { name: 'registro' }
  | { name: 'em-exercicio' }
  | { name: 'documento'; candidate: string; promise?: string; label?: string }

function routeFromHash(): Route {
  const hash = window.location.hash
  if (hash === '#/comparar') return { name: 'comparar' }
  const c = hash.match(/^#\/candidato\/([\w-]+)$/)
  if (c) return { name: 'candidato', id: c[1] }
  if (hash === '#/termos') return { name: 'termos' }
  if (hash === '#/registro') return { name: 'registro' }
  if (hash === '#/em-exercicio') return { name: 'em-exercicio' }
  const d = hash.match(/^#\/documento\/([\w-]+)(?:\/([\w-]+))?(?:\/([\w-]+))?$/)
  if (d) return { name: 'documento', candidate: d[1], promise: d[2] && d[2] !== '_' ? d[2] : undefined, label: d[3] }
  const q = hash.match(/^#\/curadoria(?:\/([\w-]+))?$/)
  if (q) return { name: 'curadoria', candidate: q[1] }
  return { name: 'home' }
}

export function hrefFor(route: Route): string {
  switch (route.name) {
    case 'comparar':
      return '#/comparar'
    case 'candidato':
      return `#/candidato/${route.id}`
    case 'termos':
      return '#/termos'
    case 'registro':
      return '#/registro'
    case 'em-exercicio':
      return '#/em-exercicio'
    case 'documento':
      return `#/documento/${route.candidate}${route.promise || route.label ? `/${route.promise ?? '_'}` : ''}${route.label ? `/${route.label}` : ''}`
    case 'curadoria':
      return route.candidate ? `#/curadoria/${route.candidate}` : '#/curadoria'
    default:
      return '#/'
  }
}

const sameRoute = (a: Route, b: Route) => hrefFor(a) === hrefFor(b)

/** Minimal hash router for the landing, wizard, candidate data and curation screens. */
export function useRoute() {
  const [route, setRoute] = useState<Route>(routeFromHash)

  useEffect(() => {
    const onChange = () => {
      const next = routeFromHash()
      setRoute((cur) => {
        if (sameRoute(cur, next)) return cur
        window.scrollTo({ top: 0 })
        return next
      })
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const navigate = useCallback((to: Route) => {
    window.location.hash = hrefFor(to)
  }, [])

  return { route, navigate }
}
