import { type ChangeEvent, type ReactNode, forwardRef } from "react";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";

type GroupInputProps = {
  label?: string;
  name?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  error?: string;
  className?: string;
  children?: ReactNode;
  placeholder?: string;
  inputGroupAddon?: string | ReactNode;
  capitalize?: boolean;
  list?: string;
  inputGroupAddonClassName?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export const GroupInput = forwardRef<HTMLInputElement, GroupInputProps>(
  (
    {
      label,
      name,
      value,
      onChange,
      onKeyDown,
      type = "text",
      error,
      className = "",
      children,
      placeholder = "",
      inputGroupAddon = "",
      capitalize = false,
      inputGroupAddonClassName = "",
      list,
      ...props
    },
    ref,
  ) => {
    return (
      <Field>
        {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
        <InputGroup>
          <InputGroupInput
            ref={ref}
            id={name}
            name={name}
            type={type}
            value={value}
            placeholder={placeholder}
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
            list={list}
            onKeyDown={onKeyDown}
            {...props}
          />

          {inputGroupAddon && (
            <InputGroupAddon
              align="inline-end"
              className={`text-foreground/50 ${inputGroupAddonClassName}`}
            >
              {inputGroupAddon}
            </InputGroupAddon>
          )}
        </InputGroup>

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

GroupInput.displayName = "GroupInput";
