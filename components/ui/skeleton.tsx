import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * A lightweight Skeleton loader component.
 * Usage:
 *   <Skeleton className="h-6 w-32" />
 */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-slate-200/60 dark:bg-slate-700/50",
        className
      )}
      {...props}
    />
  )
}
