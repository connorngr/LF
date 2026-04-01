import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      className = "",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center gap-2
      font-semibold rounded-full
      transition-all duration-300
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      ${fullWidth ? "w-full" : ""}
    `;

    const variants = {
      primary: `
        bg-primary text-primary-text
        hover:bg-primary/90 hover:shadow-xl hover:scale-105
        border-2 border-primary-text/20
        shadow-lg
        focus:ring-primary/50
      `,
      secondary: `
        bg-surface text-foreground
        hover:bg-surface-lighter
        border border-surface-lighter
        focus:ring-surface-lighter
      `,
      outline: `
        bg-transparent text-foreground
        border-2 border-foreground/20
        hover:bg-foreground/5 hover:border-foreground/40
        focus:ring-foreground/20
      `,
      ghost: `
        bg-transparent text-foreground
        hover:bg-foreground/10
        focus:ring-foreground/20
      `,
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base sm:text-lg",
      lg: "px-8 py-3.5 text-lg sm:text-xl",
      xl: "px-10 py-4 text-xl sm:text-2xl",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`
          ${baseStyles}
          ${variants[variant]}
          ${sizes[size]}
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
