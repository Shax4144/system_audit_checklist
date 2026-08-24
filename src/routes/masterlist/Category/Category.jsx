import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import CategoryTable from "./CategoryTable"

import AddCategoryDialog from "../Category/modals/AddCategoryDialog"
import Confirm from "../../../components/Confirm"
import DeleteConfirm from "../../../components/DeleteConfirm"
import { appToast } from "../../../components/Toast"
import { useSelectedRow } from "../../../context/EditContext"
import {
	useArchiveCategoryMutation,
	useFetchCategoriesQuery,
	usePostCategoryMutation,
	useUpdateCategoryMutation,
} from "../../../features/category/category.api"

const Category = () => {
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
		data: categoryData,
		isFetching,
		isError,
		error,
	} = useFetchCategoriesQuery(
		{
			status: showArchived ? 0 : 1,
			page,
			per_page: pageSize,
			search: debouncedSearch || undefined,
		},
		{ refetchOnMountOrArgChange: true },
	)

	const [postCategory, { isLoading: isCreating }] = usePostCategoryMutation()
	const [updateCategory, { isLoading: isUpdating }] =
		useUpdateCategoryMutation()
	const [archiveCategory, { isLoading: isArchiving }] =
		useArchiveCategoryMutation()

	const [openCreate, setOpenCreate] = useState(false)
	const [openArchive, setOpenArchive] = useState(false)
	const [openRestore, setOpenRestore] = useState(false)
	const { selectedRow, setSelectedRow, clearSelectedRow } = useSelectedRow()

	const handleOpenCreate = () => {
		clearSelectedRow()
		setOpenCreate(true)
	}

	const handleOpenEdit = (category) => {
		setOpenCreate(true)
		setSelectedRow(category)
	}

	const handleOpenArchive = (category) => {
		setSelectedRow(category)
		setTimeout(() => {
			setOpenArchive(true)
		}, 100)
	}

	const handleOpenRestore = (supplier) => {
		setSelectedRow(supplier)
		setOpenRestore(true)
	}

	const handleCreateOrUpdate = async (categoryFormData) => {
		try {
			if (selectedRow) {
				const response = await updateCategory({
					id: selectedRow.id,
					...categoryFormData,
				}).unwrap()
				appToast.success(
					"Category updated",
					response?.message ?? "Category updated Successfully",
				)
			} else {
				const response = await postCategory(categoryFormData).unwrap()
				appToast.success(
					"Category updated",
					response?.message ?? "Category updated Successfully",
				)
			}
			setOpenCreate(false)
			clearSelectedRow()
		} catch (error) {
			appToast.error(
				"Error",
				error?.data?.message ??
					"An Error occured while processing the category.",
			)
			console.error("Error creating/updating supplier: ", error)
		}
	}

	const handleConfirmArchive = async () => {
		try {
			if (!selectedRow) {
				return
			} else {
				const response = await archiveCategory(selectedRow.id).unwrap()
				appToast.success(
					"Category archived",
					response?.message ?? "Supplier archived successfully",
				)
			}
			setOpenArchive(false)
			clearSelectedRow()
		} catch (error) {
			appToast.error(
				"Error",
				error?.data?.message ??
					"An error occured while archiving the category.",
			)
			console.error("Error archiving category: ", error)
		}
	}

	const handleConfirmRestore = async () => {
		try {
			if (!selectedRow) {
				return
			} else {
				const response = await archiveCategory(selectedRow.id).unwrap()
				appToast.success(
					"Category archived",
					response?.message ?? "Category archived successfully",
				)
			}
			setOpenRestore(false)
			clearSelectedRow()
		} catch (error) {
			appToast.error(
				"Error",
				error?.data?.message ??
					"An error occured while archiving the category.",
			)
			console.error("Error restoring category:", error)
		}
	}

	return (
		<div className="flex flex-col gap-6 h-full xl:mr-50 xl:ml-50">
			<div className="flex flex-row justify-between items-center">
				<div className="">
					<h1 className="text-2xl font-semibold">Category</h1>
					<p className="text-sm text-muted-foreground">
						Manage system categories.
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
				<CategoryTable
					data={categoryData}
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
			<AddCategoryDialog
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

export default Category
