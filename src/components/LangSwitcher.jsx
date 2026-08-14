'use client'
import { useTranslation } from 'react-i18next'

export default function LangSwitcher() {
  const { i18n } = useTranslation()
  const toggle = () => i18n.changeLanguage(i18n.language === 'en' ? 'mr' : 'en')
  return (
    <button
      onClick={toggle}
      className="px-4 py-2 bg-accent text-secondary rounded-full font-semibold text-sm hover:brightness-95 transition"
    >
      {i18n.language === 'en' ? 'मराठी' : 'English'}
    </button>
  )
}
