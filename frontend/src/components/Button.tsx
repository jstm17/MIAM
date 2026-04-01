import React, { type ReactNode } from "react";

type ButtonVariant = "contained" | "outlined";

type ButtonProps = {
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  small?: boolean;
  destructive?: boolean;
  variant?: ButtonVariant;
};

export const Button = ({
  children,
  type = "button",
  onClick,
  className = "",
  small = false,
  destructive = false,
  variant = "contained",
}: ButtonProps) => {
  const containedStyle = destructive ? "bg-red-700" : "bg-[#646cff]";
  const outlinedStyle = "border border-[#646cff] text-[#646cff]";
  const smallStyle = "px-2 py-1 text-sm rounded-md";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${className} ${
        variant === "outlined" ? outlinedStyle : containedStyle
      } ${small ? smallStyle : "p-4 rounded-lg"} 
      ${variant === "contained" ? "text-white" : ""}
      hover:bg-opacity-90 transition cursor-pointer`}
    >
      {children}
    </button>
  );
};
