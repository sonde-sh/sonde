import * as React from "react";

import { cn } from "../../lib/utils";

export type TableProps = React.ComponentProps<"table">;

export function Table({ className, ...props }: TableProps) {
  return (
    <div className="relative w-full overflow-auto rounded-lg border border-[var(--border)]">
      <table className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  );
}

export type TableHeaderProps = React.ComponentProps<"thead">;

export function TableHeader({ className, ...props }: TableHeaderProps) {
  return (
    <thead
      className={cn(
        "sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--card)]",
        className
      )}
      {...props}
    />
  );
}

export type TableBodyProps = React.ComponentProps<"tbody">;

export function TableBody({ className, ...props }: TableBodyProps) {
  return <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

export type TableRowProps = React.ComponentProps<"tr">;

export function TableRow({ className, ...props }: TableRowProps) {
  return (
    <tr
      className={cn(
        "border-b border-[var(--border)] transition-colors odd:bg-[var(--muted)]/40 hover:bg-[var(--muted)]",
        className
      )}
      {...props}
    />
  );
}

export type TableHeadProps = React.ComponentProps<"th">;

export function TableHead({ className, ...props }: TableHeadProps) {
  return (
    <th
      className={cn(
        "h-10 px-4 text-left align-middle text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]",
        className
      )}
      {...props}
    />
  );
}

export type TableCellProps = React.ComponentProps<"td">;

export function TableCell({ className, ...props }: TableCellProps) {
  return <td className={cn("p-4 align-middle", className)} {...props} />;
}
