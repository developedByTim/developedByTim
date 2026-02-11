import { useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'

  const stored = localStorage.getItem('theme') as Theme | null
  if (stored) return stored

  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return systemDark ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])
useEffect(() => {
  const media = window.matchMedia('(prefers-color-scheme: dark)')

  const listener = (e: MediaQueryListEvent) => {
    const stored = localStorage.getItem('theme')
    if (!stored) {
      setTheme(e.matches ? 'dark' : 'light')
    }
  }

  media.addEventListener('change', listener)
  return () => media.removeEventListener('change', listener)
}, [])
  return {
    theme,
    toggle: () => setTheme(t => (t === 'dark' ? 'light' : 'dark')),
    setTheme,
  }
}