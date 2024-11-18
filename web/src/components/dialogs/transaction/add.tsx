import { BookUser, CircleCheck, Loader2, SquareMenu, UserPlus, X } from "lucide-react";
import { z } from "zod"
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import AnimatedDiv from "@/components/animated/Div";
import { Form, FormItem, FormControl, FormField, FormMessage, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CommonInput from "@/components/common/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTransaction, ICreateTransaction } from "@/api/mutations/transaction.mutation";
import { toast } from "sonner";
import CommonToast from "@/components/common/toast";
import { Button } from "@/components/ui/button";
import usePagination from "@/hooks/usePagination";
import useDebounce from "@/hooks/useDebounce";
import Lottie from "lottie-react";
import skeletonLoader from "../../../assets/loaders/skeleton.json"
import ClientDetails from "@/components/section/transaction/lead";
import { useAuth } from "@/providers/auth-provider";
import { fetchClients } from "@/api/queries/clients.query";
import { createClient, IClient, ICreateClient, TypeOfClient } from "@/api/mutations/client.mutation";
import { OfficeBranch } from "@/interfaces/user.interface";
import Constants from "@/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


interface ICreateTransactionDialog {
	openDialog: boolean;
	setOpenDialog: (open: boolean) => void;
	successNavigate: (id: string) => void
}
const cardOptions = [
	{
		key: 'new',
		title: 'Add',
		description: 'Create a new client from scratch.',
		icon: <UserPlus size={82} className="text-muted-foreground" />
	},
	{
		key: 'existing',
		title: 'Select',
		description: 'Choose from the existing clients created.',
		icon: <BookUser size={82} className="text-muted-foreground" />
	}
];

const clientTypesMap: Record<TypeOfClient, string> = {
	WALK_IN: 'Walk in',
	CORPORATE: 'Corporate',
	GOVERNMENT: 'Government',
	GROUP: 'Group',
	INDIVIDUAL: 'Individual',
}

type ClientWithDepartment = TypeOfClient.CORPORATE | TypeOfClient.GOVERNMENT;
const departmentMap: Record<ClientWithDepartment, string[]> = {
	CORPORATE: Constants.CorporateDepartments,
	GOVERNMENT: Constants.GovernmentDepartments,
}

const formSchema = z.object({
	name: z.string().trim().min(1, {
		message: "Name is required."
	}),
	contactNumber: z.string().trim().min(1, {
		message: "Contact number is required"
	}),
	email: z.string().trim().min(1, {
		message: "Email is required."
	}),
	clientType: z.enum([
		TypeOfClient.WALK_IN,
		TypeOfClient.CORPORATE,
		TypeOfClient.GOVERNMENT,
		TypeOfClient.GROUP,
		TypeOfClient.INDIVIDUAL,
	]),
	department: z.string().optional(),
});


export default function CreateTransactionDialog({ openDialog, setOpenDialog, successNavigate }: ICreateTransactionDialog) {
	const [selection, setSelection] = useState({
		step: 0,
		type: ""
	})
	const [selectedCard, setSelectedCard] = useState<string | null>(null);
	const { skip, take, pagination } = usePagination();
	const [search, setSearch] = useState('');
	const debouncedSearch = useDebounce(search, 500);
	const [selectedClient, setSelectedClient] = useState<IClient | null>(null);
	const { session, branch } = useAuth()
	const { PermissionsCanEdit } = Constants;
	const canEdit = session?.user?.permission && PermissionsCanEdit.includes(session?.user?.permission);


	const isApproved = true

	const { data, isLoading } = useQuery({
		queryKey: ['clients', pagination, debouncedSearch, branch, isApproved],
		queryFn: async () => await fetchClients({ skip, take, search: debouncedSearch, branch, isApproved }),
		enabled: (selection.type === 'select' && selection.step === 1)
	});

	const handleSelectCard = (option: string) => {
		setSelectedCard(option);
		setSelection({
			step: 1,
			type: option === 'new' ? "add" : "select"
		})
	};

	const queryClient = useQueryClient()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	})

	const { mutate: createTransactionMutate, isPending: creatingTransaction } = useMutation({
		mutationFn: async (data: ICreateTransaction) => await createTransaction(data),
		onError: (error) => {
			toast.error(error.message, {
				className: 'text-destructive',
				position: 'top-center',
			})
		},
		onSuccess: (data) => {
			queryClient.refetchQueries({ queryKey: ['transactions'] })
			toast.custom(() => (
				<CommonToast message="Successfully created transaction" />
			), {
				position: "bottom-right",
				duration: 2500,
			})
			successNavigate(data.id)
		}
	});
	const { mutate: createClientMutate, isPending: creatingClient } = useMutation({
		mutationFn: async (data: ICreateClient) => await createClient(data),
		onError: (error) => {
			toast.error(error.message, {
				className: 'text-destructive',
				position: 'top-center',
			})
		},
		onSuccess: (data) => {
			queryClient.refetchQueries({ queryKey: ['transactions'] })
			queryClient.refetchQueries({ queryKey: ['clients'] })
			createTransactionMutate({
				creatorId: String(session.user?.id),
				id: data.id,
				branch: branch as OfficeBranch,
			})
		}
	});
	const selectedClientType = form.watch('clientType');
	const selectedDepartment = form.watch('department')

	function clearDepartment() {
		form.reset({
			department: ''
		})
	}
	const handleSelectClient = (client: IClient) => {
		setSelectedClient(client);
	};

	function onSubmit(values: z.infer<typeof formSchema>) {
		if (selection.type === 'add') {
			createClientMutate({
				...values,
				officeBranch: branch as OfficeBranch,
				creatorId: String(session?.user?.id),
				approverId: String(session?.user?.id)
			})
		}
	}

	return (
		<Dialog open={openDialog} onOpenChange={() => {
			setSelection({
				step: 0,
				type: ""
			})
			setOpenDialog(false)
		}}>
			<DialogContent className="max-w-[520px] max-h-[90vh] overflow-y-auto rounded-[25px] p-6">
				<DialogTitle>
					<DialogHeader className="flex flex-row items-center gap-x-2">
						<SquareMenu className="text-secondary" />
						Create Transaction
					</DialogHeader>
				</DialogTitle>
				<Separator />
				<div className="space-y-8 p-4">
					{selection.step === 0 &&
						<div className="flex gap-x-2 justify-between w-full">

							{cardOptions.map((card, index) => (
								<AnimatedDiv
									slideEntrancePoint={-20}
									animationType="CardSpin"
									duration={0.5}
									key={card.key}
									className={`relative rounded-lg p-4 border-[1px] my-2 shadow-lg flex flex-col justify-between w-[50%] h-[200px]
									${selectedCard === card.key ? 'border-green-500 bg-green-100' : 'border-dotted'}
									${index === 0 && !canEdit ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-green-100'}
									`}
									onClick={() => {
										if (index !== 0 || canEdit) {
											handleSelectCard(card.key);
										}
									}}
								>
									{selectedCard === card.key && (
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
						</div>}
					{(selection.step === 1 && selection.type === 'add') &&
						<AnimatedDiv animationType="SlideInFromLeft" slideEntrancePoint={-20}>
							<Form {...form}>
								<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
									<p className="text-xs">Create new client</p>
									<FormField
										control={form.control}
										name="clientType"
										render={({ field }) => (
											<FormItem>
												<Select onValueChange={field.onChange} value={field.value}>
													<FormControl>
														<SelectTrigger className="bg-slate-100 border-none text-[12px]">
															<SelectValue placeholder="Select a client type" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{Object.entries(clientTypesMap).map(([value, label], index) => (
															<SelectItem
																key={index}
																value={value}
																className="text-[12px]"
															>
																{label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage className="text-[10px]" />
											</FormItem>
										)}
									/>
									{(selectedClientType === TypeOfClient.CORPORATE || selectedClientType === TypeOfClient.GOVERNMENT) && (
										<FormField
											control={form.control}
											name="department"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Department:</FormLabel>
													<div className="flex justify-between items-center gap-x-2">
														<Select onValueChange={field.onChange} value={field.value || ''}>

															<FormControl>
																<SelectTrigger className="bg-slate-100 border-none text-[12px]">
																	<SelectValue placeholder="Select a department" />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																{Object.entries(departmentMap[selectedClientType as ClientWithDepartment]).map(([index, value]) => (
																	<SelectItem
																		key={index}
																		value={value}
																		className="text-[12px]"
																	>
																		{value}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
														{selectedDepartment &&
															<Button variant="outline" className="w-auto flex items-center gap-x-2" onClick={clearDepartment}>
																<p className="text-xs">Do not set department</p>
																<X className="h-4 w-4" />
															</Button>
														}
													</div>
													<FormMessage className="text-[10px]" />
												</FormItem>
											)}
										/>
									)}
									<FormField
										control={form.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<div className="flex flex-row items-center justify-between gap-x-2">
													<p className="text-xs w-1/3">Client Name:</p>
													<FormControl className="w-2/3">
														<CommonInput inputProps={{ ...field }} placeholder="Client name" containerProps={{ className: 'text-xs' }} />
													</FormControl>
												</div>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="contactNumber"
										render={({ field }) => (
											<FormItem>
												<div className="flex flex-row items-center justify-between gap-x-2">
													<p className="text-xs w-1/3">Contact Number:</p>
													<FormControl className="w-2/3">
														<CommonInput inputProps={{ ...field }} placeholder="e.g. 0938242.." containerProps={{ className: 'text-xs' }} />
													</FormControl>
												</div>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<div className="flex flex-row items-center justify-between gap-x-2">
													<p className="text-xs w-1/3">Email address:</p>
													<FormControl className="w-2/3">
														<CommonInput inputProps={{ ...field }} placeholder="john@sampleemail.com" containerProps={{ className: 'text-xs' }} />
													</FormControl>
												</div>
												<FormMessage />
											</FormItem>
										)}
									/>									<div className="flex flex-row items-center gap-x-2 justify-end">
										<Button className="text-xs bg-muted-foreground" onClick={() => {
											setSelection({
												step: 0,
												type: ""
											})
										}}>Back</Button>
										<Button type="submit" className="text-xs" disabled={creatingClient || creatingTransaction}>
											{
												creatingClient || creatingTransaction ?
													<div className="flex flex-row items-center gap-x-">
														<p className="text-xs">Creating..</p>
														<Loader2 className="animate-spin" />
													</div> :
													<p className="text-xs">Create</p>
											}
										</Button>
									</div>
								</form>
							</Form>
						</AnimatedDiv>
					}
					{(selection.step === 1 && selection.type === 'select') &&
						<AnimatedDiv animationType="SlideInFromLeft" slideEntrancePoint={-20}>
							<p className="text-sm font-medium">
								Select a Client
							</p>
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
									setSelection({
										step: 0,
										type: ""
									})
								}}>Back</Button>

								{selectedClient &&
									<Button className="text-xs" disabled={creatingClient || creatingTransaction} onClick={() => {
										if (selectedClient) {
											createTransactionMutate({
												id: selectedClient.id,
												creatorId: String(session?.user?.id),
												branch: branch as OfficeBranch
											})
										}
									}}>
										{
											creatingClient || creatingTransaction ?
												<div className="flex flex-row items-center gap-x-">
													<p className="text-xs">Creating..</p>
													<Loader2 className="animate-spin" />
												</div> :
												<p className="text-xs">Create</p>
										}
									</Button>}
							</div>
						</AnimatedDiv>
					}
				</div>
			</DialogContent>
		</Dialog >
	);
}
