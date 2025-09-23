export const useTArray = (useTranslation: any) => {
  const { t } = useTranslation;
  return <T = string>(key: string): T[] => {
    const v = t(key, { returnObjects: true }) as unknown
    if (Array.isArray(v)) return v as T[]
    if (v && typeof v === "object") return Object.values(v) as T[]
    return []
  }
}
