import {
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	getFilteredRowModel,
	useReactTable,
} from "@tanstack/react-table"
import { useState } from "react"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

const TableWrapper = ({
	columns,
	data,
	searchKey,
	filterSlot,
	isFetching,
	isError,
	error,
}) => {
	const [sorting, setSorting] = useState([])
	const [columnFilters, setColumnFilters] = useState([])
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onPaginationChange: setPagination,
		state: { sorting, columnFilters, pagination },
	})

	const { pageIndex, pageSize } = table.getState().pagination
	const totalRows = table.getFilteredRowModel().rows.length
	const from = pageIndex * pageSize + 1
	const to = Math.min(from + pageSize - 1, totalRows)

	const apiError = error?.data?.errors?.[0]
	const status = error?.status;

	const errorMessages = {
		400: "Invalid request.",
		401: "Unauthorized.",
		403: "You don't have permission to view this data.",
		404: "No records found.",
		500: "Something went wrong. Please try again later.",
	}

	const errorMessage =
		apiError?.detail || errorMessages[status] || "Failed to load data."

	return (
		<div className="flex flex-col gap-0 rounded-xl border overflow-hidden">
			{/* Toolbar */}
			<div className="flex items-center justify-between px-4 py-3 border-b bg-card">
				{/* filterSlot */}
				{filterSlot && <div>{filterSlot}</div>}

				{/* Search */}
				{searchKey && (
					<div className="relative ml-auto">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder={`Search ${searchKey}...`}
							value={table.getColumn(searchKey)?.getFilterValue() ?? ""}
							onChange={(e) =>
								table.getColumn(searchKey)?.setFilterValue(e.target.value)
							}
							className="pl-9 w-64"
						/>
					</div>
				)}
			</div>

			{/* Table */}
			<Table>
				<TableHeader className="bg-muted/30">
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id} className="border-b">
							{headerGroup.headers.map((header) => (
								<TableHead
									key={header.id}
									className="text-muted-foreground font-medium text-sm px-4 py-2"
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

				<TableBody className="bg-card">
					{isError ? (
						<TableRow>
							<TableCell
								colSpan={columns.length}
								className="text-center text-destructive py-10"
							>
								{errorMessage}
							</TableCell>
						</TableRow>
					) : isFetching ? (
            // Skeleton rows while fetching
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
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								colSpan={columns.length}
								className="text-center text-muted-foreground py-10"
							>
								No results found.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			{/* Pagination */}
			<div className="flex items-center justify-between px-4 py-3 border-t text-sm text-muted-foreground bg-card">
				<div className="flex items-center gap-2">
					<span>Show</span>
					<Select
						value={String(pageSize)}
						onValueChange={(val) => table.setPageSize(Number(val))}
					>
						<SelectTrigger className="w-16 h-8">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
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
						of <span className="font-medium text-foreground">{totalRows}</span>
					</span>
				</div>

				<div className="flex items-center gap-1">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
						className="gap-1"
					>
						<ChevronLeft className="h-4 w-4" /> Previous
					</Button>

					{Array.from({ length: table.getPageCount() }, (_, i) => (
						<Button
							key={i}
							variant={pageIndex === i ? "outline" : "ghost"}
							size="sm"
							className="w-8 h-8 p-0"
							onClick={() => table.setPageIndex(i)}
						>
							{i + 1}
						</Button>
					))}

					<Button
						variant="ghost"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
						className="gap-1"
					>
						Next <ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	)
}

export default TableWrapper
