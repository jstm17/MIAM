import { type ReactNode, forwardRef } from "react";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";

type TextAreaInputProps = {
  label?: string;
  name?: string;
  value?: string;
  error?: string;
  className?: string;
  children?: ReactNode;
  placeholder?: string;
  capitalize?: boolean;
  list?: string;
  accept?: string;
  description?: string | null;
  ref?: React.Ref<HTMLTextAreaElement>;
};

export const TextAreaInput = forwardRef<
  HTMLTextAreaElement,
  TextAreaInputProps
>(
  (
    {
      label,
      name,
      value,
      error,
      className = "",
      children,
      placeholder = "",
      description = "",
      ...props
    },
    ref,
  ) => {
    return (
      <Field>
        {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
        <Textarea
          ref={ref}
          id={name}
          name={name}
          value={value}
          placeholder={placeholder}
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

TextAreaInput.displayName = "TextAreaInput";
