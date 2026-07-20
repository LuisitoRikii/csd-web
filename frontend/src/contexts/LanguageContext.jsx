import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import i18n from '@/locales/i18n'

const LanguageContext = createContext()

export const useLanguage = () => {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => i18n.language || 'en')

  useEffect(() => {
    // Sync initial state with i18n (handles persisted localStorage from LanguageDetector)
    const sync = (lng) => {
      setLangState(lng)
      document.documentElement.lang = lng
      try { localStorage.setItem('csd_lang', lng) } catch {}
    }
    sync(i18n.language)
    i18n.on('languageChanged', sync)
    return () => i18n.off('languageChanged', sync)
  }, [])

  const toggleLang = useCallback(() => {
    const next = i18n.language?.startsWith('es') ? 'en' : 'es'
    i18n.changeLanguage(next)
  }, [])

  const setLang = useCallback((lng) => {
    i18n.changeLanguage(lng)
  }, [])

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  )
}
