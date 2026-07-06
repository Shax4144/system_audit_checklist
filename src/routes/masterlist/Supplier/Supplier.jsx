import React, { useState, useRef} from "react"
import SupplierTable from "./SupplierTable"
import { Button } from "@/components/ui/button"
import { Plus, Import, Loader2} from "lucide-react"
import AddSupplierDialog from "../../../components/AddSupplierDialog"
import DeleteConfirm from "../../../components/DeleteConfirm"
import Confirm from "../../../components/Confirm"
import { 
	useFetchSuppliersQuery,
	usePostSupplierMutation,
	useUpdateSupplierMutation,
	useArchiveSupplierMutation,
} from "../../../features/supplier/supplier.api"
import { useImportSupplierMutation } from "../../../features/supplier/supplier-import.api"
import { appToast } from "../../../components/Toast"
import { useSelectedRow } from "../../../context/EditContext"

const Supplier = () => {
	const [showArchived, setShowArchived] = useState(false)
	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(10);

	const { data: supplierData,
		isFetching,
		isError,
		error,
	} = useFetchSuppliersQuery({
		status: showArchived ? 0 : 1,
		page,
		per_page: pageSize,
	},{
		refetchOnMountOrArgChange: true,
	},
	)

	const [postSupplier, { isLoading: isCreating }] = usePostSupplierMutation()
	const [updateSupplier, { isLoading: isUpdating}] = useUpdateSupplierMutation()
	const [archiveSupplier, { isLoading: isArchiving }] = useArchiveSupplierMutation()
	const [importSuppliers, { isLoading: isImporting}] = useImportSupplierMutation()

	const [openCreate, setOpenCreate] = useState(false)
	const [openArchive, setOpenArchive] = useState(false)
	const [openRestore, setOpenRestore] = useState(false)
	const fileInputRef = useRef(null)
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
		setOpenRestore(true)
	}

	const handleOpenImport = () => {
		fileInputRef.current?.click();
	}

	const handleCreateOrUpdate = async (supplierFormData) => {
		try {
			if (selectedRow) {
				const response = await updateSupplier({ id: selectedRow.id, ...supplierFormData }).unwrap()
				appToast.success(
					"Supplier updated",
					response?.message ?? "Supplier updated successfully"
				)
			} else {
				const response = await postSupplier(supplierFormData).unwrap()
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
			console.error("Error creating/updating supplier: ", error)
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
			console.error("Error archiving supplier: ", error)
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

	const handleImportSuppliers = async (file) => {
		const formData = new FormData();
		formData.append("file", file)

		try {
			const response = await importSuppliers(formData).unwrap()
			appToast.success(
				"Import successful",
				response?.message ?? "Supplers imported successfully."
			);
		} catch (error) {
			appToast.error(
				"Import failed",
				error?.data?.message ?? "Unable to import suppliers."
			)
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
				<div className="flex flex-row gap-2">
					<Button
						className="w-32 h-10 font-semibold"
						onClick={handleOpenImport}
						disabled={isImporting}
					>
						{isImporting ? <Loader2/> : <Import/>}
						{isImporting ? "Importing..." : "Import"}
					</Button>
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
					page={page}
					onPageChange={setPage}
					pageSize={pageSize}
					onPageSizeChange={setPageSize}
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
			<input
				ref={fileInputRef}
				type="file"
				accept=".xlsx,.xls,.csv"
				className="hidden"
				onChange={(e) => {
					const file = e.target.files?.[0]

					if (!file) return

					if (file) {
						handleImportSuppliers(file)
					}
				}}
			/>
		</div>
	)
}

export default Supplier
