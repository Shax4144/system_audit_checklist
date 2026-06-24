import React from 'react'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const Confirm = () => {
  return (
		<AlertDialog>
			<AlertDialogContent size="sm">
				<AlertDialogHeader>
					<AlertDialogTitle>Confirm your action</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to proceed?
					</AlertDialogDescription>
        </AlertDialogHeader>
        
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction>Confirm</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

export default Confirm