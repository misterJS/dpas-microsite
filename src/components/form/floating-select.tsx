import { FormControl, FormItem, FormLabel, FormMessage, useFormField } from "@/components/ui/form"
import {
  Select, SelectContent, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import * as React from "react"

type Props = React.ComponentProps<typeof Select> & {
  label: React.ReactNode
  placeholder?: string
  wrapperClassName?: string
  triggerClassName?: string
  contentClassName?: string
  children: React.ReactNode
}

export function FloatingSelect({
  label,
  placeholder,
  wrapperClassName,
  triggerClassName,
  contentClassName,
  children,
  ...selectProps
}: Props) {
  const { error } = useFormField()

  return (
    <FormItem className="space-y-0">
      <div className={cn("relative rounded-sm border px-4 pt-3 pb-[2px]", wrapperClassName)}>
        <Select {...selectProps}>
          <FormControl>
            <SelectTrigger
              className={cn(
                "peer h-7 border-none shadow-none p-0 text-sm bg-transparent",
                "focus:outline-none focus:ring-0 focus:ring-offset-0",
                triggerClassName
              )}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
          </FormControl>

          <SelectContent
            className={cn(
              "rounded-xl border-none w-full p-0 shadow-[0_18.54px_21.4px_0_rgba(0,0,0,0.05)]",
              contentClassName
            )}
          >
            {children}
          </SelectContent>
        </Select>

        <FormLabel
          className={cn(
            "absolute left-3 top-[2px] bg-background px-1 text-[10px] transition-all",
            error ? "text-destructive" : "text-teal-400",
            "peer-data-[placeholder]:top-3 peer-data-[placeholder]:text-xs peer-data-[placeholder]:text-[#737373] peer-data-[placeholder]:font-normal",
            "peer-focus:top-[2px] peer-focus:text-[10px]"
          )}
        >
          {label}
        </FormLabel>
      </div>

      <FormMessage />
    </FormItem>
  )
}
