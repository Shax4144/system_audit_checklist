import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import AddRoleDialog from "../../../components/AddRoleDialog"
import Confirm from "../../../components/Confirm"
import DeleteConfirm from "../../../components/DeleteConfirm"
import { appToast } from "../../../components/Toast"
import { useSelectedRow } from "../../../context/EditContext"
import {
	useArchiveRoleMutation,
	useFetchRolesQuery,
	usePostRoleMutation,
	useUpdateRoleMutation,
} from "../../../features/roles/roles.api"
import RolesTable from "./RolesTable"

const Roles = () => {
	const [showArchived, setShowArchived] = useState(false)
	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)
	const [search, setSearch] = useState("")
	const [debouncedSearch, setDebouncedSearch] = useState("")

	useEffect(() => {
		const timeout = setTimeout(() => {
			setDebouncedSearch(search)
			setPage(1)
		}, 500)
		return () => clearTimeout(timeout)
	}, [search])

	const {
		data: rolesData,
		isFetching,
		isError,
		error,
	} = useFetchRolesQuery(
		{
			status: showArchived ? 0 : 1,
			page,
			per_page: pageSize,
			search: debouncedSearch || undefined,
		},
		{ refetchOnMountOrArgChange: true },
	)

	const [createRole, { isLoading: isCreating }] = usePostRoleMutation()
	const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation()
	const [archiveRole, { isLoading: isArchiving }] = useArchiveRoleMutation()
	const [openAddRoleDialog, setOpenAddRoleDialog] = useState(false)
	const [openArchiveDialog, setOpenArchiveDialog] = useState(false)
	const [openRestoreDialog, setOpenRestoreDialog] = useState(false)
	const { selectedRow, setSelectedRow, clearSelectedRow } = useSelectedRow()

	const handleOpenRoleDialog = () => {
		clearSelectedRow()
		setOpenAddRoleDialog(true)
	}

	const handleOpenEdit = (role) => {
		setSelectedRow(role)
		setOpenAddRoleDialog(true)
	}

	const handleOpenArchive = (role) => {
		setSelectedRow(role)
		setOpenArchiveDialog(true)
	}

	const handleOpenRestore = (role) => {
		setSelectedRow(role)
		setOpenRestoreDialog(true)
	}

	const handleCreateOrUpdate = async (roleData) => {
		try {
			if (selectedRow) {
				const response = await updateRole({
					id: selectedRow.id,
					...roleData,
				}).unwrap()
				appToast.success(
					"Role updated",
					response?.message ?? "The role has been updated successfully.",
				)
			} else {
				const response = await createRole(roleData).unwrap()
				appToast.success(
					"Role created",
					response?.message ?? "The role has been created successfully.",
				)
			}
			setOpenAddRoleDialog(false)
			clearSelectedRow()
		} catch (error) {
			appToast.error(
				"Error",
				error?.data?.message ?? "An error occurred while processing the role.",
			)
			console.error("Failed to create/update role:", error)
		}
	}

	const handleConfirmArchive = async () => {
		try {
			await archiveRole(selectedRow.id).unwrap()
			appToast.success(
				"Role archived",
				"The role has been archived successfully.",
			)
			setOpenArchiveDialog(false)
			clearSelectedRow()
		} catch (error) {
			appToast.error(
				"Error",
				error?.data?.message ?? "An error occurred while archiving the role.",
			)
			console.error("Failed to archive role:", error)
		}
	}

	const handleConfirmRestore = async () => {
		try {
			await archiveRole(selectedRow.id).unwrap()
			appToast.success(
				"Role restored",
				"The role has been restored successfully.",
			)
			setOpenRestoreDialog(false)
			clearSelectedRow()
		} catch (error) {
			appToast.error(
				"Error",
				error?.data?.message ?? "An error occurred while archiving the role.",
			)
			console.error("Failed to restore role:", error)
		}
	}

	return (
		<div className="flex flex-col gap-6 h-full xl:mr-50 xl:ml-50">
			<div className="flex flex-row justify-between items-center">
				<div className="">
					<h1 className="text-2xl font-semibold">Roles</h1>
					<p className="text-sm text-muted-foreground">
						Manage system user roles.
					</p>
				</div>
				<div>
					<Button
						className="w-32 h-10 font-semibold"
						onClick={handleOpenRoleDialog}
					>
						<Plus />
						Create
					</Button>
				</div>
			</div>
			<div>
				<RolesTable
					data={rolesData}
					isFetching={isFetching}
					isError={isError}
					error={error}
					onEdit={handleOpenEdit}
					onArchive={handleOpenArchive}
					onRestore={handleOpenRestore}
					showArchived={showArchived}
					onToggleArchived={setShowArchived}
					page={page}
					onPageChange={setPage}
					pageSize={pageSize}
					onPageSizeChange={setPageSize}
					search={search}
					onSearchChange={setSearch}
				/>
			</div>
			<AddRoleDialog
				open={openAddRoleDialog}
				onClose={() => {
					setOpenAddRoleDialog(false)
				}}
				onConfirm={handleCreateOrUpdate}
				isLoading={isCreating || isUpdating}
			/>
			<DeleteConfirm
				open={openArchiveDialog}
				onClose={() => {
					setOpenArchiveDialog(false)
					clearSelectedRow()
				}}
				onConfirm={handleConfirmArchive}
				isLoading={isArchiving}
			/>
			<Confirm
				open={openRestoreDialog}
				onClose={() => {
					setOpenRestoreDialog(false)
					clearSelectedRow()
				}}
				onConfirm={handleConfirmRestore}
				isLoading={isArchiving}
			/>
		</div>
	)
}

export default Roles
