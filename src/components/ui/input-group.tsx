import * as React from "react"
import { cn } from "@/lib/utils"

// ── InputGroup ────────────────────────────────────────────────────────────────

function InputGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="input-group"
      className={cn("group/input-group relative flex items-center rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2", className)}
      {...props}
    />
  )
}

// ── InputGroupInput ───────────────────────────────────────────────────────────

const InputGroupInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<"input">
>(({ className, ...props }, ref) => (
  <input
    data-slot="input-group-input"
    ref={ref}
    className={cn(
      "flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
))
InputGroupInput.displayName = "InputGroupInput"

// ── InputGroupAddon ───────────────────────────────────────────────────────────

interface InputGroupAddonProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "inline-start" | "inline-end"
}

function InputGroupAddon({ className, align: _align, ...props }: InputGroupAddonProps) {
  return (
    <div
      data-slot="input-group-addon"
      className={cn("flex shrink-0 items-center px-1", className)}
      {...props}
    />
  )
}

// ── InputGroupButton ──────────────────────────────────────────────────────────

interface InputGroupButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string
  size?: string
  render?: React.ReactElement
}

function InputGroupButton({ className, size, render, children, ...props }: InputGroupButtonProps) {
  const sizeClass = size === "icon-xs" ? "h-5 w-5" : size === "icon" ? "h-7 w-7" : "h-8 px-2"

  if (render) {
    return React.cloneElement(render, {
      className: cn("inline-flex items-center justify-center rounded transition-colors", sizeClass, className),
      ...props,
    } as React.HTMLAttributes<HTMLElement>)
  }

  return (
    <button
      data-slot="input-group-button"
      type="button"
      className={cn(
        "inline-flex items-center justify-center rounded transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50",
        sizeClass,
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export { InputGroup, InputGroupInput, InputGroupAddon, InputGroupButton }
