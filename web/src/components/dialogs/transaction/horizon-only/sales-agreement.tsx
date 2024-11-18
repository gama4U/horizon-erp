import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../ui/dialog";
import { Separator } from "../../../ui/separator";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ClientTypeFilter, ISalesAgreement } from "@/interfaces/sales-agreement.interface";
import usePagination from "@/hooks/usePagination";
import useDebounce from "@/hooks/useDebounce";
import { fetchSalesAgreements } from "@/api/queries/sales-agreements.queries";
import CommonInput from "@/components/common/input";
import ClientTypeFilterSelect from "@/components/select/sales-agreement/client-type-filter";
import SalesAgreementInfo from "@/components/section/sales-agreement/info";
import { CircleCheck } from "lucide-react";
import AnimatedDiv from "@/components/animated/Div";
import { Button } from "@/components/ui/button";
import { IUpdateTransaction, updateTransaction } from "@/api/mutations/transaction.mutation";
import skeletonLoader from "../../../../assets/loaders/skeleton.json"
import { toast } from "sonner";
import Lottie from "lottie-react";

interface SelectSalesAgreementDialogProps {
	transactionId: string
	selectedSalesAgreement?: ISalesAgreement;
	openDialog: boolean;
	setOpenDialog: (open: boolean) => void;
}

export default function SelectSalesAgreementDialog({
	selectedSalesAgreement,
	openDialog,
	setOpenDialog,
	transactionId
}: SelectSalesAgreementDialogProps) {
	const queryClient = useQueryClient();
	const { skip, take, pagination } = usePagination();
	const [search, setSearch] = useState('');
	const [clientTypeFilter, setClientTypeFilter] = useState<ClientTypeFilter | string>('');
	const debouncedSearch = useDebounce(search, 500);
	const [selectedAgreement, setSelectedAgreement] = useState<ISalesAgreement | null>(null);

	const { data, isLoading } = useQuery({
		queryKey: ['sales-agreements', pagination, debouncedSearch, clientTypeFilter],
		queryFn: async () =>
			await fetchSalesAgreements({
				skip,
				take,
				search: debouncedSearch,
				...(clientTypeFilter && {
					typeOfClient: clientTypeFilter,
				}),
			}),
	});

	const { mutate: updateTransactionMutate, isPending: updatingTransaction } = useMutation({
		mutationFn: async (data: IUpdateTransaction) => await updateTransaction(data),
		onError: (error) => {
			toast.error(error.message, {
				className: 'text-destructive',
				position: 'top-center',
			});
		},
		onSuccess: () => {
			queryClient.refetchQueries({ queryKey: ['transaction'] });
			setOpenDialog(false);
			toast.success("Sales agreement successfully added", {
				className: 'text-primary',
				position: 'top-center',
			});
		}
	});

	const handleUpdateSalesAgreement = () => {
		if (selectedAgreement) {
			updateTransactionMutate({
				id: transactionId,
				salesAgreementId: selectedAgreement.id,
			});
		}
	};

	useEffect(() => {
		if (selectedSalesAgreement) {
			setSelectedAgreement(selectedSalesAgreement);
		}
	}, [selectedSalesAgreement]);

	const handleSelectAgreement = (salesAgreement: ISalesAgreement) => {
		setSelectedAgreement(salesAgreement);
	};

	return (
		<Dialog
			open={openDialog}
			onOpenChange={() => {
				setOpenDialog(false);
			}}
		>
			<DialogContent className="max-w-auto max-h-[90vh] overflow-y-auto rounded-[25px] p-6">
				<DialogTitle>
					<DialogHeader className="flex flex-row items-center gap-x-2">
						Select Sales Agreement
					</DialogHeader>
				</DialogTitle>
				<Separator />
				<div className="flex flex-row justify-center">
					<div className="w-full">
						<div className="flex flex-1 gap-2 items-center p-[1px] border-b pb-2">
							<CommonInput
								placeholder="Search by client name or serial no."
								containerProps={{
									className: "max-w-[500px]",
								}}
								defaultValue={search}
								onChange={(event) => setSearch(event.target.value)}
							/>
							<ClientTypeFilterSelect
								value={clientTypeFilter}
								onValueChange={(value) => setClientTypeFilter(value)}
							/>
						</div>

						{isLoading ? (
							<div className="flex flex-col items-center">
								<Lottie animationData={skeletonLoader} loop={true} className="w-[320px] h-[320px]" />
								<p className="text-white font-semibold text-[14px]"></p>
							</div>
						) : (
							data?.salesAgreements?.slice(0, 3).map((salesAgreement, index) => (
								<div
									className={`relative rounded-lg p-2 border-[1px] my-2 cursor-pointer hover:bg-green-100 
                                ${selectedAgreement?.id === salesAgreement.id ? 'border-green-500 bg-green-100' : 'border-dotted'}`}
									key={index}
									onClick={() => handleSelectAgreement(salesAgreement)}>
									{selectedAgreement?.id === salesAgreement.id && (
										<div className="absolute top-2 right-2 text-green-500">
											<AnimatedDiv animationType="Glowing" repeatDelay={0.5}>
												<CircleCheck size={24} />
											</AnimatedDiv>
										</div>
									)}
									<SalesAgreementInfo data={salesAgreement} />
								</div>
							)))}

						<div className="flex justify-end">
							{(selectedAgreement || selectedSalesAgreement) && (
								<Button
									className="text-xs"
									disabled={updatingTransaction}
									onClick={handleUpdateSalesAgreement}
								>
									{updatingTransaction ?
										<p>Saving..</p> :
										<p>Save</p>}
								</Button>
							)}
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
