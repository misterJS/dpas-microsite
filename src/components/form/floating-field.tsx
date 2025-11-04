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
      <div className={cn("relative rounded-sm border px-5 p-[10px] shadow-xl bg-white", wrapperClassName)}>
        <FormControl>
          <Input
            {...props}
            placeholder=" "
            className={cn(
              "peer h-full font-thin border-none mt-2 shadow-none p-0 text-lg items-end bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0",
              className
            )}
          />
        </FormControl>
        <FormLabel
          className="
            absolute text-black text-[14px] transition-all bg-transparent leading-none
            peer-placeholder-shown:self-anchor-center peer-placeholder-shown:text-lg peer-placeholder-shown:text-black peer-placeholder-shown:font-thin peer-placeholder-shown:bg-transparent
            peer-focus:top-[5px] peer-focus:self-auto peer-focus:text-[14px] peer-focus:text-black peer-focus:font-medium
            peer-[&:not(:placeholder-shown)]:top-[5px] peer-[&:not(:placeholder-shown)]:text-[14px]
          "
        >
          {label}
        </FormLabel>
      </div>
      <FormMessage />
    </FormItem>
  )
}
