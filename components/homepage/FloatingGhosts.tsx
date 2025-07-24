import React from "react"

const NUM_GHOSTS = 8

function getRandom(min: number, max: number) {
  return Math.random() * (max - min) + min
}

const ghostKeyframes = [
  "floating-ghost-1",
  "floating-ghost-2",
  "floating-ghost-3",
  "floating-ghost-4",
  "floating-ghost-5",
  "floating-ghost-6",
]

export const FloatingGhosts: React.FC<{ numGhosts?: number }> = ({ numGhosts = NUM_GHOSTS }) => {
  return (
    <>
      {Array.from({ length: numGhosts }).map((_, i) => {
        const animation = ghostKeyframes[i % ghostKeyframes.length]
        const left = getRandom(5, 90)
        const top = getRandom(5, 80)
        const duration = getRandom(18, 32)
        const delay = getRandom(0, 8)
        const scale = getRandom(0.7, 1.3)
        return (
          <div
            key={i}
            className={`floating-ghost pointer-events-none fixed z-0 ${animation}`}
            style={{
              left: `${left}%`,
              top: `${top}%`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
              transform: `scale(${scale})`,
              opacity: 0.7,
            }}
            aria-hidden="true"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.686 2 6 4.686 6 8v8c0 1.105.895 2 2 2h1l1-2h4l1 2h1c1.105 0 2-.895 2-2V8c0-3.314-2.686-6-6-6z" fill="currentColor"/>
              <circle cx="9" cy="9" r="1.2" fill="rgba(255,255,255,0.8)"/>
              <circle cx="15" cy="9" r="1.2" fill="rgba(255,255,255,0.8)"/>
              <path d="M8 13c0 1 1 2 2 2s2-1 2-2M14 13c0 1 1 2 2 2s2-1 2-2" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" fill="none"/>
            </svg>
          </div>
        )
      })}
    </>
  )
}

// CSS keyframes for floating ghosts (to be added to global CSS):
// .floating-ghost-1 { animation: float1 24s linear infinite alternate; }
// .floating-ghost-2 { animation: float2 28s linear infinite alternate; }
// .floating-ghost-3 { animation: float3 22s linear infinite alternate; }
// .floating-ghost-4 { animation: float4 30s linear infinite alternate; }
// .floating-ghost-5 { animation: float5 26s linear infinite alternate; }
// .floating-ghost-6 { animation: float6 32s linear infinite alternate; }
//
// @keyframes float1 { 0% { transform: translateY(0) scale(1); } 100% { transform: translateY(-60px) scale(1); } }
// @keyframes float2 { 0% { transform: translateX(0) scale(1); } 100% { transform: translateX(40px) scale(1); } }
// @keyframes float3 { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(30px,-40px) scale(1); } }
// @keyframes float4 { 0% { transform: translateY(0) scale(1); } 100% { transform: translateY(50px) scale(1); } }
// @keyframes float5 { 0% { transform: translateX(0) scale(1); } 100% { transform: translateX(-40px) scale(1); } }
// @keyframes float6 { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(-30px,40px) scale(1); } } 