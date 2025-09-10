import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import type { DayPickerProps } from "react-day-picker"
import { cn } from "@/lib/utils"
import { FormControl, FormItem, FormLabel, FormMessage, useFormField } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"

type Props = {
  label: React.ReactNode
  value?: Date
  onChange?: (d?: Date) => void
  wrapperClassName?: string
  requiredMark?: boolean
  // Pass-through configuration for the calendar (month/year dropdowns, limits, etc.)
  captionLayout?: DayPickerProps["captionLayout"]
  fromYear?: DayPickerProps["fromYear"]
  toYear?: DayPickerProps["toYear"]
  disabled?: DayPickerProps["disabled"]
  defaultMonth?: DayPickerProps["defaultMonth"]
}

export function DateField({
  label,
  value,
  onChange,
  wrapperClassName,
  requiredMark,
  captionLayout,
  fromYear,
  toYear,
  disabled,
  defaultMonth,
}: Props) {
  const [open, setOpen] = React.useState(false)
  useFormField()

  const now = React.useMemo(() => new Date(), [])
  const finalToYear = toYear ?? now.getFullYear()
  const finalFromYear = fromYear ?? finalToYear - 100
  const finalDefaultMonth = defaultMonth ?? value ?? new Date(finalToYear - 30, 0, 1)
  const finalDisabled = disabled ?? { after: now }

  return (
    <FormItem className="space-y-0">
      <div className={cn("flex items-stretch rounded-[12px] border overflow-hidden", wrapperClassName)}>
        <div className="w-16 shrink-0 bg-[#6AC3BE] flex items-center justify-center">
          <CalendarIcon className="h-5 w-5 text-[#006660]" aria-hidden />
        </div>

        <FormControl>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className={cn(
                  "flex-1 justify-start rounded-none px-4 text-left h-12",
                  !value && "text-muted-foreground"
                )}
              >
                {value ? format(value, "dd/MM/yyyy") : (
                  <span className="text-[#989898]">
                    {label}{requiredMark ? <span className="text-red-500"> *</span> : null}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="p-0">
              <Calendar
                mode="single"
                selected={value}
                onSelect={(d) => {
                  onChange?.(d)
                  if (d) setOpen(false)
                }}
                captionLayout={captionLayout ?? "dropdown"}
                fromYear={finalFromYear}
                toYear={finalToYear}
                defaultMonth={finalDefaultMonth}
                disabled={finalDisabled}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </FormControl>
      </div>

      <FormLabel className="sr-only">{label}</FormLabel>
      <FormMessage />
    </FormItem>
  )
}
