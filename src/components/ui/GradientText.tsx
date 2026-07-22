import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

export function GradientText({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return <span className={cn("text-gradient", className)}>{children}</span>;
}
