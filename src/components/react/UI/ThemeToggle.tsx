import { useTheme } from "../hooks/useTheme"

 

export function ThemeToggle() {
  const { theme, toggle } = useTheme()

  return (
    <button className="text-4xl" onClick={toggle}>
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  )
}