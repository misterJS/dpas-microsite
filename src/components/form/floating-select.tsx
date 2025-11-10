import * as React from "react"

import { SearchableSelect } from "@/components/ui/searchable-select"
import type {
  SearchableSelectOption,
  SearchableSelectProps,
} from "@/components/ui/searchable-select"
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type Props = React.ComponentProps<typeof Select> & {
  label: React.ReactNode
  placeholder?: string
  wrapperClassName?: string
  triggerClassName?: string
  contentClassName?: string
  children?: React.ReactNode
  searchableOptions?: SearchableSelectOption[]
  searchPlaceholder?: string
  emptyText?: React.ReactNode
  searchInputClassName?: string
  renderSearchOption?: SearchableSelectProps["renderOption"]
  renderSearchTriggerValue?: SearchableSelectProps["renderTriggerValue"]
}

export function FloatingSelect({
  label,
  placeholder,
  wrapperClassName,
  triggerClassName,
  contentClassName,
  children,
  searchableOptions,
  searchPlaceholder,
  emptyText,
  searchInputClassName,
  renderSearchOption,
  renderSearchTriggerValue,
  ...selectProps
}: Props) {
  const {
    value,
    defaultValue,
    onValueChange,
    disabled,
    ...restSelectProps
  } = selectProps

  const [internalValue, setInternalValue] = React.useState<string | undefined>(
    (value as string | undefined) ??
      (defaultValue as string | undefined) ??
      undefined
  )

  React.useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value as string | undefined)
    }
  }, [value])

  React.useEffect(() => {
    if (value === undefined && defaultValue !== undefined) {
      setInternalValue(defaultValue as string | undefined)
    }
  }, [defaultValue, value])

  const handleValueChange = React.useCallback(
    (nextValue: string) => {
      if (value === undefined) {
        setInternalValue(nextValue)
      }

      onValueChange?.(nextValue)
    },
    [onValueChange, value]
  )

  const currentValue =
    (value as string | undefined) ?? internalValue ?? undefined
  const isPlaceholder = !currentValue || currentValue.length === 0
  const hasSearch = Array.isArray(searchableOptions)

  const selectValueProps =
    value !== undefined
      ? { value: value as string | undefined }
      : { defaultValue: defaultValue as string | undefined }

  return (
    <FormItem className="space-y-0">
      <div
        className={cn(
          "relative rounded-sm border bg-white px-5 p-[10px] shadow-xl",
          wrapperClassName
        )}
      >
        <FormControl>
          {hasSearch ? (
            <SearchableSelect
              value={currentValue}
              onChange={(next, option) => {
                handleValueChange(next)
                if (!option && next === "") {
                  setInternalValue(undefined)
                }
              }}
              options={searchableOptions ?? []}
              placeholder={placeholder}
              searchPlaceholder={searchPlaceholder}
              emptyText={emptyText}
              contentClassName={contentClassName}
              inputClassName={searchInputClassName}
              renderOption={renderSearchOption}
              renderTriggerValue={renderSearchTriggerValue}
              disabled={disabled}
              variant="ghost"
              className={cn(
                "peer mt-1 flex h-full w-full items-end justify-between border-none bg-transparent p-0 text-left text-lg font-thin shadow-none focus:outline-none focus:ring-0 focus:ring-offset-0",
                triggerClassName
              )}
              data-placeholder={isPlaceholder ? "" : undefined}
            />
          ) : (
            <Select
              {...restSelectProps}
              {...selectValueProps}
              disabled={disabled}
              onValueChange={handleValueChange}
            >
              <SelectTrigger
                className={cn(
                  "peer mt-1 h-full border-none bg-transparent p-0 text-lg font-thin shadow-none focus:outline-none focus:ring-0 focus:ring-offset-0 items-end",
                  triggerClassName
                )}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>

              <SelectContent
                className={cn(
                  "w-full rounded-xl border-none p-0 shadow-[0_18.54px_21.4px_0_rgba(0,0,0,0.05)]",
                  contentClassName
                )}
              >
                {children}
              </SelectContent>
            </Select>
          )}
        </FormControl>

        <FormLabel
          className={cn(
            "absolute top-[5px] bg-[transparent] text-[14px] text-black transition-all",
            "peer-data-[placeholder]:top-[28%] peer-data-[placeholder]:text-lg peer-data-[placeholder]:font-thin",
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