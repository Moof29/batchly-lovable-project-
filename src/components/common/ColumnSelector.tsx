
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Columns, GripVertical } from "lucide-react";
import { type ColumnConfig } from "@/hooks/useColumnSelection";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";

interface ColumnSelectorProps {
  columns: ColumnConfig[];
  onToggle: (columnKey: string) => void;
  onMove: (columnKey: string, direction: 'up' | 'down') => void;
  onReorder: (startIndex: number, endIndex: number) => void;
}

export const ColumnSelector = ({ columns, onToggle, onMove, onReorder }: ColumnSelectorProps) => {
  const [open, setOpen] = useState(false);

  const handleCheckedChange = (columnKey: string) => {
    onToggle(columnKey);
  };

  const handleDragEnd = (result: DropResult) => {
    // Dropped outside the list
    if (!result.destination) return;
    
    const startIndex = result.source.index;
    const endIndex = result.destination.index;
    
    // If the item is dropped in a different position
    if (startIndex !== endIndex) {
      onReorder(startIndex, endIndex);
    }
  };

  const sortedColumns = [...columns].sort((a, b) => a.order - b.order);

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
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="column-list">
            {(provided) => (
              <div 
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="max-h-[400px] overflow-y-auto"
              >
                {sortedColumns.map((column, index) => (
                  <Draggable 
                    key={column.key} 
                    draggableId={column.key} 
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`flex items-center px-2 py-1 hover:bg-accent group ${
                          snapshot.isDragging ? "bg-accent" : ""
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div 
                            {...provided.dragHandleProps}
                            className="text-gray-400 cursor-grab active:cursor-grabbing"
                          >
                            <GripVertical className="h-4 w-4" />
                          </div>
                          <DropdownMenuCheckboxItem
                            checked={column.visible}
                            onCheckedChange={() => handleCheckedChange(column.key)}
                            onSelect={(e) => e.preventDefault()}
                            className="flex-grow"
                          >
                            {column.label}
                          </DropdownMenuCheckboxItem>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
