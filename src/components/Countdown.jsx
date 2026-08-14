'use client'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// Change this to your actual event date
const EVENT_DATE = new Date('2026-10-15T09:00:00')

export default function Countdown() {
  const { t } = useTranslation()
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 })

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, EVENT_DATE - new Date())
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      })
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [])

  const boxes = [
    { val: time.d, label: t('days') },
    { val: time.h, label: t('hours') },
    { val: time.m, label: t('mins') },
    { val: time.s, label: t('secs') },
  ]

  return (
    <div className="text-center mt-8">
      <p className="text-secondary font-semibold mb-3">{t('countdown_label')}</p>
      <div className="flex gap-3 justify-center flex-wrap">
        {boxes.map((b, i) => (
          <div key={i} className="bg-secondary text-white rounded-xl px-5 py-3 min-w-[70px]">
            <div className="text-2xl font-bold">{String(b.val).padStart(2, '0')}</div>
            <div className="text-xs">{b.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
