import React, { useState} from "react"
import SupplierTable from "./SupplierTable"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import AddSupplierDialog from "../../../components/AddSupplierDialog"
import DeleteConfirm from "../../../components/DeleteConfirm"
import Confirm from "../../../components/Confirm"
import { 
	useFetchSuppliersQuery,
	usePostSupplierMutation,
	useUpdateSupplierMutation,
	useArchiveSupplierMutation,
} from "../../../features/supplier/supplier.api"
import { appToast } from "../../../components/Toast"
import { useSelectedRow } from "../../../context/EditContext"

const Supplier = () => {
	const [showArchived, setShowArchived] = useState(false)
	const { data: supplierData,
		isFetching,
		isError,
		error,
	} = useFetchSuppliersQuery({
		status: showArchived ? 0 : 1,
	},{
		refetchOnMountOrArgChange: true,
	},
	)

	const [postSupplier, { isLoading: isCreating }] = usePostSupplierMutation()
	const [updateSupplier, { isLoading: isUpdating}] = useUpdateSupplierMutation()
	const [archiveSupplier, { isLoading: isArchiving }] = useArchiveSupplierMutation()

	const [openCreate, setOpenCreate] = useState(false)
	const [openArchive, setOpenArchive] = useState(false)
	const [openRestore, setOpenRestore] = useState(false)
	const { selectedRow, setSelectedRow, clearSelectedRow } = useSelectedRow()
	
	const handleOpenCreate = () => {
		clearSelectedRow()
		setOpenCreate(true)
	}

	const handleOpenEdit = (supplier) => {
		setOpenCreate(true)
		setSelectedRow(supplier)
	}

	const handleOpenArchive = (supplier) => {
		setSelectedRow(supplier)
		setTimeout(() => {
			setOpenArchive(true)
		}, 100)
	}

	const handleOpenRestore = (supplier) => {
		setSelectedRow(supplier)
		// setTimeout(() => {
		// 	setOpenRestore(true)
		// }, 100)
		setOpenRestore(true)
	}

	const handleCreateOrUpdate = async (supplierData) => {
		try {
			if (selectedRow) {
				const response = await updateSupplier({ id: selectedRow.id, ...supplierData }).unwrap()
				appToast.success(
					"Supplier updated",
					response?.message ?? "Supplier updated successfully"
				)
				setOpenCreate(false)
				clearSelectedRow()
			} else {
				const response = await postSupplier(supplierData).unwrap()
				appToast.success(
					"Supplier created",
					response?.message ?? "Supplier created successfully"
				)
			}
			setOpenCreate(false)
			clearSelectedRow()
		} catch (error) {
			appToast.error(
				"Error",
				error?.data?.message ?? "An error occurred while processing the supplier."
			)
			console.error("Error creating/updating supplier:", error)
		}
	}

	const handleConfirmArchive = async () => {
		if (!selectedRow) return

		try {
			if (selectedRow) {
				const response = await archiveSupplier(selectedRow.id).unwrap()
				appToast.success(
					"Supplier archived",
					response?.message ?? "Supplier archived successfully"
				)
			}
			setOpenArchive(false)
			clearSelectedRow()
		} catch (error) {
			appToast.error(
				"Error",
				error?.data?.message ?? "An error occurred while archiving the supplier."
			)
			console.error("Error archiving supplier:", error)
		}
	}

	const handleConfirmRestore = async () => {
		if (!selectedRow) return

		try {
			if (selectedRow) {
				const response = await archiveSupplier(selectedRow.id).unwrap()
				appToast.success(
					"Supplier restored",
					response?.message ?? "Supplier restored successfully",
				)
			}
			setOpenRestore(false)
			clearSelectedRow()
		} catch (error) {
			appToast.error(
				"Error",
				error?.data?.message ??
					"An error occurred while restoring the supplier.",
			)
			console.error("Error restoring supplier:", error)
		}
	}

	return (
		<div className="flex flex-col gap-6 h-full xl:mr-50 xl:ml-50">
			<div className="flex flex-row justify-between items-center">
				<div className="">
					<h1 className="text-2xl font-semibold">Supplier</h1>
					<p className="text-sm text-muted-foreground">
						Manage system suppliers and their addresses.
					</p>
				</div>
				<div>
					<Button className="w-32" onClick={handleOpenCreate}>
						<Plus />
						Create
					</Button>
				</div>
			</div>
			<div>
				<SupplierTable
					data={supplierData}
					isFetching={isFetching}
					isError={isError}
					error={error}
					onEdit={handleOpenEdit}
					onArchive={handleOpenArchive}
					onRestore={handleOpenRestore}
					showArchived={showArchived}
					onToggleArchived={setShowArchived}
				/>
			</div>
			<AddSupplierDialog
				open={openCreate}
				onClose={() => {
					setOpenCreate(false)
					clearSelectedRow()
				}}
				onConfirm={handleCreateOrUpdate}
				isLoading={isCreating || isUpdating}
			/>
			<DeleteConfirm
				open={openArchive}
				onClose={() => {
					setOpenArchive(false)
					clearSelectedRow()
				}}
				onConfirm={handleConfirmArchive}
				isLoading={isArchiving}
			/>
			<Confirm
				open={openRestore}
				onClose={() => {
					setOpenRestore(false)
					clearSelectedRow()
				}}
				onConfirm={handleConfirmRestore}
				isLoading={isArchiving}
			/>
		</div>
	)
}

export default Supplier
