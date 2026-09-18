import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArchiveRestore,
  ArchiveX,
  MoreHorizontal,
  UserPlus,
  Pencil,
} from "lucide-react";
import { useMemo } from "react";
import StatusToggle from "../../../components/StatusToggle";
import MasterlistTableWrapper from "../../../components/tables/MasterlistTableWrapper";

const UserAccountsTable = ({
  data,
  isFetching,
  isError,
  error,
  status,
  handleStatusChange,
  onArchive,
  onRestore,
  onEdit,
  onCreate,
  // showArchived,
  // onToggleArchived,
  page,
  onPageChange,
  pageSize,
  onPageSizeChange,
  search,
  onSearchChange,
}) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "employee_id",
        header: "Employee ID",
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
          const { first_name, middle_name, last_name, suffix } = row.original;

          return [first_name, middle_name, last_name, suffix]
            .filter(Boolean)
            .join(" ");
        },
      },
      {
        accessorKey: "username",
        header: "Username",
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
          const role = row.getValue("role");

          return (
            <Badge
              variant="outline"
              className={
                role
                  ? "capitalize"
                  : "text-muted-foreground border-dashed"
              }
            >
              {role || "Not Assigned Yet"}
            </Badge>
          );
        },
      },
      {
        accessorKey: "deleted_at",
        header: "Status",
        cell: () => {
          const showArchived = status === "archived";
          const showPending = status === "pending";
          return (
            <Badge
              className={
                showArchived
                  ? "bg-secondary text-secondary-foreground border"
                  : showPending
                    ? "bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
                    : "bg-active-status-bg text-success-foreground border border-success/40"
              }
            >
              {showArchived ? "Archived" : showPending ? "Pending" : "Active"}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <DropdownMenu>
            {/* button */}
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            {/* content */}
            <DropdownMenuContent align="end" className="w-40 rounded-xl">
              {status === "pending" ? (
                <DropdownMenuItem
                  className="text-green-600 focus:text-green-700"
                  onSelect={() => {
                    onCreate(row.original);
                  }}
                >
                  <UserPlus className="h-4 w-4" /> Create
                </DropdownMenuItem>
              ) : status === "archived" ? (
                <DropdownMenuItem
                  className="text-green-600 focus:text-green-700"
                  onSelect={() => {
                    onRestore(row.original);
                  }}
                >
                  <ArchiveRestore className="h-4 w-4" /> Restore
                </DropdownMenuItem>
              ) : (
                <>
                  <DropdownMenuItem onSelect={() => onEdit(row.original)}>
                    <Pencil className="h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onSelect={() => {
                      onArchive(row.original);
                    }}
                  >
                    <ArchiveX className="h-4 w-4" /> Archive
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [onCreate, onEdit, onArchive, onRestore, status],
  );

  return (
    <MasterlistTableWrapper
      columns={columns}
      data={data?.data || []}
      paginationData={data}
      isFetching={isFetching}
      isError={isError}
      error={error}
      searchKey="username"
      searchValue={search}
      onSearchChange={onSearchChange}
      page={page}
      onPageChange={onPageChange}
      pageSize={pageSize}
      onPageSizeChange={onPageSizeChange}
      filterSlot={
        <StatusToggle
          // checked={showArchived}
          // onCheckedChange={onToggleArchived}
          value={status}
          onChange={handleStatusChange}
          options={["active", "pending", "archived"]}
        />
      }
    />
  );
};

export default UserAccountsTable;
