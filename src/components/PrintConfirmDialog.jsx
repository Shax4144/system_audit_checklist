// components/reports/PrintConfirmDialog.jsx
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog"

const PrintConfirmDialog = ({ open, onClose, onConfirm }) => {
  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose() }}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Did the document print successfully?</AlertDialogTitle>
          <AlertDialogDescription>
            This confirms whether the audit report was printed, so we can track the copy count.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={() => onConfirm(false)}>
            No
          </Button>
          <Button onClick={() => onConfirm(true)}>
            Yes
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default PrintConfirmDialog