'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

/* ─── Game constants ─── */
const PADDLE_H = 18
const BALL_R = 9
const BRICK_ROWS = 6
const BRICK_COLS = 10
const BRICK_H = 22
const BRICK_GAP = 4
const BRICK_TOP = 80
const LIVES_MAX = 3

const BRICK_COLOR = (row: number) =>
  row < 2 ? '#FF8C00' : row < 4 ? '#4CAF50' : '#1E88E5'
const BRICK_PTS = (row: number) =>
  row < 2 ? 10 : row < 4 ? 15 : 20

/* base paddle width by level (before the size multiplier) */
const basePadW = (level: number) => Math.max(100, 150 - level * 1.5)

type GameState = 'idle' | 'playing' | 'paused' | 'dead' | 'won'

type Brick = { x: number; y: number; w: number; h: number; alive: boolean; color: string; pts: number }

interface HiEntry { name: string; score: number }

function getHiScores(): HiEntry[] {
  try {
    return JSON.parse(localStorage.getItem('fp-bb-hi') || '[]')
  } catch { return [] }
}

function saveHiScore(score: number) {
  const list = getHiScores()
  list.push({ name: 'You', score })
  list.sort((a, b) => b.score - a.score)
  localStorage.setItem('fp-bb-hi', JSON.stringify(list.slice(0, 5)))
}

