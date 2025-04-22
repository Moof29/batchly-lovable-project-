
import React, { useState } from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Calendar,
  Check,
  FileDown,
  Search,
  AlertTriangle,
  Info,
  X,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { QBOSyncError, useQBOErrorsList } from "@/hooks/qbo/useQBOErrorsList";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

type SortField = 'timestamp' | 'entityType' | 'category' | 'occurrenceCount';

interface QBOIntegrationErrorsListProps {
  errors: any[];
  resolveError: (errorId: string) => void;
  isLoading: boolean;
}

const QBOIntegrationErrorsList: React.FC<QBOIntegrationErrorsListProps> = ({
  errors: rawErrors,
  resolveError,
  isLoading
}) => {
  const { errors, stats, filters, updateFilters } = useQBOErrorsList(rawErrors);
  const [searchText, setSearchText] = useState("");
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Filtered and sorted errors
  const displayedErrors = errors
    .filter(error => 
      error.message.toLowerCase().includes(searchText.toLowerCase()) ||
      error.entityType.toLowerCase().includes(searchText.toLowerCase()) ||
      error.category.toLowerCase().includes(searchText.toLowerCase())
    )
    .sort((a, b) => {
      if (sortField === 'timestamp') {
        return sortDirection === 'desc' 
          ? b.timestamp.getTime() - a.timestamp.getTime()
          : a.timestamp.getTime() - b.timestamp.getTime();
      } else if (sortField === 'occurrenceCount') {
        return sortDirection === 'desc'
          ? (b.occurrenceCount || 0) - (a.occurrenceCount || 0)
          : (a.occurrenceCount || 0) - (b.occurrenceCount || 0);
      } else {
        // For string fields
        const aVal = a[sortField]?.toLowerCase() || '';
        const bVal = b[sortField]?.toLowerCase() || '';
        return sortDirection === 'desc'
          ? bVal.localeCompare(aVal)
          : aVal.localeCompare(bVal);
      }
    });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleResolveError = (errorId: string) => {
    resolveError(errorId);
    toast({
      title: "Error marked as resolved",
      description: "The error has been marked as resolved and will be filtered out.",
      variant: "default",
    });
  };

  const handleExportErrors = () => {
    // Create CSV data
    const csvData = [
      ['ID', 'Entity Type', 'Category', 'Message', 'Timestamp', 'Occurrences', 'Resolved'],
      ...errors.map(error => [
        error.id,
        error.entityType,
        error.category,
        error.message,
        error.timestamp.toISOString(),
        error.occurrenceCount || 1,
        error.resolved ? 'Yes' : 'No'
      ])
    ];
    
    // Convert to CSV string
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `qbo-errors-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>QBO Sync Errors</CardTitle>
          <CardDescription>Loading error registry...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center gap-2">
            <AlertCircle className="h-8 w-8 text-muted-foreground animate-pulse" />
            <p className="text-muted-foreground">Loading error data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderCategoryIcon = (category: string) => {
    switch(category) {
      case 'auth':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'validation':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'rate_limit':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'data':
        return <AlertCircle className="h-4 w-4 text-purple-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryBadgeStyle = (category: string) => {
    switch(category) {
      case 'auth':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'validation':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'rate_limit':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'connection':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'data':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <CardTitle>QBO Sync Errors</CardTitle>
            <CardDescription className="flex items-center gap-1">
              {stats.unresolvedErrors} unresolved issues found
            </CardDescription>
          </div>
          
          {stats.unresolvedErrors > 0 && (
            <div className="flex gap-1 mt-2 sm:mt-0">
              <Badge variant="outline" className="bg-red-50">
                Critical: {errors.filter(e => e.category === 'auth' || e.category === 'rate_limit').length}
              </Badge>
              <Badge variant="outline" className="bg-amber-50">
                Warnings: {errors.filter(e => e.category === 'validation' || e.category === 'connection').length}
              </Badge>
              <Badge variant="outline" className="bg-blue-50">
                Data: {errors.filter(e => e.category === 'data').length}
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex w-full max-w-md items-center space-x-2">
            <Input
              type="text"
              placeholder="Search errors..."
              className="flex-1"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button type="submit" size="icon" variant="ghost" className="h-8 w-8">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Select 
              value={filters.category} 
              onValueChange={(value) => updateFilters({ category: value })}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="auth">Authentication</SelectItem>
                <SelectItem value="validation">Validation</SelectItem>
                <SelectItem value="rate_limit">Rate Limit</SelectItem>
                <SelectItem value="connection">Connection</SelectItem>
                <SelectItem value="data">Data</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={filters.entityType} 
              onValueChange={(value) => updateFilters({ entityType: value })}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Entity Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Entities</SelectItem>
                <SelectItem value="customers">Customers</SelectItem>
                <SelectItem value="items">Items</SelectItem>
                <SelectItem value="invoices">Invoices</SelectItem>
                <SelectItem value="bills">Bills</SelectItem>
                <SelectItem value="payments">Payments</SelectItem>
                <SelectItem value="connection">Connection</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={filters.resolved ? "true" : "false"} 
              onValueChange={(value) => updateFilters({ resolved: value === "true" })}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">Unresolved</SelectItem>
                <SelectItem value="true">All</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              className="flex gap-2 items-center" 
              onClick={handleExportErrors}
            >
              <FileDown className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>

        {/* Errors Table */}
        {displayedErrors.length > 0 ? (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="w-[180px] cursor-pointer" 
                    onClick={() => handleSort('timestamp')}
                  >
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Timestamp</span>
                      {sortField === 'timestamp' && (
                        sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('entityType')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Entity Type</span>
                      {sortField === 'entityType' && (
                        sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('category')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Category</span>
                      {sortField === 'category' && (
                        sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead 
                    className="text-right cursor-pointer"
                    onClick={() => handleSort('occurrenceCount')}
                  >
                    <div className="flex items-center gap-1 justify-end">
                      <span>Count</span>
                      {sortField === 'occurrenceCount' && (
                        sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-right w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedErrors.map((error) => (
                  <TableRow key={error.id} className="group">
                    <TableCell className="text-xs">
                      <div className="flex flex-col">
                        <span>{error.timestamp.toLocaleDateString()}</span>
                        <span className="text-muted-foreground">{error.timestamp.toLocaleTimeString()}</span>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{error.entityType}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`${getCategoryBadgeStyle(error.category)} flex items-center gap-1`}
                      >
                        {renderCategoryIcon(error.category)}
                        <span className="capitalize">{error.category}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate">{error.message}</TableCell>
                    <TableCell className="text-right">
                      {error.occurrenceCount || 1}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 hover:bg-green-50 hover:text-green-600"
                        onClick={() => handleResolveError(error.id)}
                      >
                        <Check className="h-4 w-4 mr-1" /> Resolve
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="border rounded-md flex flex-col items-center justify-center p-8 text-center">
            <div className="bg-green-50 p-3 rounded-full mb-4">
              <Check className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-lg font-medium">No errors found</h3>
            <p className="text-muted-foreground">
              {searchText || filters.category !== 'all' || filters.entityType !== 'all'
                ? "No errors matching the current filters"
                : "Your QBO integration is running smoothly"}
            </p>
            {(searchText || filters.category !== 'all' || filters.entityType !== 'all') && (
              <Button 
                variant="link" 
                onClick={() => {
                  setSearchText("");
                  updateFilters({ category: 'all', entityType: 'all' });
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QBOIntegrationErrorsList;
