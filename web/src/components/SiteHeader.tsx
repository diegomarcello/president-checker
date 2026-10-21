import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { FlagStripe, Logo } from '@/components/brand'

const LINKS = [
  { href: '#/em-exercicio', label: 'Em exercício' },
  { href: '#como-funciona', label: 'Como funciona' },
  
  { href: '#/curadoria', label: 'Curadoria' },
  { href: '#privacidade', label: 'Privacidade e LGPD' },
]

export function SiteHeader({ onStart }: { onStart: () => void }) {
  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-white/90 backdrop-blur">
      <FlagStripe />
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-8">
        <a href="#topo" aria-label="Confere, início">
          <Logo />
        </a>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-charcoal hover:bg-surface"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button size="lg" onClick={onStart} className="hidden sm:inline-flex">
            Comparar agora
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon-lg" className="md:hidden" aria-label="Abrir menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(320px,90vw)]">
              <SheetHeader>
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4" aria-label="Menu">
                {LINKS.map((l) => (
                  <SheetClose asChild key={l.href}>
                    <a
                      href={l.href}
                      className="rounded-md px-3 py-3 text-base font-medium text-charcoal hover:bg-surface"
                    >
                      {l.label}
                    </a>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Button size="lg" className="mt-3" onClick={onStart}>
                    Comparar agora
                  </Button>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
