"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Download,
  Filter,
} from "lucide-react";

const DataTable = ({
  data,
  columns,
  searchableColumns = [],
  filterableColumns = [],
  bulkActions = [],
  onBulkAction,
  onRowClick,
  defaultSortField = "",
  defaultSortDirection = "asc",
  isLoading = false,
  emptyState,
  className = "",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortField, setSortField] = useState(defaultSortField);
  const [sortDirection, setSortDirection] = useState(defaultSortDirection);

  const getNestedValue = (obj, path) => {
    if (!path) return null;
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  };
  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    if (!data) return [];

    return data.filter((item) => {
      // Apply search
      const matchesSearch =
        searchTerm === "" ||
        searchableColumns.some((col) => {
          const value = getNestedValue(item, col.accessor);
          return (
            value &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          );
        });

      // Apply filters
      const matchesFilters = Object.entries(filters).every(
        ([key, filterValue]) => {
          if (!filterValue || filterValue === "all") return true;

          const value = getNestedValue(item, key);
          return value && value.toString() === filterValue;
        },
      );

      return matchesSearch && matchesFilters;
    });
  }, [data, searchTerm, filters, searchableColumns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;

    return [...filteredData].sort((a, b) => {
      let aValue = getNestedValue(a, sortField);
      let bValue = getNestedValue(b, sortField);

      // Handle different data types
      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortField, sortDirection]);

  // Select all rows
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(sortedData.map((item) => item.id));
    } else {
      setSelectedRows([]);
    }
  };

  // Toggle single row selection
  const toggleRowSelection = (rowId) => {
    if (selectedRows.includes(rowId)) {
      setSelectedRows(selectedRows.filter((id) => id !== rowId));
    } else {
      setSelectedRows([...selectedRows, rowId]);
    }
  };

  // Check if all rows are selected
  const allSelected =
    selectedRows.length > 0 && selectedRows.length === sortedData.length;

  // Check if some rows are selected
  const someSelected =
    selectedRows.length > 0 && selectedRows.length < sortedData.length;

  // Handle bulk action
  const handleBulkActionClick = (action) => {
    if (onBulkAction) {
      onBulkAction(action, selectedRows);
      setSelectedRows([]);
    }
  };

  // Get nested value from object using dot notation

  // Sortable header component
  const SortableHeader = ({ column }) => {
    const isSorted = sortField === column.accessor;
    const isAsc = isSorted && sortDirection === "asc";

    return (
      <TableHead
        className={`cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${column.headerClassName || ""}`}
        onClick={() => column.sortable !== false && handleSort(column.accessor)}
      >
        <div className="flex items-center">
          {column.header}
          {column.sortable !== false &&
            isSorted &&
            (isAsc ? (
              <ChevronUp className="ml-1 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-1 h-4 w-4" />
            ))}
        </div>
      </TableHead>
    );
  };

  // Filter component for a column
  const ColumnFilter = ({ column }) => {
    const filterOptions = column.filterOptions || [];
    const currentValue = filters[column.accessor] || "all";

    return (
      <Select
        value={currentValue}
        onValueChange={(value) =>
          setFilters((prev) => ({ ...prev, [column.accessor]: value }))
        }
      >
        <SelectTrigger className="w-full">
          <div className="flex items-center">
            <Filter className="h-3 w-3 mr-1" />
            <SelectValue
              placeholder={`Filter ${column.header.toLowerCase()}`}
            />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All {column.header}</SelectItem>
          {filterOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {searchableColumns.length > 0 && (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        {filterableColumns.map((column) => (
          <div key={column.accessor} className="w-full sm:w-40">
            <ColumnFilter column={column} />
          </div>
        ))}
      </div>

      {/* Bulk Actions */}
      {selectedRows.length > 0 && bulkActions.length > 0 && (
        <div className="flex items-center justify-between p-3 bg-primary/10 rounded-md">
          <div className="text-sm font-medium">
            {selectedRows.length} item{selectedRows.length !== 1 ? "s" : ""}{" "}
            selected
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Bulk Actions
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
              {bulkActions.map((action) => (
                <DropdownMenuItem
                  key={action.value}
                  onClick={() => handleBulkActionClick(action.value)}
                  className={action.destructive ? "text-red-600" : ""}
                >
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Table */}
      <div className="rounded-md ">
        <Table>
          <TableHeader>
            <TableRow>
              {bulkActions.length > 0 && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                    indeterminate={someSelected && !allSelected}
                  />
                </TableHead>
              )}

              {columns.map((column) => (
                <SortableHeader key={column.accessor} column={column} />
              ))}

              {(onRowClick || bulkActions.length > 0) && (
                <TableHead className="text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length +
                    (bulkActions.length > 0 ? 1 : 0) +
                    (onRowClick ? 1 : 0)
                  }
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : sortedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length +
                    (bulkActions.length > 0 ? 1 : 0) +
                    (onRowClick ? 1 : 0)
                  }
                  className="h-24 text-center"
                >
                  {emptyState || "No results found."}
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((item) => (
                <TableRow
                  key={item.id}
                  className={
                    onRowClick
                      ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 border-0"
                      : ""
                  }
                  onClick={() => onRowClick && onRowClick(item)}
                >
                  {bulkActions.length > 0 && (
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedRows.includes(item.id)}
                        onCheckedChange={() => toggleRowSelection(item.id)}
                        aria-label={`Select row`}
                      />
                    </TableCell>
                  )}

                  {columns.map((column) => (
                    <TableCell
                      key={column.accessor}
                      className={column.cellClassName || ""}
                    >
                      {column.cell
                        ? column.cell(item)
                        : getNestedValue(item, column.accessor)}
                    </TableCell>
                  ))}

                  {(onRowClick || bulkActions.length > 0) && (
                    <TableCell
                      className="text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          {onRowClick && (
                            <DropdownMenuItem onClick={() => onRowClick(item)}>
                              View Details
                            </DropdownMenuItem>
                          )}
                          {bulkActions.length > 0 && (
                            <>
                              <DropdownMenuSeparator />
                              {bulkActions.map((action) => (
                                <DropdownMenuItem
                                  key={action.value}
                                  onClick={() =>
                                    handleBulkActionClick(action.value, [
                                      item.id,
                                    ])
                                  }
                                  className={
                                    action.destructive ? "text-red-600" : ""
                                  }
                                >
                                  {action.label}
                                </DropdownMenuItem>
                              ))}
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DataTable;
