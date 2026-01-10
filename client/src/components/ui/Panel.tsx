import React from "react";
import { cn } from "../../lib/cn";

type PanelProps = {
  title?: string;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function Panel({ title, headerRight, children, className }: PanelProps) {
  return (
    <section
      className={cn(
        "relative w-full rounded-2xl border border-white/10 bg-white/10",
        "shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-2xl",
        "p-4 sm:p-5",
        className
      )}
    >
      {(title || headerRight) && (
        <header className="mb-2 flex items-center justify-between gap-3">
          {title ? (
            <h2 className="text-xs font-semibold uppercase tracking-wide text-white/90 sm:text-sm">
              {title}
            </h2>
          ) : (
            <div />
          )}
          {headerRight}
        </header>
      )}

      {children}
    </section>
  );
}
