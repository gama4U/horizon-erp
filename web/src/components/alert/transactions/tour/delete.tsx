import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogTrigger, AlertDialogTitle, AlertDialogHeader, AlertDialogFooter, AlertDialogDescription, AlertDialogContent, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteTourVoucher } from "@/api/mutations/transaction.mutation";

interface Props {
	id: string;
}

export default function DeleteTour(props: Props) {
	const { id } = props;
	const [open, setOpen] = useState(false);
	const queryClient = useQueryClient();

	const { mutate, isPending } = useMutation({
		mutationFn: async (id: string) => await deleteTourVoucher(id),
		onSuccess() {
			toast.success("Tour voucher deleted successfully", {
				position: 'top-center',
				className: 'text-primary'
			});
			queryClient.refetchQueries({ queryKey: ['transactions'] });
			queryClient.refetchQueries({ queryKey: ['transaction'] });
			setOpen(false);
		},
		onError(error) {
			toast.error(error.message, {
				position: 'top-center',
				className: 'text-destructive'
			})
		}
	});

	const handleDelete = () => {
		mutate(id);
	}

	return (
		<AlertDialog open={open} onOpenChange={(value) => setOpen(value)}>
			<AlertDialogTrigger>
				<Button size="icon" variant="ghost">
					<Trash2 size={16} className="cursor-pointer hover:text-destructive" />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete this tour voucher from our servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel
						disabled={isPending}
					>
						Cancel
					</AlertDialogCancel>
					<Button
						className="bg-destructive gap-2"
						onClick={handleDelete}
						disabled={isPending}
					>
						{isPending &&
							<Loader2 size={18} className="animate-spin" />
						}
						Delete
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

