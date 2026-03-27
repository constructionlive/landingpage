import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-do-border bg-do-bg-card px-4 py-3 text-base text-do-text shadow-sm transition-colors placeholder:text-do-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-do-orange focus-visible:ring-offset-2 focus-visible:ring-offset-do-bg disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
