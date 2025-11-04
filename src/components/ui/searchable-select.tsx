import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { Button, type ButtonProps } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export type SearchableSelectOption = {
  value: string
  label: React.ReactNode
  description?: React.ReactNode
  keywords?: string[]
  disabled?: boolean
}

export interface SearchableSelectProps
  extends Omit<ButtonProps, "onChange" | "value" | "children"> {
  options: SearchableSelectOption[]
  value?: string
  onChange?: (
    value: string,
    option: SearchableSelectOption | undefined
  ) => void
  placeholder?: React.ReactNode
  searchPlaceholder?: string
  emptyText?: React.ReactNode
  contentClassName?: string
  inputClassName?: string
  renderOption?: (
    option: SearchableSelectOption,
    state: { isSelected: boolean }
  ) => React.ReactNode
  renderTriggerValue?: (option?: SearchableSelectOption) => React.ReactNode
}

const getNodeText = (node: React.ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") {
    return String(node)
  }

  if (Array.isArray(node)) {
    return node.map(getNodeText).join(" ")
  }

  if (React.isValidElement(node)) {
    return getNodeText(node.props.children)
  }

  return ""
}

export const SearchableSelect = React.forwardRef<
  HTMLButtonElement,
  SearchableSelectProps
>(
  (
    {
      options,
      value,
      onChange,
      placeholder = "",
      searchPlaceholder = "search...",
      emptyText = "data not found",
      contentClassName,
      inputClassName,
      renderOption,
      renderTriggerValue,
      className,
      ...buttonProps
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState("")
    const searchInputRef = React.useRef<HTMLInputElement | null>(null)

    const selectedOption = React.useMemo(
      () => options.find((option) => option.value === value),
      [options, value]
    )

    const filteredOptions = React.useMemo(() => {
      const normalizedQuery = query.trim().toLowerCase()
      if (!normalizedQuery.length) {
        return options
      }

      return options.filter((option) => {
        const labelText = getNodeText(option.label)
        const descriptionText = getNodeText(option.description)
        const keywordsText = (option.keywords ?? []).join(" ")

        const haystack = `${labelText} ${descriptionText} ${keywordsText}`.toLowerCase()

        return haystack.includes(normalizedQuery)
      })
    }, [options, query])

    React.useEffect(() => {
      if (!open) {
        setQuery("")
        return
      }

      const timeout = window.setTimeout(() => {
        searchInputRef.current?.focus()
        searchInputRef.current?.select()
      }, 50)

      return () => window.clearTimeout(timeout)
    }, [open])

    const handleSelect = React.useCallback(
      (option: SearchableSelectOption) => {
        if (option.disabled) {
          return
        }

        setOpen(false)
        onChange?.(option.value, option)
      },
      [onChange]
    )

    const triggerContent = React.useMemo(() => {
      const rendered = renderTriggerValue
        ? renderTriggerValue(selectedOption)
        : selectedOption?.label

      if (
        rendered === null ||
        rendered === undefined ||
        (typeof rendered === "string" && rendered.length === 0)
      ) {
        return placeholder
      }

      return rendered
    }, [placeholder, renderTriggerValue, selectedOption])

    const showPlaceholder =
      !renderTriggerValue && (!selectedOption || !selectedOption.value)

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            type="button"
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={open}
            className={cn("w-full justify-between", className)}
            {...buttonProps}
          >
            <span
              className={cn(
                "truncate",
                showPlaceholder && "text-muted-foreground"
              )}
            >
              {triggerContent}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            "w-[var(--radix-popover-trigger-width,16rem)] p-2",
            contentClassName
          )}
          align="start"
        >
          <Input
            ref={searchInputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            className={cn("mb-2 h-9", inputClassName)}
            autoComplete="off"
          />

          <div
            role="listbox"
            className="max-h-56 overflow-y-auto overscroll-contain rounded-md"
          >
            {filteredOptions.length ? (
              filteredOptions.map((option) => {
                const isSelected = option.value === selectedOption?.value

                return (
                  <button
                    key={option.value}
                    type="button"
                    disabled={option.disabled}
                    onClick={() => handleSelect(option)}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                      isSelected
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent/60"
                    )}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <div className="flex min-w-0 flex-col">
                      {renderOption ? (
                        renderOption(option, { isSelected })
                      ) : (
                        <>
                          <span className="truncate font-medium">
                            {option.label}
                          </span>
                          {option.description ? (
                            <span className="truncate text-xs text-muted-foreground">
                              {option.description}
                            </span>
                          ) : null}
                        </>
                      )}
                    </div>
                    {isSelected ? (
                      <Check className="h-4 w-4 shrink-0" />
                    ) : null}
                  </button>
                )
              })
            ) : (
              <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                {emptyText}
              </p>
            )}
          </div>
        </PopoverContent>
      </Popover>
    )
  }
)

SearchableSelect.displayName = "SearchableSelect"
