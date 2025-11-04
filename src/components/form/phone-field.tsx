import * as React from "react"
import { cn } from "@/lib/utils"
import {
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
    useFormField,
} from "@/components/ui/form"
import PhoneIcon from "@/assets/icon/phone.png"
import { Input } from "../ui/input"

type Props = React.ComponentProps<typeof Input> & {
    label: React.ReactNode
    value?: string
    onChange?: (v: string) => void
    prefix?: string
    hint?: string
    wrapperClassName?: string
    requiredMark?: boolean
}

export function PhoneField({
    label,
    value,
    onChange,
    prefix = "+62",
    wrapperClassName,
    hint,
    className
}: Props) {
    useFormField()
    const ref = React.useRef<HTMLInputElement>(null)

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const digitsOnly = e.target.value.replace(/[^\d]/g, "")
        onChange?.(digitsOnly)
    }

    return (
        <FormItem className="space-y-0">
            <div className={cn("flex items-stretch rounded-[12px] border overflow-hidden shadow-xl bg-white", wrapperClassName)}>
                <button
                    type="button"
                    onClick={() => ref.current?.focus()}
                    className="w-16 text-xs shrink-0 text-[#006660] font-normal grid place-items-center"
                    aria-hidden
                >
                    <img src={PhoneIcon} className="w-[19.5px]" alt="phone-icon" />
                </button>

                <div className="relative">
                    <FormControl>
                        <Input
                            ref={ref}
                            type="tel"
                            inputMode="numeric"
                            pattern="\d*"
                            placeholder=" "
                            value={value ?? ""}
                            onChange={handleChange}
                            className={cn(
                                "peer h-full font-thin border-none mt-2 shadow-none pt-6 px-0 text-lg items-end bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0",
                                className
                            )}
                        />
                    </FormControl>

                    <FormLabel
                        className="
                            absolute text-black text-[14px] transition-all bg-transparent leading-none
                            peer-placeholder-shown:self-anchor-center peer-placeholder-shown:text-lg peer-placeholder-shown:text-black peer-placeholder-shown:leading-none peer-placeholder-shown:font-thin peer-placeholder-shown:bg-transparent
                            peer-focus:top-[10px] peer-focus:self-auto peer-focus:text-[14px] peer-focus:text-black peer-focus:font-medium
                            peer-[&:not(:placeholder-shown)]:top-[10px] peer-[&:not(:placeholder-shown)]:text-[14px]
                        "
                    >
                        {label}
                    </FormLabel>
                </div>
            </div>

            <p className="text-base font-thin !mt-2">{hint}</p>
            <FormMessage />
        </FormItem>
    )
}
