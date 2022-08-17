import { useEffect } from "react"
import confetti from 'canvas-confetti'

export default function Success() {
  useEffect(() => {
    const end = Date.now() + (3 * 1000)
    const colors = ['#D6A269', '#ffffff']

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      })
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      })
      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    frame()
  }, [])

  return (
    <div>
      <canvas className="confetti w-0" id="canvas"></canvas>
    </div>
  )
}
