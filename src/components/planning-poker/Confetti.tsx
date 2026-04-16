import { useEffect, useState } from 'react'

const randMinMax = (min: number, max: number) => Math.random() * (max - min) + min

const COLORS = Array(20)
  .fill(null)
  .map(() => {
    const maxHexColor = 0xffffff
    const color = Math.floor(Math.random() * maxHexColor).toString(16)
    return `#${color.padStart(6, '0')}`
  })

const CELEBRATION_EMOJIS = ['🎉', '🎊', '🎈', '✨', '🌟', '⭐', '💫', '🎁', '🥳', '🥂', '😁']

interface Piece {
  color?: string
  delay: number
  duration: number
  emoji?: string
  id: number
  rotation: number
  size: number
  type: 'confetti' | 'emoji'
  x: number
}

export default function Confetti() {
  const [visible, setVisible] = useState(true)
  const MAX_PIECES = 150
  const pieces = useState(() => generatePieces(MAX_PIECES))[0]

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 8500)
    return () => clearTimeout(t)
  }, [])

  if (!visible) return null

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[999] overflow-hidden">
      <style>{`
        @keyframes pp-confetti {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
      {pieces.map((p) =>
        p.type === 'confetti' ? (
          <div
            key={p.id}
            style={{
              animation: `pp-confetti ${p.duration}s ease-in ${p.delay}s both`,
              background: p.color,
              borderRadius: '2px',
              height: `${p.size * 0.6}px`,
              left: `${p.x}%`,
              position: 'absolute',
              top: '-20px',
              transform: `rotate(${p.rotation}deg)`,
              width: `${p.size}px`,
            }}
          />
        ) : (
          <div
            key={p.id}
            style={{
              animation: `pp-confetti ${p.duration}s ease-in ${p.delay}s both`,
              fontSize: `${p.size}px`,
              left: `${p.x}%`,
              position: 'absolute',
              top: '-20px',
              transform: `rotate(${p.rotation}deg)`,
            }}
          >
            {p.emoji}
          </div>
        ),
      )}
    </div>
  )
}

function generatePieces(count: number): Piece[] {
  const emojiCount = Math.floor(count * 0.4)
  const confettiCount = count - emojiCount
  const pieces: Piece[] = []

  // Generate confetti pieces
  for (let i = 0; i < confettiCount; i++) {
    pieces.push({
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 2,
      duration: 1 + Math.random() * 4,
      id: i,
      rotation: Math.random() * 360,
      size: 3 + Math.random() * 12,
      type: 'confetti',
      x: Math.random() * 100,
    })
  }

  // Generate emoji pieces
  for (let i = 0; i < emojiCount; i++) {
    pieces.push({
      delay: Math.random() * 2,
      duration: 1 + Math.random() * 4,
      emoji: CELEBRATION_EMOJIS[Math.floor(Math.random() * CELEBRATION_EMOJIS.length)],
      id: confettiCount + i,
      rotation: Math.random() * 360,
      size: 24 + Math.random() * 16,
      type: 'emoji',
      x: Math.random() * 100,
    })
  }

  return pieces
}
