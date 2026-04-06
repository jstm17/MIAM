import { Input } from "@/components/ui/input";
import { type ChangeEvent, type ReactNode, forwardRef } from "react";
import { Field, FieldDescription, FieldLabel } from "../ui/field";

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
  capitalize?: boolean;
  list?: string;
  accept?: string;
  description?: string | null;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
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
      capitalize = false,
      list,
      onKeyDown,
      accept = "",
      description = "",
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
          list={list}
          accept={accept}
          onKeyDown={onKeyDown}
          onChange={
            capitalize
              ? (e) => {
                  const target = e.target as HTMLInputElement;
                  target.value =
                    target.value.charAt(0).toUpperCase() +
                    target.value.slice(1);
                  onChange?.(e);
                }
              : onChange
          }
          aria-invalid={!!error}
          className={className}
          {...props}
        />
        {error && (
          <FieldDescription className="text-destructive text-xs">
            {error}
          </FieldDescription>
        )}
        {description && (
          <FieldDescription className="text-xs whitespace-pre-line">
            {description}
          </FieldDescription>
        )}
        {children}
      </Field>
    );
  },
);

TextInput.displayName = "TextInput";
