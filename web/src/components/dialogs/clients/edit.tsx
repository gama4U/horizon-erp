import { Loader2, UserCircle, Pencil, ThumbsUp, NotepadText } from "lucide-react";
import { z } from "zod"
import { format } from "date-fns";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import AnimatedDiv from "@/components/animated/Div";
import { Form, FormItem, FormControl, FormField, FormMessage, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CommonInput from "@/components/common/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import CommonToast from "@/components/common/toast";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { approveClient, IClient, IUpdateClient, updateClient } from "@/api/mutations/client.mutation";
import { TypeOfClient } from "@/interfaces/sales-agreement.interface";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/providers/auth-provider";
import Constants from "@/constants";

interface IUpdateClientProps {
	clientData: IClient
}

const clientTypesMap: Record<TypeOfClient, string> = {
	WALK_IN: 'Walk in',
	CORPORATE: 'Corporate',
	GOVERNMENT: 'Government',
	GROUP: 'Group',
	INDIVIDUAL: 'Individual',
}

// type ClientWithDepartment = TypeOfClient.CORPORATE | TypeOfClient.GOVERNMENT;
// const departmentMap: Record<ClientWithDepartment, string[]> = {
// 	CORPORATE: Constants.CorporateDepartments,
// 	GOVERNMENT: Constants.GovernmentDepartments,
// }

const formSchema = z.object({
	name: z.string().trim().min(1, {
		message: "Name is required."
	}),
	contactNumber: z.string().trim().min(1, {
		message: "Contact number is required"
	}).optional(),
	email: z.string().trim().min(1, {
		message: "Email is required."
	}).optional(),
	contactPerson: z.string().optional(),
	clientType: z.enum([
		TypeOfClient.WALK_IN,
		TypeOfClient.CORPORATE,
		TypeOfClient.GOVERNMENT,
		TypeOfClient.GROUP,
		TypeOfClient.INDIVIDUAL,
	]).optional(),
	department: z.string().optional(),
	notes: z.string().optional()
});


export default function EditClientDialog({ clientData }: IUpdateClientProps) {
	const queryClient = useQueryClient()
	const [openDialog, setOpenDialog] = useState(false)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	})
	const { session: { user } } = useAuth();
	const { PermissionsCanEdit } = Constants;
	const canEdit = user?.permission && PermissionsCanEdit.includes(user.permission);


	const selectedClientType = form.watch('clientType');
	// const selectedDepartment = form.watch('department')
	//
	// function clearDepartment() {
	// 	form.reset({
	// 		department: ''
	// 	})
	// }

	useEffect(() => {
		if (clientData) {
			form.reset({
				...clientData,
				notes: clientData.notes ?? '',
				contactPerson: clientData.contactPerson ?? '',
				department: clientData.department ?? '',
			})
		}
	}, [clientData, form]);

	const { mutate: approveMutate, isPending: approving } = useMutation({
		mutationFn: async (id: string) => await approveClient(id),
		onSuccess: (data) => {
			queryClient.refetchQueries({ queryKey: ['clients'] })
			queryClient.refetchQueries({ queryKey: ['transaction'] })
			toast.success(data.message, {
				position: 'top-center',
				className: 'text-primary'
			});
		},
		onError: (error) => {
			toast.error(error.message, {
				position: 'top-center',
				className: 'text-destructive'
			})
		},
	});

	const { mutate: updateClientMutate, isPending: updatingClient } = useMutation({
		mutationFn: async (data: IUpdateClient) => await updateClient(data),
		onError: (error) => {
			toast.error(error.message, {
				className: 'text-destructive',
				position: 'top-center',
			})
		},
		onSuccess: () => {
			queryClient.refetchQueries({ queryKey: ['clients'] })
			queryClient.refetchQueries({ queryKey: ['transaction'] })
			setOpenDialog(false)
			form.reset()
			toast.custom(() => (
				<CommonToast message="Successfully updated client" />
			), {
				position: "bottom-right",
				duration: 2500
			})
		}
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		updateClientMutate({
			id: clientData.id, ...values
		})
	}

	return (
		<Dialog open={openDialog} onOpenChange={setOpenDialog}>
			<DialogTrigger>
				<Button size={'icon'} variant={'ghost'} className="hover:text-primary">
					{canEdit ? (
						<Pencil size={16} />
					) : (
						<NotepadText
							size={16}
							className="cursor-pointer hover:text-primary"
						/>
					)
					}
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-[700px] max-h-[520px] overflow-auto" >
				<DialogTitle>
					<DialogHeader className="flex flex-row items-center gap-x-2">
						<UserCircle className="text-secondary" />
						Update Client Information
					</DialogHeader>
				</DialogTitle>
				<Separator />
				<div className="flex flex-col gap-2  text-xs border rounded-lg p-2">
					<div className="flex flex-row gap-x-2 justify-between">
						<p className="italic">Created by : {clientData.creator?.firstName} {clientData.creator?.lastName}</p>
						<p className="italic">
							Created at: {format(new Date(clientData.createdAt), 'MMMM d, h:mm a')}
						</p>
					</div>
					{clientData.approverId ?
						<p className="italic text-primary">Approved by: {clientData.approver?.firstName} {clientData.approver?.lastName}</p>
						:
						<div className="flex flex-row gap-x-2 items-center">
							<p className="text-xs italic text-muted-foreground">Not yet approved</p>
							{canEdit &&
								<Button
									size={'sm'}
									onClick={() => approveMutate(clientData?.id)}
									className='gap-1'
									disabled={approving}
								>
									{approving ? (
										<Loader2 size={16} className='animate-spin' />
									) : (
										<ThumbsUp size={16} />
									)}
									<span>Approve</span>
								</Button>}
						</div>
					}
				</div>
				<div className="space-y-8">
					<AnimatedDiv animationType="SlideInFromLeft" slideEntrancePoint={-20}>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
								<FormField
									control={form.control}
									name="clientType"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Type:</FormLabel>
											<Select onValueChange={field.onChange} value={field.value}
												disabled={!canEdit}
											>
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
								{(selectedClientType === TypeOfClient.CORPORATE || selectedClientType === TypeOfClient.GOVERNMENT) && (
									<>
										<FormField
											control={form.control}
											name="department"
											render={({ field }) => (
												<FormItem>
													<div className="flex flex-row items-center justify-between gap-x-2">
														<p className="text-xs w-1/3">Department:</p>
														<FormControl className="w-2/3">
															<CommonInput inputProps={{ ...field }} placeholder="e.g. HR, Finance" containerProps={{ className: 'text-xs' }} />
														</FormControl>
													</div>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="contactPerson"
											render={({ field }) => (
												<FormItem>
													<div className="flex flex-row items-center justify-between gap-x-2">
														<p className="text-xs w-1/3">Contact Person:</p>
														<FormControl className="w-2/3">
															<CommonInput inputProps={{ ...field }} placeholder="Contact Person" containerProps={{ className: 'text-xs' }} />
														</FormControl>
													</div>
													<FormMessage />
												</FormItem>
											)}
										/>
									</>
								)}
								<FormField
									control={form.control}
									name="contactNumber"
									render={({ field }) => (
										<FormItem>
											<div className="flex flex-row items-center justify-between gap-x-2">
												<p className="text-xs w-1/3">Contact Number:</p>
												<FormControl className="w-2/3">
													<CommonInput inputProps={{ ...field }} placeholder="e.g. 0938242.." containerProps={{ className: 'text-xs' }}
														disabled={!canEdit}
													/>
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
													<CommonInput inputProps={{ ...field }} placeholder="john@sampleemail.com" containerProps={{ className: 'text-xs' }}
														disabled={!canEdit}
													/>
												</FormControl>
											</div>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="notes"
									render={({ field }) => (
										<FormItem>
											<div className="flex flex-row items-center justify-between gap-x-2">
												<p className="text-xs w-1/3">Notes:</p>
												<FormControl className="w-2/3">
													<Textarea
														{...field}
														placeholder="Start writing notes..."
														className="w-full bg-slate-100 border-none text-[12px] resize-none focus-visible:ring-0"
														disabled={!canEdit}
													/>
												</FormControl>
											</div>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div className="flex flex-row items-center gap-x-2 justify-end">
									{canEdit &&
										<Button type="submit" className="text-xs" disabled={updatingClient}>
											{
												updatingClient ?
													<div className="flex flex-row items-center gap-x-">
														<p className="text-xs">Updating..</p>
														<Loader2 className="animate-spin" />
													</div> :
													<p className="text-xs">Update</p>
											}
										</Button>}
								</div>
							</form>
						</Form>
					</AnimatedDiv>
				</div>
			</DialogContent>
		</Dialog >
	);
}
