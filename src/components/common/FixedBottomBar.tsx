import { createPortal } from "react-dom"
import React from "react"

function useBodyBottomPadding(height: number | null) {
  React.useEffect(() => {
    if (typeof document === "undefined") return
    const prev = document.body.style.paddingBottom
    const prevVar = document.body.style.getPropertyValue("--fixed-bottom-bar-height")
    if (height != null) {
      document.body.style.paddingBottom = `${height}px`
      document.body.style.setProperty("--fixed-bottom-bar-height", `${height}px`)
    }
    return () => {
      document.body.style.paddingBottom = prev
      if (prevVar) {
        document.body.style.setProperty("--fixed-bottom-bar-height", prevVar)
      } else {
        document.body.style.removeProperty("--fixed-bottom-bar-height")
      }
    }
  }, [height])
}

export default function FixedBottomBar({ children }: { children: React.ReactNode }) {
  if (typeof document === "undefined") return null
  const ref = React.useRef<HTMLDivElement | null>(null)
  const [h, setH] = React.useState<number | null>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setH(el.offsetHeight)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    window.addEventListener("resize", update)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", update)
    }
  }, [])

  useBodyBottomPadding(h)
  return createPortal(
    <div ref={ref} className="fixed inset-x-0 bottom-0 z-[40] pointer-events-auto">
      {children}
    </div>,
    document.body
  )
}
