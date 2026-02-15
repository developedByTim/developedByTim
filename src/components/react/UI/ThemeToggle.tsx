import { useTheme } from "../hooks/useTheme"
import { useState, useEffect } from "react"

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const [mounted, setMounted] = useState(false)

  // avoid hydration issues if using SSR
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <button
      onClick={toggle}
      className="
        text-4xl 
        transition-transform duration-500 ease-in-out
        hover:scale-125
        active:scale-90
      "
      aria-label="Toggle Theme"
    >
      <span
        className="
          inline-block
          transition-all duration-500 ease-in-out
          transform
        "
        style={{
          transform: theme === "dark" ? "rotate(0deg)" : "rotate(360deg)",
        }}
      >
        {theme === "dark" ? "🌙" : "☀️"}
      </span>
    </button>
  )
}