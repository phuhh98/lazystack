import { useEffect, useState } from 'react'

const COLORS = [
  '#e8622a', '#fb923c', '#fdba74', '#fef08a',
  '#b91c1c', '#f87171', '#fca5a5',
  '#ffffff', '#fde68a', '#fcd34d',
]

interface Piece {
  id: number
  x: number
  color: string
  delay: number
  duration: number
  size: number
  rotation: number
}

function generatePieces(count: number): Piece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 4,
    size: 6 + Math.random() * 8,
    rotation: Math.random() * 360,
  }))
}

export default function Confetti() {
  const [visible, setVisible] = useState(true)
  const pieces = useState(() => generatePieces(90))[0]

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 8500)
    return () => clearTimeout(t)
  }, [])

  if (!visible) return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[999] overflow-hidden"
    >
      <style>{`
        @keyframes pp-confetti {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
      {pieces.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: '-20px',
            width: `${p.size}px`,
            height: `${p.size * 0.6}px`,
            background: p.color,
            borderRadius: '2px',
            transform: `rotate(${p.rotation}deg)`,
            animation: `pp-confetti ${p.duration}s ease-in ${p.delay}s both`,
          }}
        />
      ))}
    </div>
  )
}
