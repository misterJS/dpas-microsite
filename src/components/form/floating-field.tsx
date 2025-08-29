import { FormControl, FormItem, FormLabel, FormMessage, useFormField } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type Props = React.ComponentProps<typeof Input> & {
  label: React.ReactNode
  wrapperClassName?: string
}

export function FloatingField({ label, className, wrapperClassName, ...props }: Props) {
  useFormField()

  return (
    <FormItem className="space-y-0">
      <div className={cn("relative rounded-sm border px-4 pt-3 pb-[2px]", wrapperClassName)}>
        <FormControl>
          <Input
            {...props}
            placeholder=" "
            className={cn(
              "peer h-7 border-none shadow-none p-0 text-sm bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0",
              className
            )}
          />
        </FormControl>
        <FormLabel
          className="
            absolute left-3 top-[2px] text-teal-400 transition-all bg-background px-1
            peer-placeholder-shown:top-3 peer-placeholder-shown:text-xs peer-placeholder-shown:text-[#737373] peer-placeholder-shown:font-normal peer-placeholder-shown:bg-transparent
            peer-focus:top-[2px] peer-focus:text-[10px] peer-focus:text-teal-400
            peer-[&:not(:placeholder-shown)]:top-[3px] peer-[&:not(:placeholder-shown)]:text-[10px]
          "
        >
          {label}
        </FormLabel>
      </div>
      <FormMessage />
    </FormItem>
  )
}
