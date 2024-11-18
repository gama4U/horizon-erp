import { z } from "zod";
import CommonInput from "../../../common/input";
import { Loader2, MapPin } from "lucide-react"
import { Button } from "../../../ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../../../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "../../../ui/dialog"
import { Separator } from "../../../ui/separator"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AnimatedDiv from "../../../animated/Div";
import { createTourVoucher, ICreateTourVoucher } from "../../../../api/mutations/transaction.mutation";
import { toast } from "sonner";

interface AddTourVoucherProps {
	transactionId: string
	openDialog: boolean
	setOpenDialog: (open: boolean) => void
}
const formSchema = z.object({
	tourGuide: z.string(),
	tourContact: z.string(),
	driverName: z.string(),
	driverContact: z.string(),
	remarks: z.string().optional(),
});

export default function AddTourVoucherDialog({ transactionId, openDialog, setOpenDialog }: AddTourVoucherProps) {

	const queryClient = useQueryClient()
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	})

	const { mutate: addTourMutate, isPending: addingTour } = useMutation({
		mutationFn: async (data: ICreateTourVoucher) => await createTourVoucher(data),
		onError: (error) => {
			toast.error(error.message, {
				className: 'text-destructive',
				position: 'top-center',
			})
		},
		onSuccess: () => {
			queryClient.refetchQueries({ queryKey: ['transaction'] })
			form.reset();
			setOpenDialog(false)
			toast.success("Tour Voucher added successfully", {
				className: 'text-primary',
				position: 'top-center',
			});
		}
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		const payload: ICreateTourVoucher = {
			transactionId,
			remarks: values.remarks,
		};
		addTourMutate(payload);
	}

	return (
		<Dialog
			open={openDialog}
			onOpenChange={() => {
				form.reset()
				setOpenDialog(false)
			}}>
			<DialogContent className="max-w-[700px] max-h-[700px] overflow-auto">
				<DialogTitle>
					<DialogHeader className="flex flex-row items-center gap-x-2">
						<MapPin />
						Add Tour Voucher
					</DialogHeader>
				</DialogTitle>
				<Separator />
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<AnimatedDiv animationType="SlideInFromLeft" className="space-y-2" slideEntrancePoint={-50} duration={0.1}>
							<FormField
								control={form.control}
								name="tourGuide"
								render={({ field }) => (
									<FormItem>
										<div className="flex flex-row items-center justify-between gap-x-2">
											<p className="text-xs w-1/3">Tour Guide Name</p>
											<FormControl className="w-2/3">
												<CommonInput inputProps={{ ...field }} placeholder="Name of Tour Guide" containerProps={{ className: 'text-xs' }} />
											</FormControl>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="tourContact"
								render={({ field }) => (
									<FormItem>
										<div className="flex flex-row items-center justify-between gap-x-2">
											<p className="text-xs w-1/3">Tour Guide Contact #</p>
											<FormControl className="w-2/3">
												<CommonInput inputProps={{ ...field }} placeholder="e.g. 09239293 ..." containerProps={{ className: 'text-xs' }} />
											</FormControl>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="driverName"
								render={({ field }) => (
									<FormItem>
										<div className="flex flex-row items-center justify-between gap-x-2">
											<p className="text-xs w-1/3">Driver Name</p>
											<FormControl className="w-2/3">
												<CommonInput inputProps={{ ...field }} placeholder="Name of Driver" containerProps={{ className: 'text-xs' }} />
											</FormControl>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="driverContact"
								render={({ field }) => (
									<FormItem>
										<div className="flex flex-row items-center justify-between gap-x-2">
											<p className="text-xs w-1/3">Driver Contact #</p>
											<FormControl className="w-2/3">
												<CommonInput inputProps={{ ...field }} placeholder="e.g. 09239293 ..." containerProps={{ className: 'text-xs' }} />
											</FormControl>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="remarks"
								render={({ field }) => (
									<FormItem>
										<div className="flex flex-row items-center justify-between gap-x-2">
											<p className="text-xs w-1/3">Remarks (optional)</p>
											<FormControl className="w-2/3">
												<CommonInput inputProps={{ ...field }} placeholder="Remarks.." containerProps={{ className: 'text-xs' }} />
											</FormControl>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
						</AnimatedDiv>
						<div className="flex justify-end">
							<Button type="submit" className="text-xs" disabled={addingTour}>
								{
									addingTour ?
										<div className="flex flex-row items-center gap-x-">
											<p className="text-xs">Adding..</p>
											<Loader2 className="animate-spin" />
										</div> :
										<p className="text-xs">Add</p>
								}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
