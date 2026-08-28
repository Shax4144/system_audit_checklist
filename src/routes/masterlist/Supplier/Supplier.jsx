import { Button } from "@/components/ui/button";
import { Import, Loader2, Plus, Download } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AddSupplierDialog from "../Supplier/modals/AddSupplierDialog";
import Confirm from "../../../components/Confirm";
import DeleteConfirm from "../../../components/DeleteConfirm";
import { appToast } from "../../../components/Toast";
import { useSelectedRow } from "../../../context/EditContext";
import { useImportSupplierMutation } from "../../../features/supplier/supplier-import.api";
import {
  useArchiveSupplierMutation,
  useFetchSuppliersQuery,
  usePostSupplierMutation,
  useUpdateSupplierMutation,
} from "../../../features/supplier/supplier.api";
import SupplierTable from "./SupplierTable";

const Supplier = () => {
  const [showArchived, setShowArchived] = useState(false);
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
    data: supplierData,
    isFetching,
    isError,
    error,
  } = useFetchSuppliersQuery(
    {
      status: showArchived ? 0 : 1,
      page,
      per_page: pageSize,
      search: debouncedSearch || undefined,
    },
    { refetchOnMountOrArgChange: true },
  );

  const [postSupplier, { isLoading: isCreating }] = usePostSupplierMutation();
  const [updateSupplier, { isLoading: isUpdating }] =
    useUpdateSupplierMutation();
  const [archiveSupplier, { isLoading: isArchiving }] =
    useArchiveSupplierMutation();
  const [importSuppliers, { isLoading: isImporting }] =
    useImportSupplierMutation();

  const [openCreate, setOpenCreate] = useState(false);
  const [openArchive, setOpenArchive] = useState(false);
  const [openRestore, setOpenRestore] = useState(false);
  const fileInputRef = useRef(null);
  const { selectedRow, setSelectedRow, clearSelectedRow } = useSelectedRow();

  const handleOpenCreate = () => {
    clearSelectedRow();
    setOpenCreate(true);
  };

  const handleOpenEdit = (supplier) => {
    setOpenCreate(true);
    setSelectedRow(supplier);
  };

  const handleOpenArchive = (supplier) => {
    setSelectedRow(supplier);
    setTimeout(() => {
      setOpenArchive(true);
    }, 100);
  };

  const handleOpenRestore = (supplier) => {
    setSelectedRow(supplier);
    setOpenRestore(true);
  };

  const handleOpenImport = () => {
    fileInputRef.current?.click();
  };

  const handleCreateOrUpdate = async (supplierFormData) => {
    try {
      if (selectedRow) {
        const response = await updateSupplier({
          id: selectedRow.id,
          ...supplierFormData,
        }).unwrap();
        appToast.success(
          "Supplier updated",
          response?.message ?? "Supplier updated successfully",
        );
      } else {
        const response = await postSupplier(supplierFormData).unwrap();
        appToast.success(
          "Supplier created",
          response?.message ?? "Supplier created successfully",
        );
      }
      setOpenCreate(false);
      clearSelectedRow();
    } catch (error) {
      appToast.error(
        "Error",
        error?.data?.message ??
          "An error occurred while processing the supplier.",
      );
      console.error("Error creating/updating supplier: ", error);
    }
  };

  const handleConfirmArchive = async () => {
    if (!selectedRow) return;

    try {
      if (selectedRow) {
        const response = await archiveSupplier(selectedRow.id).unwrap();
        appToast.success(
          "Supplier archived",
          response?.message ?? "Supplier archived successfully",
        );
      }
      setOpenArchive(false);
      clearSelectedRow();
    } catch (error) {
      appToast.error(
        "Error",
        error?.data?.message ??
          "An error occurred while archiving the supplier.",
      );
      console.error("Error archiving supplier: ", error);
    }
  };

  const handleConfirmRestore = async () => {
    if (!selectedRow) return;

    try {
      if (selectedRow) {
        const response = await archiveSupplier(selectedRow.id).unwrap();
        appToast.success(
          "Supplier restored",
          response?.message ?? "Supplier restored successfully",
        );
      }
      setOpenRestore(false);
      clearSelectedRow();
    } catch (error) {
      appToast.error(
        "Error",
        error?.data?.message ??
          "An error occurred while restoring the supplier.",
      );
      console.error("Error restoring supplier:", error);
    }
  };

  const handleImportSuppliers = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await importSuppliers(formData).unwrap();
      appToast.success(
        "Import successful",
        response?.message ?? "Suppliers imported successfully.",
      );
    } catch (error) {
      appToast.error(
        "Import failed",
        error?.data?.message ?? "Something went wrong importing suppliers.",
      );
    }
  };

  const handleDownloadTemplate = () => {
    const TEMPLATE_URL = "/templates/accredited-supplier-list-template.xlsx";
    const link = document.createElement("a");
    link.href = TEMPLATE_URL;
    link.download = "supplier_template.xlsx";
    link.click();
    link.remove();
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex flex-row justify-between items-center">
        <div className="">
          <h1 className="text-2xl font-semibold">Supplier</h1>
          <p className="text-sm text-muted-foreground">
            Manage system suppliers and their details.
          </p>
        </div>
        <div className="flex flex-row gap-2">
          <Button
            className="h-10 font-semibold"
            onClick={handleDownloadTemplate}
            variant="outline"
          >
            <Download className="lg:mr-2 h-4 w-4" />
            <span className="hidden lg:inline">Download Template</span>
          </Button>
          <Button
            className="sm:w-32 h-10 font-semibold"
            onClick={handleOpenImport}
            disabled={isImporting}
          >
            {isImporting ? (
              <Loader2 className="sm:mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Import />
            )}
            <span className="hidden sm:inline">
              {isImporting ? "Importing..." : "Import"}
            </span>
          </Button>
          <Button
            className="sm:w-32 h-10 font-semibold"
            onClick={handleOpenCreate}
          >
            <Plus />
            <span className="hidden sm:inline">Create</span>
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
          search={search}
          onSearchChange={setSearch}
        />
      </div>
      <AddSupplierDialog
        open={openCreate}
        onClose={() => {
          setOpenCreate(false);
          clearSelectedRow();
        }}
        onConfirm={handleCreateOrUpdate}
        isLoading={isCreating || isUpdating}
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
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];

          if (!file) return;

          if (file) {
            handleImportSuppliers(file);
          }
        }}
      />
    </div>
  );
};

export default Supplier;
