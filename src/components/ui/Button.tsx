import * as React from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";

type ButtonBase = {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

type AsButton = ButtonBase &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { to?: never; href?: never };

type AsAnchor = ButtonBase &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; to?: never };

type AsLink = ButtonBase &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    to: string;
    href?: never;
  };

export type ButtonProps = AsButton | AsAnchor | AsLink;

export const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97]";

    const variants: Record<string, string> = {
      primary:
        "rounded-full text-white",
      secondary:
        "rounded-full border border-theme text-theme hover:bg-card",
      outline:
        "rounded-xl border border-theme text-theme hover:border-accent/40 hover:text-accent bg-card",
      ghost:
        "rounded-xl text-muted hover:text-theme hover:bg-card",
      link:
        "text-accent hover:underline p-0 bg-transparent",
      danger:
        "rounded-full text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20",
    };

    const sizes: Record<string, string> = {
      sm: "px-4 py-2 text-xs gap-1.5",
      md: "px-6 py-3 text-sm gap-2",
      lg: "px-8 py-3.5 text-sm md:text-base gap-2.5",
    };

    const inlineStyles: React.CSSProperties = {};
    if (variant === "primary") {
      inlineStyles.backgroundColor = "var(--accent)";
    }

    const cls = cn(
      base,
      variants[variant],
      variant !== "link" && sizes[size],
      fullWidth && "w-full",
      className
    );

    const content = (
      <>
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="flex shrink-0">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="flex shrink-0">{rightIcon}</span>}
      </>
    );

    if ((props as AsLink).to !== undefined) {
      const { to, ...rest } = props as AsLink;
      return (
        <Link to={to} className={cls} style={inlineStyles} ref={ref as React.ForwardedRef<HTMLAnchorElement>} {...rest}>
          {content}
        </Link>
      );
    }

    if ((props as AsAnchor).href !== undefined) {
      const { href, ...rest } = props as AsAnchor;
      return (
        <a href={href} className={cls} style={inlineStyles} ref={ref as React.ForwardedRef<HTMLAnchorElement>} {...rest}>
          {content}
        </a>
      );
    }

    const { type = "button", ...rest } = props as AsButton;
    return (
      <button type={type} className={cls} style={inlineStyles} ref={ref as React.ForwardedRef<HTMLButtonElement>} {...rest}>
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";
