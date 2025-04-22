
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface QBOReconciliationFiltersProps {
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  entityFilter: string;
  setEntityFilter: (s: string) => void;
  entityTypes: string[];
  displayNames: Record<string, string>;
}
export const QBOReconciliationFilters: React.FC<QBOReconciliationFiltersProps> = ({
  searchTerm, setSearchTerm, statusFilter, setStatusFilter, entityFilter, setEntityFilter, entityTypes, displayNames
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <div className="flex-1">
        <Input
          placeholder="Search by ID..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="flex flex-1 gap-2">
        <div className="w-1/2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="synced">Synced</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="mismatch">Mismatched</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-1/2">
          <Select value={entityFilter} onValueChange={setEntityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by entity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Entities</SelectItem>
              {entityTypes.map(type => (
                <SelectItem key={type} value={type}>{displayNames[type]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
