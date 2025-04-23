
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Columns, ArrowUp, ArrowDown } from "lucide-react";
import { type ColumnConfig } from "@/hooks/useColumnSelection";
import { useState } from "react";

interface ColumnSelectorProps {
  columns: ColumnConfig[];
  onToggle: (columnKey: string) => void;
  onMove: (columnKey: string, direction: 'up' | 'down') => void;
}

export const ColumnSelector = ({ columns, onToggle, onMove }: ColumnSelectorProps) => {
  const [open, setOpen] = useState(false);

  const handleCheckedChange = (columnKey: string) => {
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
      <DropdownMenuContent align="end" className="w-72" sideOffset={5}>
        <DropdownMenuLabel>Configure Columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.sort((a, b) => a.order - b.order).map((column, index) => (
          <div key={column.key} className="flex items-center px-2 py-1 hover:bg-accent">
            <DropdownMenuCheckboxItem
              checked={column.visible}
              onCheckedChange={() => handleCheckedChange(column.key)}
              onSelect={(e) => e.preventDefault()}
              className="flex-grow"
            >
              {column.label}
            </DropdownMenuCheckboxItem>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => onMove(column.key, 'up')}
                disabled={index === 0}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => onMove(column.key, 'down')}
                disabled={index === columns.length - 1}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
