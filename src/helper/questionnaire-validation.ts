import type { HealthQuestion, ValidationRule } from "@/api/types"

const VALIDATION_RULES: ValidationRule[] = ["REQUIRED_YES", "REQUIRED_NO", "REQUIRED_ANY"]
const VALIDATION_RULE_LOOKUP = new Set<ValidationRule>(VALIDATION_RULES)

const DEFAULT_RULE_BY_TYPE: Record<string, ValidationRule> = {
  HEALTH_QUESTIONNAIRE: "REQUIRED_NO",
  CONSENT: "REQUIRED_YES",
}

const normalizeAnswer = (value?: string | null) => value?.toLowerCase().trim() ?? ""

export const normalizeValidationRule = (rule?: string | null): ValidationRule | undefined => {
  if (!rule) return undefined
  const upper = rule.toUpperCase() as ValidationRule
  return VALIDATION_RULE_LOOKUP.has(upper) ? upper : undefined
}

export const resolveValidationRule = (
  question: Pick<HealthQuestion, "type" | "validation_rule">
): ValidationRule => {
  return (
    normalizeValidationRule(question?.validation_rule) ??
    DEFAULT_RULE_BY_TYPE[question.type] ??
    "REQUIRED_YES"
  )
}

export const isAnswerValidForQuestion = (
  question: Pick<HealthQuestion, "type" | "validation_rule">,
  answer?: string | null
): boolean => {
  const normalized = normalizeAnswer(answer)
  if (!normalized) return false

  switch (resolveValidationRule(question)) {
    case "REQUIRED_ANY":
      return normalized === "yes" || normalized === "no"
    case "REQUIRED_NO":
      return normalized === "no"
    case "REQUIRED_YES":
    default:
      return normalized === "yes"
  }
}

