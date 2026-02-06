import { useState } from 'react';
import { useSortedRowIds, useTable } from 'tinybase/ui-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface DataTableProps {
  tableId: string;
  cellId: string;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  filteredRowIds?: string[];
}

export function DataTable({
  tableId,
  cellId,
  defaultPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50, 100],
  filteredRowIds
}: DataTableProps) {
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [currentPage, setCurrentPage] = useState(1);

  // Get data from Tinybase
  const table = useTable(tableId);
  const allRowIds = useSortedRowIds(tableId, cellId, false);

  // Use filtered row IDs if provided, otherwise use all rows
  const rowIdsToUse = filteredRowIds || allRowIds;
  const totalRows = rowIdsToUse.length;

  // Paginate the filtered/sorted row IDs
  const paginatedRowIds = rowIdsToUse.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Calculate pagination info
  const totalPages = Math.ceil(totalRows / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalRows);

  // Get column headers from the first row
  const firstRowId = Object.keys(table)[0];
  const columns = firstRowId ? Object.keys(table[firstRowId] || {}) : [];

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handlePageSizeChange = (newSize: string) => {
    const size = Number(newSize);
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              {columns.map((column) => (
                <th key={column} className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  {column.charAt(0).toUpperCase() + column.slice(1)}
                </th>
              ))}
            </tr>
          </thead>
           <tbody>
             {paginatedRowIds.map((rowId) => (
               <tr key={rowId} className="border-b">
                 {columns.map((column) => (
                   <td key={column} className="p-4 align-middle">
                     {table[rowId]?.[column] || ''}
                   </td>
                 ))}
               </tr>
             ))}
           </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <div className="text-sm text-muted-foreground">
            {totalRows > 0 ? `${startItem}-${endItem} of ${totalRows}` : 'No items'}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1 || totalPages === 0}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || totalPages === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center space-x-1">
              <span className="text-sm">Page {currentPage} of {totalPages || 1}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}