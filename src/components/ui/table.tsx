<<<<<<< HEAD

=======
>>>>>>> 573bb45a (Initial project push)
import * as React from "react"

import { cn } from "@/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
<<<<<<< HEAD
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props} />
  </div>
=======
  <table
    ref={ref}
    className={cn("w-full caption-bottom text-sm", className)}
    {...props} />
>>>>>>> 573bb45a (Initial project push)
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
<<<<<<< HEAD
>(({ className, children, ...props }, ref) => (
=======
>(({ className, children, ...props }, ref) => ( // Explicitly accept children
>>>>>>> 573bb45a (Initial project push)
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props}>{children}</thead>
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
<<<<<<< HEAD
>(({ className, children, ...props }, ref) => (
=======
>(({ className, children, ...props }, ref) => ( // Explicitly accept children
>>>>>>> 573bb45a (Initial project push)
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  >{children}</tbody>
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, children, ...props }, ref) => {
<<<<<<< HEAD
  // Aggressively filter out any direct children that are just whitespace strings
  const filteredChildren = React.Children.toArray(children).filter(child => {
    return !(typeof child === 'string' && child.trim() === '');
  });

  return React.createElement(
    'tr',
    {
      ref: ref,
      className: cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className
      ),
      ...props
    },
    filteredChildren // Pass the filtered children
  );
});
TableRow.displayName = "TableRow";

=======
  // Filter children to ensure only valid React elements (like <th> or <td>) are rendered.
  // This helps prevent accidental whitespace or other non-element nodes.
  const validChildren = React.Children.toArray(children).filter(child =>
    React.isValidElement(child)
  );

  return (
    <tr
      ref={ref}
      className={cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className
      )}
      {...props}
    >{validChildren}</tr>
  );
});
TableRow.displayName = "TableRow"
>>>>>>> 573bb45a (Initial project push)

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
<<<<<<< HEAD
>(({ className, children, ...props }, ref) => (
  <th ref={ref} className={cn("h-12 px-3 py-2 text-left align-middle font-semibold text-primary/80 [&:has([role=checkbox])]:pr-0 border-x border-primary/10 whitespace-nowrap", className)} {...props}>{children}</th>
=======
>(({ className, children, ...props }, ref) => ( // Explicitly accept children
  <th
    ref={ref}
    className={cn(
      "h-12 px-3 py-2 text-left align-middle font-semibold text-primary/80 [&:has([role=checkbox])]:pr-0 border-x border-primary/10 whitespace-nowrap",
      className
    )}
    {...props}
  >{children}</th>
>>>>>>> 573bb45a (Initial project push)
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
<<<<<<< HEAD
>(({ className, children, ...props }, ref) => (
  <td ref={ref} className={cn("px-3 py-1.5 align-top [&:has([role=checkbox])]:pr-0 border-x border-primary/10 whitespace-nowrap", className)} {...props}>{children}</td>
=======
>(({ className, children, ...props }, ref) => ( // Explicitly accept children
  <td
    ref={ref}
    className={cn(
        "px-3 py-1.5 align-top [&:has([role=checkbox])]:pr-0 border-x border-primary/10 whitespace-nowrap",
        className
      )}
    {...props}
  >{children}</td>
>>>>>>> 573bb45a (Initial project push)
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
