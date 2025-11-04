import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
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
  return (
    <FormItem className="space-y-0">
      <div className={cn("relative rounded-sm border px-5 p-[10px] shadow-xl bg-white", wrapperClassName)}>
        <Select {...selectProps}>
          <FormControl>
            <SelectTrigger
              className={cn(
                "peer h-full border-none shadow-none font-thin p-0 items-end text-lg bg-transparent",
                "focus:outline-none focus:ring-0 focus:ring-offset-0 mt-1",
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
            "absolute top-[5px] bg-[transparent] text-[14px] transition-all",
            "text-black",
            "peer-data-[placeholder]:top-[28%] peer-data-[placeholder]:text-lg peer-data-[placeholder]:text-black peer-data-[placeholder]:font-thin",
            "peer-focus:top-[5px] peer-focus:text-[14px]"
          )}
        >
          {label}
        </FormLabel>
      </div>

      <FormMessage />
    </FormItem>
  )
}
