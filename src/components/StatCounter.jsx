'use client'
import { useEffect, useRef, useState } from 'react'

export default function StatCounter({ target, label, suffix = '+' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const duration = 1500
        const steps = 40
        const increment = target / steps
        let current = 0
        const interval = setInterval(() => {
          current += increment
          if (current >= target) {
            setCount(target)
            clearInterval(interval)
          } else {
            setCount(Math.floor(current))
          }
        }, duration / steps)
      }
    }, { threshold: 0.4 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target])

  return (
    <div ref={ref} className="text-center bg-white rounded-2xl shadow-sm p-6">
      <div className="text-4xl font-bold text-primary">{count.toLocaleString()}{suffix}</div>
      <div className="text-secondary mt-1 font-medium">{label}</div>
    </div>
  )
}
