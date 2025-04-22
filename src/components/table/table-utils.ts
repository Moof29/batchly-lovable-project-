
import { Column } from "@tanstack/react-table";

export type SortDirection = "asc" | "desc" | false;

export function getSortIcon(column: Column<any, any>): string {
  if (!column.getIsSorted()) return "sort-desc";
  return column.getIsSorted() === "asc" ? "sort-asc" : "sort-desc";
}

export function getSortingFn(a: any, b: any) {
  // Handle different data types
  if (typeof a === "string" && typeof b === "string") {
    return a.localeCompare(b);
  }
  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() - b.getTime();
  }
  return 0;
}
