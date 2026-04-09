import { type ReactNode, forwardRef } from "react";
import { Checkbox } from "../ui/checkbox";
import { Field, FieldDescription } from "../ui/field";
import { Label } from "../ui/label";

type CheckboxInputProps = {
  label?: string;
  name?: string;
  onChange?: (checked: boolean) => void;
  error?: string;
  className?: string;
  children?: ReactNode;
  checked?: boolean;
};

export const CheckboxInput = forwardRef<HTMLButtonElement, CheckboxInputProps>(
  (
    {
      label,
      name,
      onChange,
      error,
      checked,
      className = "",
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <Field orientation={"horizontal"}>
        <Checkbox
          ref={ref}
          id={name}
          name={name}
          checked={checked}
          onCheckedChange={onChange}
          aria-invalid={!!error}
          className={className}
          {...props}
        />
        {label && <Label htmlFor={name}>{label}</Label>}

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

CheckboxInput.displayName = "CheckboxInput";
