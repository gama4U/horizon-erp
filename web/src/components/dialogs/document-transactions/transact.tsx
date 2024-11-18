import { Layers3, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import CommonInput from "@/components/common/input";
import { Button } from "@/components/ui/button";
import { IUpdateDocumentTransaction, updateDocumentTransaction } from "@/api/mutations/document-transaction.mutation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import CommonToast from "@/components/common/toast";
import { useState } from "react";
import { IDocumentTransaction } from "@/api/queries/document-transaction.query";

interface ITransactDocumentProps {
	type?: 'recievedBy' | 'recievedFrom' | "";
	existingData: IDocumentTransaction
	openDialog: boolean;
	id: string;
	setOpenDialog: (open: boolean) => void;
}

export default function TransactDocumentDialog({ id, type, openDialog, setOpenDialog, existingData }: ITransactDocumentProps) {
	const queryClient = useQueryClient()
	const [value, setValue] = useState("")

	const { mutate: updateMutate, isPending: updating } = useMutation({
		mutationFn: async (data: IUpdateDocumentTransaction) => await updateDocumentTransaction(data),
		onError: (error) => {
			toast.error(error.message, {
				className: "text-destructive",
				position: "top-center",
			});
		},
		onSuccess: () => {
			queryClient.refetchQueries({ queryKey: ["document-transactions"] });
			queryClient.refetchQueries({ queryKey: ["document-transaction-details"] });
			toast.custom(() => <CommonToast message="Successfully updated document" />, {
				position: "bottom-right",
				duration: 2500,
			});
			setOpenDialog(false)
		},
	});

	function handleConfirmUpdate() {
		if (type === 'recievedFrom') {
			updateMutate({
				id,
				recievedFromOutsider: value
			})
		}
		if (type === 'recievedBy') {
			updateMutate({
				id,
				recievedByOutsider: value
			})
		}
	}

	return (
		<Dialog open={openDialog} onOpenChange={() => setOpenDialog(false)}>
			<DialogContent className="max-w-[520px] max-h-[90vh] overflow-y-auto rounded-[25px] p-6">
				<DialogTitle>
					<DialogHeader className="flex flex-row items-center gap-x-2">
						<Layers3 />
						Transact Document
					</DialogHeader>
				</DialogTitle>
				<Separator />

				{type === 'recievedBy' && (
					<div className="flex flex-col gap-y-2">
						<p className="text-xs">Input Recieved By</p>
						<CommonInput
							defaultValue={existingData.recievedByOutsider}
							placeholder="John Doe"
							onChange={(e) => setValue(e.target.value)}
						/>
					</div>
				)}

				{type === 'recievedFrom' && (
					<div className="flex flex-col gap-y-2">
						<p className="text-xs">Input Recieved From</p>
						<CommonInput
							defaultValue={existingData.recievedFromOutsider}
							placeholder="John Doe"
							onChange={(e) => setValue(e.target.value)}
						/>
					</div>
				)}

				<div className="flex flex-row gap-x-2 items-center justify-end">
					<Button
						onClick={handleConfirmUpdate}
						className="flex gap-2 mt-4"
						disabled={updating}
					>
						{updating && <Loader2 size={20} className="animate-spin" />}
						<span>Update</span>
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
