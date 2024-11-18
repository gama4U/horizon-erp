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
import { IUpdateTransportVoucher, updateTransportVoucher } from "../../../../api/mutations/transaction.mutation";
import { toast } from "sonner";
import { ITransportVoucher, TransportServiceType, VehicleType } from "../../../../interfaces/transport.interface";
import { useEffect } from "react";

interface EditTransportVoucherProps {
	selectedTransport: ITransportVoucher
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

export function EditTransportVoucherDialog({ selectedTransport, openDialog, setOpenDialog }: EditTransportVoucherProps) {

	const queryClient = useQueryClient()
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	})

	const { mutate: updateTransportMutate, isPending: updatingTransport } = useMutation({
		mutationFn: async (data: IUpdateTransportVoucher) => await updateTransportVoucher(data),
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
			toast.success("Transport Voucher updated successfully", {
				className: 'text-primary',
				position: 'top-center',
			});
		}
	});

	useEffect(() => {
		if (selectedTransport) {
			form.reset({
				driverName: selectedTransport.driverName,
				driverContact: selectedTransport.driverContact,
				remarks: selectedTransport.remarks,
				vehiclePlateNumber: selectedTransport.vehiclePlateNumber,
				serviceType: selectedTransport.serviceType,
				vehicleType: selectedTransport.vehicleType
			})
		}
	}, [form, selectedTransport])

	function onSubmit(values: z.infer<typeof formSchema>) {
		const payload: IUpdateTransportVoucher = {
			id: selectedTransport.id,
			driverName: values.driverName,
			driverContact: values.driverContact,
			remarks: values.remarks,
			serviceType: values.serviceType,
			vehicleType: values.vehicleType,
			vehiclePlateNumber: values.vehiclePlateNumber
		};
		updateTransportMutate(payload);
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
							<Button type="submit" className="text-xs" disabled={updatingTransport}>
								{
									updatingTransport ?
										<div className="flex flex-row items-center gap-x-">
											<p className="text-xs">Updating..</p>
											<Loader2 className="animate-spin" />
										</div> :
										<p className="text-xs">Update</p>
								}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
