import { ContactRound, Loader2, NotepadText, Pencil, ThumbsUp } from "lucide-react";
import { z } from "zod"
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import AnimatedDiv from "@/components/animated/Div";
import { Form, FormItem, FormControl, FormField, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CommonInput from "@/components/common/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import CommonToast from "@/components/common/toast";
import { Button } from "@/components/ui/button";
import { approveSupplier, ISupplier, IUpdateSupplier, updateSupplier } from "@/api/mutations/supplier.mutation";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import Constants from "@/constants";
import { useAuth } from "@/providers/auth-provider";

interface IUpdateSupplierProps {
	supplierData: ISupplier
}

const formSchema = z.object({
	name: z.string().trim().optional(),
	contact: z.string().trim().optional(),
	address: z.string().trim().optional(),
	emailAddress: z.string().email().optional(),
	category: z.string().optional(),
	notes: z.string().optional(),
});

export default function EditSupplierDialog({ supplierData }: IUpdateSupplierProps) {
	const queryClient = useQueryClient()
	const { PermissionsCanEdit } = Constants
	const { session: { user } } = useAuth();
	const canEdit = user?.permission && PermissionsCanEdit.includes(user.permission);


	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	})
	const [openDialog, setOpenDialog] = useState(false)

	const { mutate: approveMutate, isPending: approving } = useMutation({
		mutationFn: async (id: string) => await approveSupplier(id),
		onSuccess: (data) => {
			queryClient.refetchQueries({ queryKey: ['suppliers'] })
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


	const { mutate: updateSupplierMutate, isPending: updatingSupplier } = useMutation({
		mutationFn: async (data: IUpdateSupplier) => await updateSupplier(data),
		onError: (error) => {
			toast.error(error.message, {
				className: 'text-destructive',
				position: 'top-center',
			})
		},
		onSuccess: () => {
			form.reset()
			queryClient.refetchQueries({ queryKey: ['suppliers'] })
			setOpenDialog(false)
			toast.custom(() => (
				<CommonToast message="Successfully updated supplier" />
			), {
				position: "bottom-right",
				duration: 2500,
			})
		}
	});

	useEffect(() => {
		if (supplierData) {
			form.reset({
				...supplierData,
				notes: supplierData.notes ?? '',
				category: supplierData.category ?? ""
			})
		}
	}, [supplierData, form])

	function onSubmit(values: z.infer<typeof formSchema>) {
		updateSupplierMutate({
			id: supplierData.id,
			...values
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

			<DialogContent className="max-w-[700px] max-h-[90vh] overflow-auto">
				<DialogTitle>
					<DialogHeader className="flex flex-row items-center gap-x-2">
						<ContactRound className="text-secondary" />
						Update Supplier
					</DialogHeader>
				</DialogTitle>
				<div className="flex flex-col gap-2  text-xs border rounded-lg p-2">
					<div className="flex flex-row gap-x-2 justify-between">
						<p className="italic">Created by : {supplierData.creator?.firstName} {supplierData.creator?.lastName}</p>
						<p className="italic">
							Created at: {format(new Date(supplierData.createdAt), 'MMMM d, h:mm a')}
						</p>
					</div>
					{supplierData.approverId ?
						<p className="italic text-primary">Approved by: {supplierData.approver?.firstName} {supplierData.approver?.lastName}</p>
						:
						<div className="flex flex-row gap-x-2 items-center">
							<p className="text-xs italic text-muted-foreground">Not yet approved</p>
							{canEdit &&
								<Button
									size={'sm'}
									onClick={() => approveMutate(supplierData?.id)}
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

				<Separator />
				<div className="space-y-8 p-4">
					<AnimatedDiv animationType="SlideInFromLeft" slideEntrancePoint={-20}>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
								<FormField
									control={form.control}
									name="category"
									render={({ field }) => (
										<FormItem>
											<div className="flex flex-row items-center justify-between gap-x-2">
												<p className="text-xs w-1/3">Supplier Category:</p>
												<FormControl className="w-2/3">
													<CommonInput inputProps={{ ...field }} placeholder="Category" containerProps={{ className: 'text-xs' }}
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
									name="name"
									render={({ field }) => (
										<FormItem>
											<div className="flex flex-row items-center justify-between gap-x-2">
												<p className="text-xs w-1/3">Client Name:</p>
												<FormControl className="w-2/3">
													<CommonInput inputProps={{ ...field }} placeholder="Client name" containerProps={{ className: 'text-xs' }}
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
									name="contact"
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
									name="emailAddress"
									render={({ field }) => (
										<FormItem>
											<div className="flex flex-row items-center justify-between gap-x-2">
												<p className="text-xs w-1/3">Email:</p>
												<FormControl className="w-2/3">
													<CommonInput inputProps={{ ...field }} placeholder="Email address" containerProps={{ className: 'text-xs' }}
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
									name="address"
									render={({ field }) => (
										<FormItem>
											<div className="flex flex-row items-center justify-between gap-x-2">
												<p className="text-xs w-1/3">Address:</p>
												<FormControl className="w-2/3">
													<CommonInput inputProps={{ ...field }} placeholder="Supplier's Address" containerProps={{ className: 'text-xs' }}
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
										<Button type="submit" className="text-xs" disabled={updatingSupplier}>
											{
												updatingSupplier ?
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
