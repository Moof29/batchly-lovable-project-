
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Columns } from "lucide-react";
import { type ColumnConfig } from "@/hooks/useColumnSelection";
import { useState } from "react";

interface ColumnSelectorProps {
  columns: ColumnConfig[];
  onToggle: (columnKey: string) => void;
}

export const ColumnSelector = ({ columns, onToggle }: ColumnSelectorProps) => {
  const [open, setOpen] = useState(false);

  const handleCheckedChange = (columnKey: string) => {
    // Prevent the dropdown from closing by stopping event propagation
    onToggle(columnKey);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Columns className="mr-2 h-4 w-4" />
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56" sideOffset={5}>
        <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.key}
            checked={column.visible}
            onCheckedChange={() => handleCheckedChange(column.key)}
            onSelect={(e) => {
              // Prevent the dropdown from closing when an item is selected
              e.preventDefault();
            }}
          >
            {column.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
