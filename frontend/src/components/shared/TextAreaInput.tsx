import { type ReactNode, forwardRef, useEffect, useRef } from "react";
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
  onInput?: (event: React.FormEvent<HTMLTextAreaElement>) => void;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
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
    const localRef = useRef<HTMLTextAreaElement | null>(null);

    const setRef = (element: HTMLTextAreaElement | null) => {
      localRef.current = element;
      if (!ref) return;
      if (typeof ref === "function") {
        ref(element);
      } else {
        (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current =
          element;
      }
    };

    const resizeTextarea = (textarea: HTMLTextAreaElement | null) => {
      if (!textarea) return;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    };

    useEffect(() => {
      resizeTextarea(localRef.current);
    }, [value]);

    const handleInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
      resizeTextarea(event.currentTarget);
      props.onInput?.(event);
    };

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      resizeTextarea(event.currentTarget);
      props.onChange?.(event);
    };

    return (
      <Field>
        {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
        <Textarea
          ref={setRef}
          id={name}
          name={name}
          value={value}
          placeholder={placeholder}
          aria-invalid={!!error}
          className={className}
          onInput={handleInput}
          onChange={handleChange}
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
