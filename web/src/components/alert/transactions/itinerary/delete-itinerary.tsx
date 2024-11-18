import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogTrigger, AlertDialogTitle, AlertDialogHeader, AlertDialogFooter, AlertDialogDescription, AlertDialogContent, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteTourItinerary, deleteTransportItinerary } from "@/api/mutations/itinerary.mutation";

interface Props {
	type: 'tour' | 'transport'
	id: string;
}

export default function DeleteItinerary(props: Props) {
	const { id, type } = props;
	const [open, setOpen] = useState(false);
	const queryClient = useQueryClient();

	const { mutate: tourMutate, isPending: tourPending } = useMutation({
		mutationFn: async (id: string) => await deleteTourItinerary(id),
		onSuccess() {
			toast.success("Tour itinerary deleted successfully", {
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
	const { mutate: transportMutate, isPending: transportPending } = useMutation({
		mutationFn: async (id: string) => await deleteTransportItinerary(id),
		onSuccess() {
			toast.success("Transport itinerary deleted successfully", {
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
		if (type === 'tour') {
			tourMutate(id)
		}
		if (type === 'transport') {
			transportMutate(id)
		}
	}

	return (
		<AlertDialog open={open} onOpenChange={(value) => setOpen(value)
		}>
			<AlertDialogTrigger>
				<Button size="icon" variant="ghost" >
					<Trash2 size={16} className="cursor-pointer hover:text-destructive" />
				</Button>
			</AlertDialogTrigger>
			< AlertDialogContent >
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure ? </AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone.This will permanently delete this itinerary from our servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				< AlertDialogFooter >
					<AlertDialogCancel
						disabled={tourPending || transportPending}
					>
						Cancel
					</AlertDialogCancel>
					< Button
						className="bg-destructive gap-2"
						onClick={handleDelete}
						disabled={tourPending || transportPending}
					>
						{transportPending || tourPending &&
							<Loader2 size={18} className="animate-spin" />
						}
						Delete
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

