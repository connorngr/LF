import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full bg-muted text-center select-none",
  {
    variants: {
      size: {
        default: "size-10",
        sm: "size-8",
        lg: "size-20",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

function Avatar({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof avatarVariants>) {
  return (
    <span
      data-slot="avatar"
      data-size={size}
      className={cn(avatarVariants({ size }), className)}
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }: React.ComponentProps<"img">) {
  return (
    <img
      data-slot="avatar-image"
      className={cn(
        "aspect-square size-full object-cover",
        className
      )}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
}
