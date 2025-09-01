import * as React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: React.ReactNode
  description?: React.ReactNode
  primaryLabel: React.ReactNode
  onPrimary?: () => void
  primaryClassName?: string
  secondaryLabel?: React.ReactNode
  secondaryTo?: string
  onSecondary?: () => void
  contentClassName?: string
}

export function DialogComponent({
  open,
  onOpenChange,
  title,
  description,
  primaryLabel,
  onPrimary,
  primaryClassName,
  secondaryLabel,
  secondaryTo,
  onSecondary,
  contentClassName,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("rounded-[20px] p-0 gap-0 max-w-sm", contentClassName)}>
        <div className="px-5 pt-5">
          <DialogHeader className="text-left">
            <DialogTitle className="text-[22px] font-semibold text-[#3C3C3C]">{title}</DialogTitle>
            {description ? (
              <DialogDescription className="text-[14px] leading-6 text-[#6B6B6B] mt-2">{description}</DialogDescription>
            ) : null}
          </DialogHeader>
        </div>
        <div className="px-5 pb-5 space-y-4">
          <Button
            onClick={onPrimary}
            className={cn("w-full h-11 rounded-[12px] bg-[#2A504E] text-white", primaryClassName)}
          >
            {primaryLabel}
          </Button>
          {secondaryLabel ? (
            secondaryTo ? (
              <Link
                to={secondaryTo}
                onClick={onSecondary}
                className="block text-center text-[15px] font-medium text-[#2A504E]"
              >
                {secondaryLabel}
              </Link>
            ) : (
              <button
                onClick={onSecondary}
                className="block w-full text-center text-[15px] font-medium text-[#2A504E]"
              >
                {secondaryLabel}
              </button>
            )
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
