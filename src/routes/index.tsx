import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, ExternalLink } from 'lucide-react'

import Container from '@/components/basic/Container'
import IslandShell, { ISLAND_SHELL_CLASSNAME } from '@/components/basic/IslandShell'
import Typography from '@/components/basic/Typography'
import { ROUTES } from '@/lib/constants/routes'
import { cn } from '@/lib/utils/styles'

export const Route = createFileRoute('/')({ component: App })

const PRODUCT_PILLARS = [
  {
    description: 'Team tools sync directly between peers so collaboration stays fast and private-first.',
    title: 'Realtime Collaboration',
  },
  {
    description: 'Only the data needed to run the session is kept, with a bias toward local-first behavior.',
    title: 'Minimal Data Footprint',
  },
  {
    description: 'The app stays intentionally lean so new tools can be added without carrying heavy overhead.',
    title: 'Lightweight Product Hub',
  },
] as const

const PROJECT_HIGHLIGHTS = [
  {
    body: 'Yjs, y-webrtc, and local persistence work together to keep rooms in sync without a central app database.',
    title: 'Peer-to-peer planning flow',
  },
  {
    body: 'Blind Poker is the active flagship tool for Scrum teams to estimate together while reducing anchoring bias.',
    title: 'Blind Poker today',
  },
  {
    body: 'Theme system and planning-poker component refactors are the near-term focus for safer iteration speed.',
    title: 'Current roadmap',
  },
] as const

const CTA_CARD_CLASSNAME = cn(
  ISLAND_SHELL_CLASSNAME,
  'group rise-in border-primary/55 from-primary/16 via-bg-surface to-bg-surface hover:border-primary/70 focus-visible:border-primary/70 focus-visible:ring-primary/35 mt-8 block rounded-3xl bg-linear-to-br p-6 no-underline transition duration-220 hover:-translate-y-1 hover:shadow-[inset_0_1px_0_var(--inset-glint),0_0_0_1px_rgba(246,172,60,0.38),0_0_30px_rgba(246,172,60,0.34),0_20px_40px_rgba(18,40,65,0.18)] focus-visible:-translate-y-1 focus-visible:ring-2 focus-visible:outline-none',
)

const CTA_ICON_BASE_CLASSNAME = 'text-primary-deep absolute inset-0 h-6 w-6 transition-all duration-250 ease-out'

const CTA_EXTERNAL_ICON_CLASSNAME = cn(
  CTA_ICON_BASE_CLASSNAME,
  'group-hover:scale-85 group-hover:rotate-45 group-hover:opacity-0 group-focus-visible:scale-85 group-focus-visible:rotate-45 group-focus-visible:opacity-0',
)

const CTA_ARROW_ICON_CLASSNAME = cn(
  CTA_ICON_BASE_CLASSNAME,
  '-rotate-10 opacity-0 group-hover:translate-x-1 group-hover:scale-100 group-hover:rotate-0 group-hover:opacity-100 group-focus-visible:translate-x-1 group-focus-visible:scale-100 group-focus-visible:rotate-0 group-focus-visible:opacity-100',
)

function App() {
  return (
    <main className="page-wrap px-4 pt-14 pb-8">
      <IslandShell as="section" className="rise-in relative overflow-hidden rounded-4xl px-6 py-10 sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute -top-24 -left-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]" />
        <Container align="start" as="section" className="relative z-10" direction="col" justify="start">
          <Typography as="span" className="font-title text-ink mb-3 text-xl leading-none">
            LazyStack
          </Typography>
          <Typography
            as="h1"
            className="display-title text-ink mb-5 max-w-3xl text-4xl leading-[1.02] font-bold tracking-tight sm:text-6xl"
          >
            Productivity tools that collaborate in realtime, without heavy data baggage.
          </Typography>
          <Typography as="p" className="text-ink-secondary mb-8 max-w-2xl text-base sm:text-lg">
            LazyStack is a personal productivity hub focused on practical collaboration tools. The current flagship is
            Blind Poker for Scrum estimation, built with peer-to-peer sync and local-first persistence.
          </Typography>
          <Container aria-label="Core pillars" as="section" className="grid gap-3 sm:grid-cols-3" disableDefaultClasses>
            {PRODUCT_PILLARS.map((pillar) => (
              <Container
                align="start"
                as="article"
                className="border-border bg-bg-surface/85 rounded-2xl border p-4"
                direction="col"
                justify="start"
                key={pillar.title}
              >
                <Typography as="h2" className="text-ink mb-1 text-sm leading-5 font-semibold">
                  {pillar.title}
                </Typography>
                <Typography as="p" className="text-ink-secondary m-0 text-sm leading-6">
                  {pillar.description}
                </Typography>
              </Container>
            ))}
          </Container>
        </Container>
      </IslandShell>

      <Container as="section" className="mt-8 grid gap-4 sm:grid-cols-3" disableDefaultClasses>
        {PROJECT_HIGHLIGHTS.map((highlight, index) => (
          <Container
            align="start"
            as="article"
            className={cn(ISLAND_SHELL_CLASSNAME, 'feature-card rise-in rounded-2xl p-5')}
            direction="col"
            justify="start"
            key={highlight.title}
            style={{ animationDelay: `${index * 90 + 80}ms` }}
          >
            <Typography as="h2" className="text-ink mb-2 text-base leading-6 font-semibold">
              {highlight.title}
            </Typography>
            <Typography as="p" className="text-ink-secondary m-0 text-sm leading-6">
              {highlight.body}
            </Typography>
          </Container>
        ))}
      </Container>

      <Link className={CTA_CARD_CLASSNAME} to={ROUTES.planningPokerBase}>
        <Container align="center" className="gap-4" justify="between">
          <Container align="start" className="min-w-0" direction="col" justify="start">
            <Typography as="p" className="island-kicker mb-2 leading-none">
              Start Estimating
            </Typography>
            <Typography as="h2" className="text-ink mb-2 text-2xl leading-tight font-semibold">
              Open Planning Poker Lobby
            </Typography>
            <Typography as="p" className="text-ink-secondary m-0 max-w-2xl text-sm sm:text-base">
              Create or join a room, share the code with teammates, vote privately, then reveal together.
            </Typography>
          </Container>
          <span aria-hidden="true" className="relative h-6 w-6 shrink-0">
            <ExternalLink className={CTA_EXTERNAL_ICON_CLASSNAME} />
            <ArrowRight className={CTA_ARROW_ICON_CLASSNAME} />
          </span>
        </Container>
      </Link>
    </main>
  )
}
