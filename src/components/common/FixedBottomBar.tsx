import { createPortal } from "react-dom"
import React from "react"

export default function FixedBottomBar({ children }: { children: React.ReactNode }) {
  if (typeof document === "undefined") return null
  return createPortal(
    <div className="fixed inset-x-0 bottom-0 z-[70] pointer-events-auto">
      {children}
    </div>,
    document.body
  )
}
