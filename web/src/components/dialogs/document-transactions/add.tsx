import { CircleCheck, Layers3, Loader2, RedoDot, Split, UndoDot } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import AnimatedDiv from "@/components/animated/Div";
import CommonInput from "@/components/common/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import CommonToast from "@/components/common/toast";
import { Button } from "@/components/ui/button";
import Lottie from "lottie-react";
import skeletonLoader from "../../../assets/loaders/skeleton.json"

import { useState } from 'react';
import { IClient } from "@/api/mutations/client.mutation";
import usePagination from "@/hooks/usePagination";
import useDebounce from "@/hooks/useDebounce";
import { useAuth } from "@/providers/auth-provider";
import { fetchClients } from "@/api/queries/clients.query";
import { createDocumentTransaction, DocumentTransactionType, ICreateDocumentTransaction } from "@/api/mutations/document-transaction.mutation";
import ClientDetails from "@/components/section/transaction/lead";
import { Progress } from "@/components/ui/progress";
import { DocumentTransactionBadge } from "@/components/badges/document-transaction-type";


interface ICreateDocumentTransactionProps {
	openDialog: boolean;
	creatorId: string;
	setOpenDialog: (open: boolean) => void;
	successNavigate: (id: string) => void
}

const typeCardOptions = [
	{
		key: 'TRANSMITTAL',
		title: 'Transmittal',
		description: 'Create a transmittal document',
		icon: <Split size={82} className="text-muted-foreground" />
	},
	{
		key: 'RECIEVE',
		title: 'Receive',
		description: 'Create a recieve document',
		icon: <RedoDot size={82} className="text-muted-foreground" />
	},
	{
		key: 'RETURN',
		title: 'Return',
		description: 'Create a return document',
		icon: <UndoDot size={82} className="text-muted-foreground" />
	}
]

