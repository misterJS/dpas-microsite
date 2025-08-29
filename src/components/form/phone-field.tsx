import * as React from "react"
import { cn } from "@/lib/utils"
import {
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
    useFormField,
} from "@/components/ui/form"

type Props = {
    label: React.ReactNode
    value?: string
    onChange?: (v: string) => void
    prefix?: string
    wrapperClassName?: string
    requiredMark?: boolean
}

export function PhoneField({
    label,
    value,
    onChange,
    prefix = "+62",
    wrapperClassName,
    requiredMark,
}: Props) {
    useFormField()
    const ref = React.useRef<HTMLInputElement>(null)
    const hasValue = (value ?? "").length > 0

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const digitsOnly = e.target.value.replace(/[^\d]/g, "")
        onChange?.(digitsOnly)
    }

    return (
        <FormItem className="space-y-0">
            <div className={cn("flex items-stretch rounded-[12px] border overflow-hidden", wrapperClassName)}>
                <button
                    type="button"
                    onClick={() => ref.current?.focus()}
                    className="w-16 text-xs shrink-0 bg-[#6AC3BE] text-[#006660] font-normal grid place-items-center"
                    aria-hidden
                >
                    {prefix}
                </button>

                <div className="relative flex-1">
                    <FormControl>
                        <input
                            ref={ref}
                            type="tel"
                            inputMode="numeric"
                            pattern="\d*"
                            value={value ?? ""}
                            onChange={handleChange}
                            className="peer h-12 w-full bg-transparent px-4 border-0 outline-none focus-visible:ring-0"
                        />
                    </FormControl>

                    <span
                        className={cn(
                            "pointer-events-none text-xs absolute left-4 top-1/2 -translate-y-1/2 text-[#989898] transition-opacity",
                            hasValue ? "opacity-0" : "opacity-100",
                            "peer-focus:opacity-0"
                        )}
                        aria-hidden
                    >
                        {label}
                        {requiredMark ? <span className="text-red-500"> *</span> : null}
                    </span>
                </div>
            </div>

            <FormLabel className="sr-only">{label}</FormLabel>
            <FormMessage />
        </FormItem>
    )
}
