import { Loader2, UserCircle } from "lucide-react";
import { z } from "zod"
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
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
import { createClient, ICreateClient } from "@/api/mutations/client.mutation";
import { TypeOfClient } from "@/interfaces/sales-agreement.interface";
import { useEffect } from "react";
// import Constants from "@/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OfficeBranch, UserType } from "@/interfaces/user.interface";
import { useAuth } from "@/providers/auth-provider";
import { Textarea } from "@/components/ui/textarea";

interface ICreateClientProps {
	openDialog: boolean;
	setOpenDialog: (open: boolean) => void;
}

const clientTypesMap: Record<TypeOfClient, string> = {
	WALK_IN: 'Walk in',
	CORPORATE: 'Corporate',
	GOVERNMENT: 'Government',
	GROUP: 'Group',
	INDIVIDUAL: 'Individual',
}

// type ClientWithDepartment = TypeOfClient.CORPORATE | TypeOfClient.GOVERNMENT;
// // const departmentMap: Record<ClientWithDepartment, string[]> = {
// // 	CORPORATE: Constants.CorporateDepartments,
// // 	GOVERNMENT: Constants.GovernmentDepartments,
// // }

const formSchema = z.object({
	name: z.string().trim().min(1, {
		message: "Name is required."
	}),
	contactNumber: z.string().trim().min(1, {
		message: "Contact number is required"
	}),
	contactPerson: z.string().optional(),
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
	notes: z.string().optional()
});


export default function CreateClientDialog({ openDialog, setOpenDialog }: ICreateClientProps) {
	const queryClient = useQueryClient()
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	})
	const selectedClientType = form.watch('clientType');
	// const selectedDepartment = form.watch('department')
	const { session, branch } = useAuth()

	const { mutate: createClientMutate, isPending: creatingClient } = useMutation({
		mutationFn: async (data: ICreateClient) => await createClient(data),
		onError: (error) => {
			toast.error(error.message, {
				className: 'text-destructive',
				position: 'top-center',
			})
		},
		onSuccess: () => {
			form.reset({})
			queryClient.refetchQueries({ queryKey: ['clients'] })
			setOpenDialog(false)
			toast.custom(() => (
				<CommonToast message="Successfully created client" />
			), {
				position: "bottom-right",
				duration: 2500,
			})
		}
	});

	// function clearDepartment() {
	// 	form.reset({
	// 		department: ''
	// 	})
	// }

	function onSubmit(values: z.infer<typeof formSchema>) {
		createClientMutate({
			...values,
			officeBranch: branch as OfficeBranch,
			creatorId: String(session?.user?.id),
			...(session?.user?.userType === UserType.ADMIN && { approverId: String(session.user.id) })
		});
	}

	useEffect(() => {
		if (selectedClientType) {
			form.resetField('department');
		}
	}, [selectedClientType, form])

	return (
		<Dialog open={openDialog} onOpenChange={() => { setOpenDialog(false) }}>
			<DialogContent className="max-w-[700px] max-h-[520px] overflow-auto">
				<DialogTitle>
					<DialogHeader className="flex flex-row items-center gap-x-2">
						<UserCircle className="text-secondary" />
						Create Client from {branch}
					</DialogHeader>
				</DialogTitle>
				<Separator />
				<div className="space-y-8 p-4">
					<AnimatedDiv animationType="SlideInFromLeft" slideEntrancePoint={-20}>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
								<FormField
									control={form.control}
									name="clientType"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Type:</FormLabel>
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
													/>
												</FormControl>
											</div>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div className="flex flex-row items-center gap-x-2 justify-end">
									<Button type="submit" className="text-xs" disabled={creatingClient}>
										{
											creatingClient ?
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
				</div>
			</DialogContent>
		</Dialog >
	);
}
