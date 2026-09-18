import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardTableWrapper = ({
  columns,
  data,
  paginationData,
  isFetching,
  isError,
  error,
  page,
  onPageChange,
  pageSize,
  onPageSizeChange,
  activeTab,
  onTabChange,
  tabs,
}) => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: { sorting, columnFilters },
  });

  const currentPage = paginationData?.currentPage || page || 1;
  const lastPage = paginationData?.last_page || 1;
  const from = paginationData?.from || 0;
  const to = paginationData?.to || 0;
  const totalRows = paginationData?.total || 0;

  const apiError = error?.data?.errors?.[0];
  const status = error?.status;

  const errorMessages = {
    400: "Invalid request.",
    401: "Unauthorized.",
    403: "You don't have permission to view this data.",
    404: "No records found.",
    500: "Something went wrong. Please try again later.",
  };

  const errorMessage =
    apiError?.detail || errorMessages[status] || "Failed to load data.";

  const getPageNumbers = (currentPage, lastPage) => {
    const delta = 1;
    const pages = [];

    for (let i = 1; i <= lastPage; i++) {
      const isFirst = i === 1;
      const isLast = i === lastPage;
      const isNearCurrent =
        i >= currentPage - delta && i <= currentPage + delta;

      if (isFirst || isLast || isNearCurrent) {
        pages.push(i);
      }
    }

    const result = [];

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const previousPage = pages[i - 1];

      if (previousPage && page - previousPage > 1) {
        result.push("ellipsis");
      }

      result.push(page);
    }

    return result;
  };

  const pageNumbers = getPageNumbers(currentPage, lastPage);

  return (
    <div className="max-h-[calc(100vh-250px)] flex min-h-0 flex-1 flex-col gap-0 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-0 py-3">
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <TabsList className="bg-transparent py-0 h-auto">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="
									rounded-b-xs
									px-8 py-6
									text-sm
									font-bold
									border
									data-[state=active]:bg-primary
									dark:data-[state=active]:bg-primary
									data-[state=active]:text-primary-foreground
									data-[state=active]:border-primary
									data-[state=inactive]:bg-transparent
									data-[state=inactive]:text-muted-foreground
									data-[state=inactive]:border-border
								"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Table */}
      <div className="flex min-h-0 flex-col gap-0 rounded-b-xl border shadow">
        <div className="custom-scrollbar max-h-[calc(100vh-300px)] overflow-auto">
          <Table className="min-w-max">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-b">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="sticky top-0 z-10 bg-muted px-4 py-2 text-sm font-medium text-muted-foreground"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {isError ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="py-10 text-center text-destructive"
                  >
                    {errorMessage}
                  </TableCell>
                </TableRow>
              ) : isFetching ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    {columns.map((col, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full max-w-40" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-b last:border-0 hover:bg-muted"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-4 py-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="py-10 text-center text-muted-foreground justify-center items-center"
                  >
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Show</span>

            <Select
              value={String(pageSize)}
              onValueChange={(val) => {
                onPageSizeChange(Number(val));
                onPageChange(1);
              }}
            >
              <SelectTrigger className="h-8 w-18">
                <SelectValue />
              </SelectTrigger>

              <SelectContent position="popper" className="w-18 min-w-0">
                {[10, 20, 50].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <span className="ml-2">
              <span className="font-medium text-foreground">
                {from}–{to}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">{totalRows}</span>
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={!paginationData?.prev_page_url}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            {pageNumbers.map((item, index) => {
              if (item === "ellipsis") {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-2 text-muted-foreground"
                  >
                    ...
                  </span>
                );
              }

              return (
                <Button
                  key={item}
                  variant={currentPage === item ? "outline" : "ghost"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => onPageChange(item)}
                >
                  {item}
                </Button>
              );
            })}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!paginationData?.next_page_url}
              className="gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTableWrapper;
