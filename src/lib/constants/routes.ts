export const ROUTES = {
  planningPokerBase: '/planning-poker',
  planningPokerRoom: '/planning-poker/$roomId',
} as const

export function isPlanningPokerRoomPath(pathname: string): boolean {
  return pathname.startsWith(`${ROUTES.planningPokerBase}/`)
}
