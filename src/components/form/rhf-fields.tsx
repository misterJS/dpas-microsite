import React from "react";
import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/ui/form";
import { FloatingField } from "@/components/form/floating-field";
import { FloatingSelect } from "@/components/form/floating-select";
import { PhoneField } from "@/components/form/phone-field";
import { DateField } from "@/components/form/date-field";

type WithRequiredMark = {
  requiredMark?: boolean;
};

export function RHFTextField({
  name,
  label,
  requiredMark,
  wrapperClassName = "rounded-[8px] h-[70px]",
  ...props
}: Omit<React.ComponentProps<typeof FloatingField>, "value" | "onChange"> &
  WithRequiredMark & { name: string }) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name as any}
      render={({ field }) => (
        <FloatingField
          {...field}
          {...props}
          label={
            <>
              {label}
              {requiredMark && <span className="text-red-500"> *</span>}
            </>
          }
          wrapperClassName={wrapperClassName}
        />
      )}
    />
  );
}

type FloatingSelectProps = React.ComponentProps<typeof FloatingSelect>;

export function RHFSelectField({
  name,
  label,
  requiredMark,
  onValue,
  wrapperClassName = "rounded-[8px] h-[70px]",
  children,
  searchableOptions,
  searchPlaceholder,
  emptyText,
  renderSearchOption,
  renderSearchTriggerValue,
  ...rest
}: Omit<FloatingSelectProps, "value" | "onValueChange"> &
  WithRequiredMark & {
    name: string
    children?: React.ReactNode
    onValue?: (v: any) => any
  }) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name as any}
      render={({ field }) => (
        <FloatingSelect
          value={field.value ?? ""}
          onValueChange={(v) => field.onChange(onValue ? onValue(v) : v)}
          label={
            <>
              {label}
              {requiredMark && <span className="text-red-500"> *</span>}
            </>
          }
          wrapperClassName={wrapperClassName}
          searchableOptions={searchableOptions}
          searchPlaceholder={searchPlaceholder}
          emptyText={emptyText}
          renderSearchOption={renderSearchOption}
          renderSearchTriggerValue={renderSearchTriggerValue}
          {...rest}
        >
          {children}
        </FloatingSelect>
      )}
    />
  );
}

export function RHFPhoneField({
  name,
  label,
  requiredMark,
  wrapperClassName = "rounded-[8px] h-[70px]",
  ...props
}: Omit<React.ComponentProps<typeof PhoneField>, "value" | "onChange"> &
  WithRequiredMark & { name: string }) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name as any}
      render={({ field }) => (
        <PhoneField
          value={field.value}
          onChange={field.onChange}
          label={
            <>
              {label}
              {requiredMark && <span className="text-red-500"> *</span>}
            </>
          }
          wrapperClassName={wrapperClassName}
          {...props}
        />
      )}
    />
  );
}

export function RHFDateField({
  name,
  label,
  requiredMark,
  wrapperClassName = "mt-2 rounded-[8px] h-[70px]",
  ...rest
}: Omit<React.ComponentProps<typeof DateField>, "value" | "onChange"> &
  WithRequiredMark & { name: string }) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name as any}
      render={({ field }) => (
        <DateField
          value={field.value}
          onChange={field.onChange}
          label={
            <>
              {label}
              {requiredMark && <span className="text-red-500"> *</span>}
            </>
          }
          wrapperClassName={wrapperClassName}
          {...rest}
        />
      )}
    />
  );
}