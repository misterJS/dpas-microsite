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
  wrapperClassName = "rounded-[12px]",
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

export function RHFSelectField({
  name,
  label,
  requiredMark,
  onValue,
  wrapperClassName = "rounded-[12px]",
  children,
  ...rest
}: Omit<React.ComponentProps<typeof FloatingSelect>, "value" | "onValueChange" | "children"> &
  WithRequiredMark & { name: string; children: React.ReactNode; onValue?: (v: any) => any }) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name as any}
      render={({ field }) => (
        <FloatingSelect
          value={field.value}
          onValueChange={(v) => field.onChange(onValue ? onValue(v) : v)}
          label={
            <>
              {label}
              {requiredMark && <span className="text-red-500"> *</span>}
            </>
          }
          wrapperClassName={wrapperClassName}
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
  wrapperClassName = "rounded-[12px]",
  ...rest
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
          {...rest}
        />
      )}
    />
  );
}

export function RHFDateField({
  name,
  label,
  requiredMark,
  wrapperClassName,
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
