import { type ChangeEvent, type ReactNode, forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldLabel } from "./ui/field";

type TextInputProps = {
  label?: string;
  name?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  error?: string;
  className?: string;
  children?: ReactNode;
  placeholder?: string;
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      name,
      value,
      onChange,
      type = "text",
      error,
      className = "",
      children,
      placeholder = "",
      ...props
    },
    ref,
  ) => {
    return (
      <Field>
        {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
        <Input
          ref={ref}
          id={name}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          aria-invalid={!!error}
          className={className}
          {...props}
        />
        {error && (
          <FieldDescription className="text-destructive text-xs">
            {error}
          </FieldDescription>
        )}
        {children}
      </Field>
    );
  },
);

TextInput.displayName = "TextInput";
