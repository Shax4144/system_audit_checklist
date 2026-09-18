import { useState } from "react"
import { XCircle, Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogMedia,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"

const CONFIRM_TEXT = "CONFIRM"

const CloseConfirm = ({
  open,
  onClose,
  onConfirm,
  isLoading,
}) => {
  const [confirmation, setConfirmation] = useState("")

  const isConfirmed =
    confirmation.trim().toUpperCase() === CONFIRM_TEXT

  const handleClose = () => {
    setConfirmation("")
    onClose()
  }

  const handleConfirm = async (e) => {
    e.preventDefault()

    if (!isConfirmed || isLoading) return

    await onConfirm()
    setConfirmation("")
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleClose()
        }
      }}
    >
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <XCircle />
          </AlertDialogMedia>

          <AlertDialogTitle>
            Close this checklist?
          </AlertDialogTitle>

          <AlertDialogDescription>
            Closing this checklist will prevent further answers or changes to its responses. To continue, type{" "}
            <span className="font-semibold text-foreground">
              {CONFIRM_TEXT}
            </span>{" "}
            below.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-2">
          <Input
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            placeholder={`Type ${CONFIRM_TEXT}`}
            autoComplete="off"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && isConfirmed) {
                handleConfirm(e)
              }
            }}
          />

          {confirmation && !isConfirmed && (
            <p className="text-xs text-destructive">
              Please type <span className="font-semibold">{CONFIRM_TEXT}</span>{" "}
              exactly to continue.
            </p>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel
            className="rounded-[0.35rem]"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            className="rounded-[0.35rem]"
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isConfirmed || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Closing...
              </>
            ) : (
              "Close Checklist"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default CloseConfirm
