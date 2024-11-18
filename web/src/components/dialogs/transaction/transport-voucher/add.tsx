import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select";
import CommonInput from "../../../common/input";
import { Car, Loader2 } from "lucide-react"
import { Button } from "../../../ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../../../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "../../../ui/dialog"
import { Separator } from "../../../ui/separator"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AnimatedDiv from "../../../animated/Div";
import { createTransportVoucher, ICreateTransportVoucher } from "../../../../api/mutations/transaction.mutation";
import { toast } from "sonner";
import { TransportServiceType, VehicleType } from "../../../../interfaces/transport.interface";

interface AddTransportVoucherProps {
	transactionId: string
	openDialog: boolean
	setOpenDialog: (open: boolean) => void
}
const serviceTypesMap: Record<TransportServiceType, string> = {
	[TransportServiceType.WHOLE_DAY]: 'Whole Day',
	[TransportServiceType.MULTIPLE]: 'Multiple',
	[TransportServiceType.PUDO]: 'PUDO',
	[TransportServiceType.HALF_DAY]: 'Half Day',
}
const vehicleTypesMap: Record<VehicleType, string> = {
	[VehicleType.COASTER]: 'Coaster',
	[VehicleType.SEDAN]: 'Sedan',
	[VehicleType.VAN]: 'Van',
	[VehicleType.SUV]: 'SUV',
	[VehicleType.BUS]: 'Bus',
}
const formSchema = z.object({
	driverName: z.string(),
	driverContact: z.string(),
	remarks: z.string().optional(),
	vehiclePlateNumber: z.string(),
	serviceType: z.enum([TransportServiceType.PUDO, TransportServiceType.HALF_DAY, TransportServiceType.MULTIPLE, TransportServiceType.WHOLE_DAY]),
	vehicleType: z.enum([VehicleType.BUS, VehicleType.SUV, VehicleType.VAN, VehicleType.SEDAN, VehicleType.COASTER])
});

export default function AddTransportVoucherDialog({ transactionId, openDialog, setOpenDialog }: AddTransportVoucherProps) {

	const queryClient = useQueryClient()
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	})

	const { mutate: addTransportMutate, isPending: addingTransport } = useMutation({
		mutationFn: async (data: ICreateTransportVoucher) => await createTransportVoucher(data),
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
			toast.success("Transport Voucher added successfully", {
				className: 'text-primary',
				position: 'top-center',
			});
		}
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		const payload: ICreateTransportVoucher = {
			transactionId,
			driverName: values.driverName,
			driverContact: values.driverContact,
			remarks: values.remarks,
			serviceType: values.serviceType,
			vehicleType: values.vehicleType,
			vehiclePlateNumber: values.vehiclePlateNumber
		};
		addTransportMutate(payload);
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
						<Car />
						Add Transport Voucher
					</DialogHeader>
				</DialogTitle>
				<Separator />
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<AnimatedDiv animationType="SlideInFromLeft" className="space-y-2" slideEntrancePoint={-50} duration={0.1}>
							<FormField
								control={form.control}
								name="serviceType"
								render={({ field }) => (
									<FormItem>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger className="text-xs">
													<SelectValue placeholder="Select service type" className="text-xs" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{Object.entries(serviceTypesMap).map(([key, value], index) => (
													<SelectItem
														value={key}
														key={index}
														className="text-xs"
													>
														{value}
													</SelectItem>
												))}

											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="vehicleType"
								render={({ field }) => (
									<FormItem>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger className="text-xs">
													<SelectValue placeholder="Select vehicle type" className="text-xs" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{Object.entries(vehicleTypesMap).map(([key, value], index) => (
													<SelectItem
														value={key}
														key={index}
														className="text-xs"
													>
														{value}
													</SelectItem>
												))}

											</SelectContent>
										</Select>
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
								name="vehiclePlateNumber"
								render={({ field }) => (
									<FormItem>
										<div className="flex flex-row items-center justify-between gap-x-2">
											<p className="text-xs w-1/3">Vehicle Plate Number</p>
											<FormControl className="w-2/3">
												<CommonInput inputProps={{ ...field }} placeholder="e.g. G202-023" containerProps={{ className: 'text-xs' }} />
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
							<Button type="submit" className="text-xs" disabled={addingTransport}>
								{
									addingTransport ?
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