export default function CreateDocumentTransactionDialog({ openDialog, setOpenDialog, successNavigate }: ICreateDocumentTransactionProps) {
	const [step, setStep] = useState(0)
	const [selectedType, setSelectedType] = useState<string | null>(null);
	const { skip, take, pagination } = usePagination();
	const [search, setSearch] = useState('');
	const debouncedSearch = useDebounce(search, 500);
	const [selectedClient, setSelectedClient] = useState<IClient | null>(null);
	const { session, branch } = useAuth()
	const queryClient = useQueryClient()

	const { data, isLoading } = useQuery({
		queryKey: ['clients', pagination, debouncedSearch, branch],
		queryFn: async () => await fetchClients({ skip, take, search: debouncedSearch, branch }),
		enabled: step === 0
	});

	const handleSelectDocumentType = (option: string) => {
		setSelectedType(option);
		setStep(2)
	};

	const { mutate: createTransactionMutate, isPending: creatingTransaction } = useMutation({
		mutationFn: async (data: ICreateDocumentTransaction) => await createDocumentTransaction(data),
		onSuccess: (data) => {
			queryClient.refetchQueries({ queryKey: ['document-transactions'] });
			toast.custom(() => (
				<CommonToast message="Successfully created document transaction" />
			), {
				position: "bottom-right",
				duration: 2500
			})
			successNavigate(data.id);
		},
	});

	const handleSelectClient = (client: IClient) => {
		setSelectedClient(client);
		setStep(1)
	};
	function handleCreateDocumentTransaction() {
		createTransactionMutate({
			clientId: selectedClient?.id ?? "",
			preparedById: String(session?.user?.id),
			type: selectedType as DocumentTransactionType
		})
	}

	return (
		<Dialog open={openDialog} onOpenChange={() => {
			setStep(0)
			setOpenDialog(false)
		}}>
			<DialogContent className={`${step === 0 ? 'max-w-[520px]' : "max-w-[720px]"} max-h-[90vh] overflow-y-auto rounded-[25px] p-6`}>
				<DialogTitle>
					<DialogHeader className="flex flex-row items-center gap-x-2">
						<Layers3 />
						Create Document Transaction
					</DialogHeader>
				</DialogTitle>
				<Separator />
				<div className="p-4">
					<div className="flex flex-col gap-y-1">
						<div className="flex flex-row justify-between">
							<p className="text-xs font-medium">Select Client</p>
							<p className="text-xs font-medium">Select Type</p>
							<p className="text-xs font-medium">Review</p>
						</div>
						<Progress value={step === 0 ? 0 : step === 1 ? 50 : step === 2 ? 100 : 0} />
					</div>
				</div>
				{step === 0 &&
					<AnimatedDiv animationType="SlideInFromLeft" slideEntrancePoint={-20}>
						<div className="flex flex-row justify-center">
							<div className="w-full">
								<div className="flex flex-1 gap-2 items-center p-[1px] border-b pb-2">
									<CommonInput
										placeholder="Search by client name"
										containerProps={{
											className: "max-w-[500px]"
										}}
										defaultValue={search}
										onChange={(event) => setSearch(event.target.value)}
									/>
								</div>
								{isLoading ? (
									<div className="flex flex-col items-center">
										<Lottie animationData={skeletonLoader} loop={true} className="w-[320px] h-[320px]" />
										<p className="text-white font-semibold text-[14px]"></p>
									</div>
								) : (
									data?.clientsData?.slice(0, 3).map((client, index) => (
										<div
											className={`my-2 relative border-[1px]  cursor-pointer hover:bg-green-100 
												${selectedClient?.id === client.id ? 'border-green-500 bg-green-100' : 'border-dotted'}`}
											key={index}
											onClick={() => handleSelectClient(client)}
										>
											{selectedClient?.id === client.id && (
												<div className="absolute top-4 right-4 text-green-500">
													<AnimatedDiv animationType="Glowing" repeatDelay={0.5}>
														<CircleCheck size={24} />
													</AnimatedDiv>
												</div>
											)}
											<ClientDetails clientData={client} forSelection={true} />
										</div>
									))
								)}
							</div>
						</div>
						<div className="flex flex-row items-center gap-x-2 justify-end">
							<Button className="text-xs bg-muted-foreground" onClick={() => {
								setOpenDialog(false)
							}}>Close</Button>
							{selectedClient &&
								<Button className="text-xs" disabled={!selectedClient} onClick={() => {
									setStep(1)
								}}>
									Next
								</Button>
							}
						</div>
					</AnimatedDiv>
				}
				{step === 1 && selectedClient &&
					<>
						<div className="flex gap-x-2 justify-between w-full">
							{typeCardOptions.map((card) => (
								<AnimatedDiv
									slideEntrancePoint={-20}
									animationType="CardSpin"
									duration={0.5}
									key={card.key}
									className={`relative rounded-lg p-4 border-[1px] my-2 shadow-lg cursor-pointer hover:bg-green-100 flex flex-col justify-between w-[50%] h-[200px] ${selectedType === card.key ? 'border-green-500 bg-green-100' : 'border-dotted'
										}`}
									onClick={() => handleSelectDocumentType(card.key)}
								>
									{selectedType === card.key && (
										<div className="absolute top-2 right-2 text-green-500">
											<AnimatedDiv animationType="Glowing" repeatDelay={0.5}>
												<CircleCheck size={24} />
											</AnimatedDiv>
										</div>
									)}
									<div className="flex flex-col items-start">
										<p className="text-lg font-normal text-muted-foreground">{card.title}</p>
										<p className="text-xs text-muted-foreground">{card.description}</p>
									</div>
									<div className="flex justify-end">
										{card.icon}
									</div>
								</AnimatedDiv>
							))}
						</div>
						<div className="flex flex-row justify-end">
							<Button className="text-xs bg-muted-foreground" onClick={() => {
								setStep(0)
							}}>Back</Button>
						</div>
					</>
				}
				{(step === 2 && selectedClient) && (
					<AnimatedDiv className="flex flex-col w-[100%] space-y-2">
						<div className="flex flex-row items-center justify-start gap-x-2 pl-4">
							<p className="text-sm font-medium">Document Transaction Type:</p>
							<DocumentTransactionBadge type={selectedType as DocumentTransactionType} />
						</div>
						<ClientDetails clientData={selectedClient} forSelection={true} />
						<div className="flex flex-row items-center justify-end gap-x-2">
							<Button className="text-xs bg-muted-foreground" onClick={() => {
								setStep(1)
							}}>Back</Button>
							<Button className="text-xs" disabled={creatingTransaction} onClick={handleCreateDocumentTransaction}>
								{creatingTransaction ? (
									<div className="flex flex-row items-center gap-x-2">
										<p className="text-xs">Creating...</p>
										<Loader2 className="animate-spin" />
									</div>
								) : (
									<p className="text-xs">Create</p>
								)}
							</Button>
						</div>
					</AnimatedDiv>
				)}
			</DialogContent>
		</Dialog >
	);
}
