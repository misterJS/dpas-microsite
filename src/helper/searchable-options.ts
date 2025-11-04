import type { ReactNode } from "react"

import type { SearchableSelectOption } from "@/components/ui/searchable-select"

type OptionConfig<T> = {
  getValue: (item: T) => string | number | null | undefined
  getLabel: (item: T) => ReactNode
  getDescription?: (item: T) => ReactNode
  getKeywords?: (item: T) =>
    | Array<string | number | null | undefined>
    | null
    | undefined
  getDisabled?: (item: T) => boolean | null | undefined
}

export function toSearchableOptions<T>(
  items: readonly T[],
  config: OptionConfig<T>
): SearchableSelectOption[] {
  return items.map((item) => {
    const { getValue, getLabel, getDescription, getKeywords, getDisabled } =
      config

    const value = getValue(item)
    const keywords = getKeywords?.(item) ?? []

    return {
      value: value == null ? "" : String(value),
      label: getLabel(item),
      description: getDescription?.(item),
      keywords: keywords
        .filter((keyword): keyword is string | number => keyword != null)
        .map((keyword) => String(keyword)),
      disabled: Boolean(getDisabled?.(item)),
    }
  })
}

