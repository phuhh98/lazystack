import { createFileRoute } from '@tanstack/react-router'

import Container from '@/components/basic/Container'
import Typography from '@/components/basic/Typography'
import Confetti from '@/components/planning-poker/Confetti'
import ParticipantStorySidebar from '@/components/planning-poker/ParticipantStorySidebar'
import PlanningPokerGameContent from '@/components/planning-poker/PlanningPokerGameContent'
import RightSidebar from '@/components/planning-poker/RightSidebar'
import SessionDashboard from '@/components/planning-poker/SessionDashboard'
import StorySidebar from '@/components/planning-poker/StorySidebar'
import { usePlanningPoker } from '@/hooks/usePlanningPoker'

export const Route = createFileRoute('/planning-poker/$roomId')({
  component: GameRoom,
})

function GameRoom() {
  const { roomId } = Route.useParams()
  const {
    addStory,
    canClaimModerator,
    castVote,
    chat,
    claimModerator,
    clearStorySelection,
    endSession,
    gameState,
    isConnected,
    isConsensus,
    isModerator,
    lowerHand,
    moveStory,
    myVote,
    nextStory,
    playerId,
    players,
    removeStory,
    revealVotes,
    selectStory,
    sendMessage,
    setCodeWord,
    setStoryEstimate,
    setTimerDuration,
    startTimer,
    startVoting,
    stopTimer,
    storyList,
    timerRemaining,
    toggleHand,
  } = usePlanningPoker(roomId)

  if (!isConnected) {
    return (
      <Container
        as="main"
        className="-mx-4 flex h-full flex-col items-center justify-center gap-3 text-center"
        disableDefaultClasses
      >
        <Container as="div" className="flex items-center gap-2" disableDefaultClasses>
          <span className="bg-primary h-2 w-2 animate-pulse rounded-full" />
          <Typography as="p" className="island-kicker">
            Connecting…
          </Typography>
        </Container>
        <Typography as="p" className="text-ink-muted text-sm">
          Joining room {roomId}
        </Typography>
      </Container>
    )
  }

  if (gameState.phase === 'dashboard') {
    return (
      <Container as="main" className="relative -mx-4 flex h-full overflow-hidden" disableDefaultClasses>
        <Container as="section" className="flex-1 overflow-y-auto px-4 py-8" disableDefaultClasses>
          <Container as="div" className="mx-auto max-w-2xl" disableDefaultClasses>
            <SessionDashboard isModerator={isModerator} onSetEstimate={setStoryEstimate} storyList={storyList} />
          </Container>
        </Container>
        <RightSidebar
          chat={chat}
          codeWord={gameState.codeWord}
          isModerator={isModerator}
          onLowerHand={lowerHand}
          onSend={sendMessage}
          onSetCodeWord={isModerator ? setCodeWord : undefined}
          onSetTimerDuration={setTimerDuration}
          onToggleHand={toggleHand}
          playerId={playerId}
          players={players}
          timerDuration={gameState.timerDuration}
        />
      </Container>
    )
  }

  const onlineCount = players.filter((p) => p.isOnline).length
  const showConfetti = isConsensus && gameState.phase === 'revealed'

  const rightSidebarProps = {
    chat,
    codeWord: gameState.codeWord,
    isModerator,
    onLowerHand: lowerHand,
    onSend: sendMessage,
    onSetCodeWord: isModerator ? setCodeWord : undefined,
    onSetTimerDuration: setTimerDuration,
    onToggleHand: toggleHand,
    playerId,
    players,
    timerDuration: gameState.timerDuration,
  }

  return (
    <Container as="main" className="relative -mx-4 flex grow flex-col overflow-hidden" disableDefaultClasses>
      {showConfetti && <Confetti key={gameState.storyIndex} />}

      {isModerator ? (
        <Container as="section" className="flex grow overflow-x-auto overflow-y-hidden" disableDefaultClasses>
          <StorySidebar
            onAdd={addStory}
            onlineCount={onlineCount}
            onMove={moveStory}
            onRemove={removeStory}
            onSelectStory={selectStory}
            phase={gameState.phase}
            roomId={roomId}
            storyList={storyList}
          />
          <Container as="div" className="flex min-w-0 flex-1 overflow-hidden" disableDefaultClasses>
            <Container
              as="div"
              className="flex min-w-105 flex-1 flex-col gap-3 overflow-hidden p-4"
              disableDefaultClasses
            >
              <Container as="div" className="flex shrink-0 items-center gap-2" disableDefaultClasses>
                <Typography
                  as="span"
                  className="bg-primary rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
                >
                  Moderator
                </Typography>
                {gameState.storyIndex > 0 && (
                  <Typography
                    as="span"
                    className="bg-chip-bg border-chip-border text-ink-muted rounded-full border px-2.5 py-0.5 text-xs"
                  >
                    Story #{gameState.storyIndex + 1}
                  </Typography>
                )}
              </Container>
              <PlanningPokerGameContent
                canClaimModerator={canClaimModerator}
                castVote={castVote}
                chat={chat}
                claimModerator={claimModerator}
                clearStorySelection={clearStorySelection}
                endSession={endSession}
                gameState={gameState}
                isConsensus={isConsensus}
                isModerator={isModerator}
                myVote={myVote}
                nextStory={nextStory}
                onlineCount={onlineCount}
                playerId={playerId}
                players={players}
                revealVotes={revealVotes}
                startTimer={startTimer}
                startVoting={startVoting}
                stopTimer={stopTimer}
                storyList={storyList}
                timerRemaining={timerRemaining}
              />
            </Container>
            <RightSidebar {...rightSidebarProps} />
          </Container>
        </Container>
      ) : (
        <Container as="section" className="flex h-full grow overflow-x-auto overflow-y-hidden" disableDefaultClasses>
          <ParticipantStorySidebar
            currentStory={gameState.story}
            onlineCount={onlineCount}
            roomId={roomId}
            storyList={storyList}
          />
          <Container
            as="div"
            className="flex min-w-105 flex-1 flex-col gap-3 overflow-hidden p-4"
            disableDefaultClasses
          >
            <PlanningPokerGameContent
              canClaimModerator={canClaimModerator}
              castVote={castVote}
              chat={chat}
              claimModerator={claimModerator}
              clearStorySelection={clearStorySelection}
              endSession={endSession}
              gameState={gameState}
              isConsensus={isConsensus}
              isModerator={isModerator}
              myVote={myVote}
              nextStory={nextStory}
              onlineCount={onlineCount}
              playerId={playerId}
              players={players}
              revealVotes={revealVotes}
              startTimer={startTimer}
              startVoting={startVoting}
              stopTimer={stopTimer}
              storyList={storyList}
              timerRemaining={timerRemaining}
            />
          </Container>
          <RightSidebar {...rightSidebarProps} />
        </Container>
      )}
    </Container>
  )
}
