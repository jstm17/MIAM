import React from "react";

type TypographyProps = {
  children: React.ReactNode;
  variant?: "h1" | "h2" | "h3" | "body";
  size?: "sm" | "md" | "lg";
  weight?: "normal" | "semibold" | "bold";
  small?: boolean;
  muted?: boolean;
  className?: string;
};
export const Typography = (props: TypographyProps) => {
  const {
    children,
    variant = "body",
    size = "md",
    weight = "normal",
    small = false,
    muted = false,
    className = "",
  } = props;

  const baseClasses = "";
  const variantClasses = {
    h1: "scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance",
    h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
    h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
    body: "text-sm leading-7",
  };
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };
  const weightClasses = {
    normal: "font-normal",
    semibold: "font-semibold",
    bold: "font-bold",
  };
  const smallClasses = small ? "text-sm leading-none font-medium" : "";
  const mutedClasses = muted ? "text-sm text-muted-foreground" : "";
  const classes = `${className} ${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${weightClasses[weight]} ${smallClasses} ${mutedClasses}`;

  return <div className={classes}>{children}</div>;
};
