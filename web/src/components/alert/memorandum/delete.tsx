import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from "../../ui/alert-dialog";
import { Button } from "../../ui/button";
import { deleteMemorandum } from "@/api/mutations/memorandum.mutation";

interface Props {
	memorandumId: string;
}

export default function DeleteMemorandum(props: Props) {
	const { memorandumId } = props;
	const [open, setOpen] = useState(false);
	const queryClient = useQueryClient();

	const { mutate, isPending } = useMutation({
		mutationFn: async (id: string) => await deleteMemorandum(id),
		onSuccess() {
			toast.success("Memorandum deleted successfully", {
				position: 'top-center',
				className: 'text-primary'
			});
			queryClient.refetchQueries({ queryKey: ['memorandums'] });
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
		mutate(memorandumId);
	}

	return (
		<AlertDialog open={open} onOpenChange={(value) => setOpen(value)}>
			<AlertDialogTrigger>
				<Trash2 size={16} className="cursor-pointer hover:text-destructive" />
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete this memorandum from our servers.
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

