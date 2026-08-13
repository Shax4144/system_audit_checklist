import { useEffect, useRef } from "react"

export const usePrintDetection = (onPrintDialogClosed) => {
  const hasTriggeredRef = useRef(false)

  useEffect(() => {
    const handleAfterPrint = () => {
      if (hasTriggeredRef.current) {
        onPrintDialogClosed()
        hasTriggeredRef.current = false
      }
    }

    window.addEventListener("afterprint", handleAfterPrint)
    return () => window.removeEventListener("afterprint", handleAfterPrint)
  }, [onPrintDialogClosed])

  const triggerPrint = () => {
    hasTriggeredRef.current = true
    window.print()
  }

  return { triggerPrint }
}