export default function BrickBreakerPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef<GameState>('idle')
  const rafRef = useRef<number>(0)

  /* Mutable game data, stored in refs to avoid re-renders mid-frame */
  const gameRef = useRef({
    padX: 0,
    padW: 100,
    ballX: 0,
    ballY: 0,
    vx: 0,
    vy: 0,
    bricks: [] as Brick[],
    score: 0,
    lives: LIVES_MAX,
    level: 1,
    speed: 1,
  })

  const [uiState, setUiState] = useState<GameState>('idle')
  const [uiScore, setUiScore] = useState(0)
  const [uiLives, setUiLives] = useState(LIVES_MAX)
  const [uiLevel, setUiLevel] = useState(1)
  const [hiScores, setHiScores] = useState<HiEntry[]>([])
  /* player-tunable settings */
  const [sensitivity, setSensitivity] = useState(1.5)  // paddle speed multiplier
  const [paddleScale, setPaddleScale] = useState(1)     // paddle width multiplier
  const sensitivityRef = useRef(1.5)
  const paddleScaleRef = useRef(1)

  useEffect(() => { sensitivityRef.current = sensitivity }, [sensitivity])
  useEffect(() => {
    paddleScaleRef.current = paddleScale
    const canvas = canvasRef.current
    const g = gameRef.current
    if (canvas) {
      g.padW = basePadW(g.level) * paddleScale
      g.padX = Math.max(0, Math.min(canvas.width - g.padW, g.padX))
    }
  }, [paddleScale])

  /* ─── Build bricks ─── */
  const buildBricks = useCallback((canvas: HTMLCanvasElement) => {
    const bricks: Brick[] = []
    const totalGap = BRICK_GAP * (BRICK_COLS + 1)
    const bw = (canvas.width - totalGap) / BRICK_COLS
    for (let r = 0; r < BRICK_ROWS; r++) {
      for (let c = 0; c < BRICK_COLS; c++) {
        bricks.push({
          x: BRICK_GAP + c * (bw + BRICK_GAP),
          y: BRICK_TOP + r * (BRICK_H + BRICK_GAP),
          w: bw,
          h: BRICK_H,
          alive: true,
          color: BRICK_COLOR(r),
          pts: BRICK_PTS(r),
        })
      }
    }
    return bricks
  }, [])

  /* ─── Init / reset level ─── */
  const initLevel = useCallback((canvas: HTMLCanvasElement, level: number) => {
    const g = gameRef.current
    g.padW = basePadW(level) * paddleScaleRef.current
    g.padX = (canvas.width - g.padW) / 2
    g.ballX = canvas.width / 2
    g.ballY = canvas.height - 80
    const spd = (3.5 + level * 0.3) * (canvas.width / 480)
    const angle = (-Math.PI / 2) + (Math.random() - 0.5) * (Math.PI / 3)
    g.vx = spd * Math.cos(angle)
    g.vy = spd * Math.sin(angle)
    g.bricks = buildBricks(canvas)
    g.level = level
    g.speed = spd
  }, [buildBricks])

  /* ─── Start game ─── */
  const startGame = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const g = gameRef.current
    g.score = 0
    g.lives = LIVES_MAX
    initLevel(canvas, 1)
    stateRef.current = 'playing'
    setUiState('playing')
    setUiScore(0)
    setUiLives(LIVES_MAX)
    setUiLevel(1)
  }, [initLevel])

  /* ─── Draw frame ─── */
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const g = gameRef.current
    const W = canvas.width
    const H = canvas.height

    /* Background, soft vertical gradient + faint grid */
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H)
    bgGrad.addColorStop(0, '#FFF8EE')
    bgGrad.addColorStop(1, '#F0ECE0')
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, W, H)
    ctx.strokeStyle = 'rgba(26,43,74,0.045)'
    ctx.lineWidth = 1
    for (let x = 0; x < W; x += 32) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke() }
    for (let y = 0; y < H; y += 32) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }

    /* Bricks, glossy with gradient + highlight */
    g.bricks.forEach(b => {
      if (!b.alive) return
      const bGrad = ctx.createLinearGradient(0, b.y, 0, b.y + b.h)
      bGrad.addColorStop(0, b.color)
      bGrad.addColorStop(1, 'rgba(0,0,0,0.18)')
      ctx.fillStyle = b.color
      ctx.beginPath()
      ctx.roundRect(b.x, b.y, b.w, b.h, 6)
      ctx.fill()
      ctx.fillStyle = bGrad
      ctx.globalAlpha = 0.35
      ctx.beginPath()
      ctx.roundRect(b.x, b.y, b.w, b.h, 6)
      ctx.fill()
      ctx.globalAlpha = 1
      ctx.fillStyle = 'rgba(255,255,255,0.32)'
      ctx.beginPath()
      ctx.roundRect(b.x + 3, b.y + 3, b.w - 6, 6, [5, 5, 0, 0])
      ctx.fill()
    })

    /* Paddle, gradient + glow */
    const py = H - 32
    const padGrad = ctx.createLinearGradient(0, py, 0, py + PADDLE_H)
    padGrad.addColorStop(0, '#FFB54D')
    padGrad.addColorStop(1, '#FF8C00')
    ctx.save()
    ctx.shadowColor = 'rgba(255,140,0,0.55)'
    ctx.shadowBlur = 16
    ctx.shadowOffsetY = 4
    ctx.fillStyle = padGrad
    ctx.beginPath()
    ctx.roundRect(g.padX, py, g.padW, PADDLE_H, PADDLE_H / 2)
    ctx.fill()
    ctx.restore()
    ctx.strokeStyle = '#1A2B4A'
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.roundRect(g.padX, py, g.padW, PADDLE_H, PADDLE_H / 2)
    ctx.stroke()
    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    ctx.beginPath()
    ctx.roundRect(g.padX + 5, py + 3, g.padW - 10, 4, 2)
    ctx.fill()

    /* Ball, glowing navy with shine */
    ctx.save()
    ctx.shadowColor = 'rgba(26,43,74,0.45)'
    ctx.shadowBlur = 14
    ctx.fillStyle = '#1A2B4A'
    ctx.beginPath()
    ctx.arc(g.ballX, g.ballY, BALL_R, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
    ctx.fillStyle = 'rgba(255,255,255,0.55)'
    ctx.beginPath()
    ctx.arc(g.ballX - BALL_R * 0.3, g.ballY - BALL_R * 0.3, BALL_R * 0.42, 0, Math.PI * 2)
    ctx.fill()

    /* HUD */
    const fontSize = Math.max(13, Math.min(16, W / 30))
    ctx.font = `700 ${fontSize}px Nunito, system-ui`
    ctx.fillStyle = '#FF8C00'
    ctx.textAlign = 'left'
    ctx.fillText(`Score: ${g.score}`, 12, 28)
    ctx.fillStyle = '#4CAF50'
    ctx.textAlign = 'center'
    ctx.fillText(`Level ${g.level}`, W / 2, 28)
    ctx.fillStyle = '#E53935'
    ctx.textAlign = 'right'
    ctx.fillText(`${'♥'.repeat(g.lives)}`, W - 12, 28)
  }, [])

  /* ─── Physics tick ─── */
  const tick = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const g = gameRef.current

    if (stateRef.current !== 'playing') { draw(); return }

    const W = canvas.width
    const H = canvas.height

    g.ballX += g.vx
    g.ballY += g.vy

    /* Wall bounce */
    if (g.ballX - BALL_R <= 0) { g.ballX = BALL_R; g.vx = Math.abs(g.vx) }
    if (g.ballX + BALL_R >= W) { g.ballX = W - BALL_R; g.vx = -Math.abs(g.vx) }
    if (g.ballY - BALL_R <= 0) { g.ballY = BALL_R; g.vy = Math.abs(g.vy) }

    /* Paddle */
    const padTop = H - 32
    if (
      g.ballY + BALL_R >= padTop &&
      g.ballY + BALL_R <= padTop + PADDLE_H + Math.abs(g.vy) &&
      g.ballX >= g.padX - BALL_R &&
      g.ballX <= g.padX + g.padW + BALL_R
    ) {
      g.ballY = padTop - BALL_R
      /* Angle out from centre */
      const rel = (g.ballX - (g.padX + g.padW / 2)) / (g.padW / 2)
      const angle = rel * (Math.PI / 3) - Math.PI / 2
      const spd = Math.sqrt(g.vx * g.vx + g.vy * g.vy)
      g.vx = spd * Math.cos(angle)
      g.vy = spd * Math.sin(angle)
    }

    /* Ball out the bottom */
    if (g.ballY - BALL_R > H) {
      g.lives -= 1
      setUiLives(g.lives)
      if (g.lives <= 0) {
        stateRef.current = 'dead'
        setUiState('dead')
        saveHiScore(g.score)
        setHiScores(getHiScores())
        draw()
        return
      }
      /* Reset ball position */
      g.ballX = g.padX + g.padW / 2
      g.ballY = H - 80
      const spd = g.speed
      const angle = (-Math.PI / 2) + (Math.random() - 0.5) * (Math.PI / 3)
      g.vx = spd * Math.cos(angle)
      g.vy = spd * Math.sin(angle)
    }

    /* Brick collision */
    for (const b of g.bricks) {
      if (!b.alive) continue
      if (
        g.ballX + BALL_R > b.x && g.ballX - BALL_R < b.x + b.w &&
        g.ballY + BALL_R > b.y && g.ballY - BALL_R < b.y + b.h
      ) {
        b.alive = false
        g.score += b.pts
        setUiScore(g.score)

        /* Which side? */
        const overlapL = (g.ballX + BALL_R) - b.x
        const overlapR = (b.x + b.w) - (g.ballX - BALL_R)
        const overlapT = (g.ballY + BALL_R) - b.y
        const overlapB = (b.y + b.h) - (g.ballY - BALL_R)
        const minOverlap = Math.min(overlapL, overlapR, overlapT, overlapB)
        if (minOverlap === overlapT || minOverlap === overlapB) g.vy = -g.vy
        else g.vx = -g.vx
        break
      }
    }

    /* Level complete? */
    if (g.bricks.every(b => !b.alive)) {
      if (g.level >= 25) {
        stateRef.current = 'won'
        setUiState('won')
        saveHiScore(g.score)
        setHiScores(getHiScores())
        draw()
        return
      }
      initLevel(canvas, g.level + 1)
      setUiLevel(g.level)
    }

    draw()
    rafRef.current = requestAnimationFrame(tick)
  }, [draw, initLevel])

  /* ─── RAF loop ─── */
  useEffect(() => {
    if (uiState === 'playing') {
      rafRef.current = requestAnimationFrame(tick)
    }
    return () => cancelAnimationFrame(rafRef.current)
  }, [uiState, tick])

  /* ─── Canvas resize ─── */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const w = Math.min(parent.clientWidth, 640)
      canvas.width = w
      canvas.height = Math.round(w * 1.25)
      if (stateRef.current === 'idle') {
        const ctx = canvas.getContext('2d')
        if (ctx) { ctx.fillStyle = '#F5F3ED'; ctx.fillRect(0, 0, w, canvas.height) }
      }
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  /* ─── Keyboard ─── */
  useEffect(() => {
    const step = 22 * sensitivityRef.current
    const handler = (e: KeyboardEvent) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return
      e.preventDefault()
      const canvas = canvasRef.current
      if (!canvas) return
      const g = gameRef.current
      if (e.key === 'ArrowLeft') g.padX = Math.max(0, g.padX - step)
      if (e.key === 'ArrowRight') g.padX = Math.min(canvas.width - g.padW, g.padX + step)
      if (stateRef.current !== 'playing') draw()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [draw])

  /* ─── Touch / swipe ─── */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let startX = 0
    let lastX = 0

    const touchStart = (e: TouchEvent) => { startX = e.touches[0].clientX; lastX = startX }
    const touchMove = (e: TouchEvent) => {
      e.preventDefault()
      const x = e.touches[0].clientX
      const dx = x - lastX
      lastX = x
      const g = gameRef.current
      g.padX = Math.max(0, Math.min(canvas.width - g.padW, g.padX + dx * (1.3 * sensitivityRef.current)))
      if (stateRef.current !== 'playing') draw()
    }

    canvas.addEventListener('touchstart', touchStart, { passive: true })
    canvas.addEventListener('touchmove', touchMove, { passive: false })
    return () => {
      canvas.removeEventListener('touchstart', touchStart)
      canvas.removeEventListener('touchmove', touchMove)
    }
  }, [draw])

  /* ─── Mouse control ─── */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const g = gameRef.current
      const scale = canvas.width / rect.width
      const mx = (e.clientX - rect.left) * scale
      g.padX = Math.max(0, Math.min(canvas.width - g.padW, mx - g.padW / 2))
      if (stateRef.current !== 'playing') draw()
    }
    canvas.addEventListener('mousemove', onMove)
    return () => canvas.removeEventListener('mousemove', onMove)
  }, [draw])

  const togglePause = () => {
    if (stateRef.current === 'playing') {
      stateRef.current = 'paused'
      setUiState('paused')
      cancelAnimationFrame(rafRef.current)
    } else if (stateRef.current === 'paused') {
      stateRef.current = 'playing'
      setUiState('playing')
    }
  }

  /* ─── Initial hi-scores ─── */
  useEffect(() => { setHiScores(getHiScores()) }, [])

  return (
    <div className="fp-page">
      <Navbar />

      <section style={{ padding: '48px 0 96px', background: '#F5F3ED' }}>
        <div className="fp-container" style={{ maxWidth: 760 }}>
          {/* Back + title */}
          <div style={{ marginBottom: 24 }}>
            <Link href="/games" className="fp-btn-orange-link" style={{ fontSize: 13, marginBottom: 12, display: 'inline-flex' }}>
              ← Back to games
            </Link>
            <h1 style={{ fontFamily: 'var(--fp-heading-font)', fontWeight: 900, fontSize: 'clamp(28px, 4vw, 44px)', color: '#1A2B4A', marginTop: 8 }}>
              Brick Breaker
            </h1>
            <p style={{ color: '#7A7A7A', fontSize: 15, marginTop: 6, fontFamily: 'var(--fp-body-font)' }}>
              Arrow keys or swipe · 3 lives · 25 levels · high scores saved locally
            </p>
          </div>

          {/* HUD bar */}
          {uiState !== 'idle' && (
            <div style={{ display: 'flex', gap: 24, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 800, color: '#FF8C00', fontFamily: 'var(--fp-body-font)' }}>Score: {uiScore}</span>
              <span style={{ fontWeight: 800, color: '#1E88E5', fontFamily: 'var(--fp-body-font)' }}>Level {uiLevel} / 25</span>
              <span style={{ fontWeight: 800, color: '#E53935', fontFamily: 'var(--fp-body-font)' }}>{'♥'.repeat(uiLives)}</span>
            </div>
          )}

          {/* Canvas wrapper */}
          <div style={{ position: 'relative', width: '100%', maxWidth: 640 }}>
            <canvas
              ref={canvasRef}
              style={{ display: 'block', width: '100%', borderRadius: 12, border: '2px solid rgba(26,43,74,0.1)', cursor: 'none', touchAction: 'none' }}
            />

            {/* Overlay screens */}
            {(uiState === 'idle' || uiState === 'dead' || uiState === 'won' || uiState === 'paused') && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(26,43,74,0.82)', borderRadius: 10, gap: 16, padding: 32 }}>
                <p style={{ color: '#FF8C00', fontWeight: 900, fontSize: 28, fontFamily: 'var(--fp-heading-font)', textAlign: 'center' }}>
                  {uiState === 'idle' && 'Brick Breaker'}
                  {uiState === 'dead' && `Game Over · ${uiScore} pts`}
                  {uiState === 'won' && `You won! · ${uiScore} pts`}
                  {uiState === 'paused' && 'Paused'}
                </p>

                {uiState === 'idle' && (
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, textAlign: 'center', fontFamily: 'var(--fp-body-font)' }}>
                    Move paddle with arrow keys or swipe. Clear all bricks to advance.
                  </p>
                )}

                <button
                  onClick={uiState === 'paused' ? togglePause : startGame}
                  style={{ background: '#FF8C00', color: 'white', border: 'none', borderRadius: 8, padding: '14px 32px', fontSize: 16, fontWeight: 800, cursor: 'pointer', fontFamily: 'var(--fp-body-font)', transition: 'filter 0.2s' }}
                  onMouseOver={e => (e.currentTarget.style.filter = 'brightness(1.1)')}
                  onMouseOut={e => (e.currentTarget.style.filter = '')}
                >
                  {uiState === 'paused' ? 'Resume' : uiState === 'idle' ? 'Start' : 'Play again'}
                </button>
              </div>
            )}
          </div>

          {/* Controls row */}
          {uiState === 'playing' && (
            <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
              <button
                onClick={togglePause}
                style={{ background: '#4CAF50', color: 'white', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'var(--fp-body-font)', transition: 'filter 0.2s' }}
                onMouseOver={e => (e.currentTarget.style.filter = 'brightness(1.1)')}
                onMouseOut={e => (e.currentTarget.style.filter = '')}
              >
                Pause
              </button>
              <button
                onClick={startGame}
                style={{ background: 'transparent', color: '#1A2B4A', border: '2px solid rgba(26,43,74,0.2)', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'var(--fp-body-font)', transition: 'filter 0.2s' }}
                onMouseOver={e => (e.currentTarget.style.filter = 'brightness(0.8)')}
                onMouseOut={e => (e.currentTarget.style.filter = '')}
              >
                Restart
              </button>
            </div>
          )}

          {/* Settings, paddle speed (sensitivity) + paddle size */}
          <div style={{ marginTop: 18, display: 'flex', flexWrap: 'wrap', gap: 24, maxWidth: 480 }}>
            <label style={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 800, color: '#1A2B4A', fontFamily: 'var(--fp-body-font)' }}>
                <span>Paddle speed</span>
                <span style={{ color: '#FF8C00' }}>{sensitivity.toFixed(1)}×</span>
              </span>
              <input
                type="range" min={0.5} max={3} step={0.1}
                value={sensitivity}
                onChange={e => setSensitivity(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#FF8C00', cursor: 'pointer' }}
              />
            </label>
            <label style={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 800, color: '#1A2B4A', fontFamily: 'var(--fp-body-font)' }}>
                <span>Paddle size</span>
                <span style={{ color: '#4CAF50' }}>{Math.round(paddleScale * 100)}%</span>
              </span>
              <input
                type="range" min={0.6} max={1.6} step={0.05}
                value={paddleScale}
                onChange={e => setPaddleScale(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#4CAF50', cursor: 'pointer' }}
              />
            </label>
          </div>

          {/* High scores */}
          {hiScores.length > 0 && (
            <div style={{ marginTop: 40 }}>
              <h2 style={{ fontFamily: 'var(--fp-heading-font)', fontWeight: 800, fontSize: 20, color: '#1A2B4A', marginBottom: 16 }}>
                High scores
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {hiScores.map((h, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 18px', background: 'white', borderRadius: 10, border: '1px solid rgba(26,43,74,0.08)' }}>
                    <span style={{ width: 28, height: 28, borderRadius: 8, background: '#FF8C00', color: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, fontFamily: 'var(--fp-body-font)', flexShrink: 0 }}>
                      {i + 1}
                    </span>
                    <span style={{ flex: 1, fontWeight: 700, color: '#1A2B4A', fontFamily: 'var(--fp-body-font)' }}>{h.name}</span>
                    <span style={{ fontWeight: 900, color: '#1A2B4A', fontFamily: 'var(--fp-heading-font)', fontSize: 16 }}>{h.score.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
