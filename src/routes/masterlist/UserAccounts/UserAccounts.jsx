import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import AddUserDialog from "../UserAccounts/modals/AddUserDialog";
import Confirm from "../../../components/Confirm";
import DeleteConfirm from "../../../components/DeleteConfirm";
import { appToast } from "../../../components/Toast";
import { useSelectedRow } from "../../../context/EditContext";
import {
  useArchiveUserAccountMutation,
  useFetchUserAccountsQuery,
  usePostUserAccountMutation,
  useUpdateUserAccountMutation,
} from "../../../features/user-accounts/users.api";
import { useFetchPendingRequestsQuery } from "../../../features/user-accounts/pending-requests.api";
import UserAccountsTable from "./UserAccountsTable";

const UserAccounts = () => {
  // const [showArchived, setShowArchived] = useState(false)
  const [status, setStatus] = useState("active");
  const isPending = status === "pending";
  const isArchived = status === "archived";
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timeout);
  }, [search]);

  const {
    data: userAccountsData,
    isFetching: isFetchingUsers,
    isError: isUsersError,
    error: usersError,
  } = useFetchUserAccountsQuery(
    {
      status: isArchived ? 0 : 1,
      page,
      per_page: pageSize,
      search: debouncedSearch || undefined,
    },
    { refetchOnMountOrArgChange: true },
  );

  const {
    data: pendingRequestsData,
    isFetching: isFetchingPending,
    isError: isPendingError,
    error: pendingError,
  } = useFetchPendingRequestsQuery(
    {
      page,
      per_page: pageSize,
      search: debouncedSearch || undefined,
    },
    { skip: !isPending, refetchOnMountOrArgChange: true },
  );

  const tableData = isPending ? pendingRequestsData?.data : userAccountsData;

  const tableIsFetching = isPending ? isFetchingPending : isFetchingUsers;

  const tableIsError = isPending ? isPendingError : isUsersError;

  const tableError = isPending ? pendingError : usersError;

  const [createUserAccount, { isLoading: isCreating }] =
    usePostUserAccountMutation();
  const [updateUserAccount, { isLoading: isUpdating }] =
    useUpdateUserAccountMutation();
  const [archiveUserAccount, { isLoading: isArchiving }] =
    useArchiveUserAccountMutation();

  const [openCreate, setOpenCreate] = useState(false);
  const [openArchive, setOpenArchive] = useState(false);
  const [openRestore, setOpenRestore] = useState(false);
  const { selectedRow, setSelectedRow, clearSelectedRow } = useSelectedRow();
  const [mode, setMode] = useState("create");

  const handleStatusChange = (status) => {
    setStatus(status);
    setPage(1);
  };

  const handleOpenCreate = () => {
    clearSelectedRow();
    setMode("create");
    setOpenCreate(true);
  };

  const handleOpenCreatePending = (user) => {
    setOpenCreate(true);
    setMode("pending");
    setSelectedRow(user);
  };

  const handleOpenEdit = (user) => {
    setOpenCreate(true);
    setMode("edit");
    setSelectedRow(user);
  };

  const handleOpenArchive = (user) => {
    setSelectedRow(user);
    setTimeout(() => {
      setOpenArchive(true);
    }, 100);
  };

  const handleOpenRestore = (user) => {
    setSelectedRow(user);
    // setTimeout(() => {
    // 	setOpenRestore(true)
    // }, 100)
    setOpenRestore(true);
  };

  const handleCreateOrUpdate = async (userData) => {
    try {
      if (selectedRow && mode === "edit") {
        const response = await updateUserAccount({
          id: selectedRow.id,
          ...userData,
        }).unwrap();
        appToast.success(
          "User updated",
          response?.message ??
            "The user account has been updated successfully.",
        );
      } else {
        const response = await createUserAccount(userData).unwrap();
        appToast.success(
          "User created",
          response?.message ??
            "The user account has been created successfully.",
        );
      }
      setOpenCreate(false);
      clearSelectedRow();
      setMode("create");
    } catch (error) {
      appToast.error(
        "Error",
        error?.data?.message ??
          "An error occurred while processing the user account.",
      );
      console.error("Failed to create/update user:", error);
    }
  };

  const handleConfirmArchive = async () => {
    if (!selectedRow) return;

    try {
      if (selectedRow) {
        const response = await archiveUserAccount(selectedRow.id).unwrap();
        appToast.success(
          "User archived",
          response?.message ??
            "The user account has been archived successfully.",
        );
      }
      setOpenArchive(false);
      clearSelectedRow();
    } catch (error) {
      appToast.error(
        "Error",
        error?.data?.message ??
          "An error occurred while archiving the user account.",
      );
      console.error("Failed to archive user:", error);
    }
  };

  const handleConfirmRestore = async () => {
    if (!selectedRow) return;

    try {
      if (selectedRow) {
        const response = await archiveUserAccount(selectedRow.id).unwrap();
        appToast.success(
          "User restored",
          response?.message ??
            "The user account has been restored successfully.",
        );
      }
      setOpenRestore(false);
      clearSelectedRow();
    } catch (error) {
      appToast.error(
        "Error",
        error?.data?.message ??
          "An error occurred while restoring the user account.",
      );
      console.error("Failed to restore user:", error);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex flex-row justify-between items-center">
        <div className="">
          <h1 className="text-2xl font-semibold">User Accounts</h1>
          <p className="text-sm text-muted-foreground">
            Manage system users and their roles.
          </p>
        </div>
        <div>
          <Button
            className="w-32 h-10 font-semibold"
            onClick={handleOpenCreate}
          >
            <Plus />
            Create
          </Button>
        </div>
      </div>
      <div>
        <UserAccountsTable
          data={tableData}
          isFetching={tableIsFetching}
          isError={tableIsError}
          error={tableError}
          status={status}
          handleStatusChange={handleStatusChange}
          onEdit={handleOpenEdit}
          onArchive={handleOpenArchive}
          onRestore={handleOpenRestore}
          onCreate={handleOpenCreatePending}
          // showArchived={showArchived}
          // onToggleArchived={setShowArchived}
          page={page}
          onPageChange={setPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          search={search}
          onSearchChange={setSearch}
        />
      </div>
      <AddUserDialog
        open={openCreate}
        onClose={() => {
          setOpenCreate(false);
          clearSelectedRow();
        }}
        onConfirm={handleCreateOrUpdate}
        isLoading={isCreating || isUpdating}
        mode={mode}
      />
      <DeleteConfirm
        open={openArchive}
        onClose={() => {
          setOpenArchive(false);
          clearSelectedRow();
        }}
        onConfirm={handleConfirmArchive}
        isLoading={isArchiving}
      />
      <Confirm
        open={openRestore}
        onClose={() => {
          setOpenRestore(false);
          clearSelectedRow();
        }}
        onConfirm={handleConfirmRestore}
        isLoading={isArchiving}
      />
    </div>
  );
};

export default UserAccounts;
