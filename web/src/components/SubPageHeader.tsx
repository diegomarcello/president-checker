import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FlagStripe, Logo } from '@/components/brand'

/** Header shared by the inner pages (candidate data, curation). */
export function SubPageHeader({ extra }: { extra?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-white/90 backdrop-blur">
      <FlagStripe />
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-3 px-4 sm:px-8">
        <a href="#/" aria-label="Confere, voltar ao início">
          <Logo />
        </a>
        <div className="flex items-center gap-1">
          {extra}
          <Button asChild variant="ghost">
            <a href="#/">
              <ArrowLeft /> <span className="hidden sm:inline">Voltar ao início</span>
              <span className="sr-only sm:hidden">Voltar ao início</span>
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}
