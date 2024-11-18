import { AccommodationType, IAccommodationVoucher } from "../../../../interfaces/accommodation.interface"
import { Popover, PopoverContent, PopoverTrigger } from "../../../ui/popover"
import { format } from "date-fns"
import { Calendar } from "../../../ui/calendar"
import { CalendarIcon, Loader2 } from "lucide-react"
import { z } from "zod";
import CommonInput from "../../../common/input";
import { Button } from "../../../ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../../../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Dialog, DialogContent, DialogTitle, DialogHeader } from "../../../ui/dialog"
import { Separator } from "../../../ui/separator"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AnimatedDiv from "../../../animated/Div";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select";
import { toast } from "sonner"
import { IUpdateAccommodationVoucher, updateAccommodationVoucher } from "../../../../api/mutations/transaction.mutation"
import { useEffect } from "react"

interface EditAccommodationVoucherProps {
	selectedAccommodation: IAccommodationVoucher
	openDialog: boolean
	setOpenDialog: (open: boolean) => void
}
const accommodationTypesMap: Record<AccommodationType, string> = {
	[AccommodationType.HOTEL]: 'Hotel',
	[AccommodationType.AIRBNB]: 'AIRBNB',
	[AccommodationType.RESORT]: 'Resort',
	[AccommodationType.OTHERS]: 'Others',
}

const formSchema = z.object({
	name: z.string().trim().min(1, {
		message: "Name is required."
	}),
	type: z.enum([
		AccommodationType.HOTEL,
		AccommodationType.AIRBNB,
		AccommodationType.RESORT,
		AccommodationType.OTHERS,
	]),
	checkinDate: z.date(),
	checkoutDate: z.date(),
	hotelConfirmationNumber: z.string().trim().min(1, {
		message: "Hotel confirmation number is required."
	}),
	numberOfNights: z.number(),
	pax: z.preprocess((value) => {
		const parsedValue = parseFloat(value as string);
		return isNaN(parsedValue) ? 0 : parsedValue;
	}, z.number().nonnegative()).optional(),
	remarks: z.string().optional(),
});

export function EditAccommodationVoucherDialog({ selectedAccommodation, openDialog, setOpenDialog }: EditAccommodationVoucherProps) {

	const queryClient = useQueryClient()
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
		},
	})
	useEffect(() => {
		const { checkinDate, checkoutDate } = form.getValues();
		if (checkinDate && checkoutDate) {
			const nightDifference = Math.ceil((checkoutDate.getTime() - checkinDate.getTime()) / (1000 * 3600 * 24));
			if (nightDifference >= 0) {
				form.setValue("numberOfNights", nightDifference);
			} else {
				form.setValue("numberOfNights", 0);
			}
		}
	}, [form.watch("checkinDate"), form.watch("checkoutDate")]);


	const { mutate: updateAccommodationMutate, isPending: updatingAccommodation } = useMutation({
		mutationFn: async (data: IUpdateAccommodationVoucher) => await updateAccommodationVoucher(data),
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
			toast.success("Accommodation added successfully", {
				className: 'text-primary',
				position: 'top-center',
			});
		}
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		updateAccommodationMutate({
			id: selectedAccommodation.id,
			...values
		})
	}
	useEffect(() => {
		if (selectedAccommodation) {
			form.reset({
				type: selectedAccommodation.type,
				name: selectedAccommodation.name,
				hotelConfirmationNumber: selectedAccommodation.hotelConfirmationNumber,
				remarks: selectedAccommodation.remarks ?? "N/A",
				pax: selectedAccommodation.pax ?? 0,
				checkinDate: new Date(selectedAccommodation.checkinDate),
				checkoutDate: new Date(selectedAccommodation.checkoutDate),
			});
		}
	}, [form, selectedAccommodation]);


	return (
		<Dialog
			open={openDialog}
			onOpenChange={() => {
				setOpenDialog(false)
			}}>
			<DialogContent>
				<DialogTitle>
					<DialogHeader>
						Updatae Accommodation Voucher
					</DialogHeader>
				</DialogTitle>
				<Separator />
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<AnimatedDiv animationType="SlideInFromLeft" className="space-y-2" slideEntrancePoint={-50} duration={0.1}>
							<FormField
								control={form.control}
								name="type"
								render={({ field }) => (
									<FormItem>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger className="text-xs">
													<SelectValue placeholder="Select accommodation type" className="text-xs" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{Object.entries(accommodationTypesMap).map(([key, value], index) => (
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
								name="name"
								render={({ field }) => (
									<FormItem>
										<div className="flex flex-row items-center justify-between gap-x-2">
											<p className="text-xs w-1/3">Name:</p>
											<FormControl className="w-2/3">
												<CommonInput inputProps={{ ...field }} placeholder="Name of Accommodation" containerProps={{ className: 'text-xs' }} />
											</FormControl>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="hotelConfirmationNumber"
								render={({ field }) => (
									<FormItem>
										<div className="flex flex-row items-center justify-between gap-x-2">
											<p className="text-xs w-1/3">Hotel Confirmation #:</p>
											<FormControl className="w-2/3">
												<CommonInput inputProps={{ ...field }} placeholder="Hotel Confirmation Number" containerProps={{ className: 'text-xs' }} />
											</FormControl>
										</div>
										<FormMessage />
									</FormItem>
								)}

							/>
							<FormField
								control={form.control}
								name="checkinDate"
								render={({ field }) => (
									<FormItem>
										<div className="flex flex-row justify-between gap-x-2 items-center">
											<p className="text-xs w-1/3">Checkin Date:</p>
											<Popover>
												<PopoverTrigger asChild>
													<FormControl className="w-2/3">
														<Button
															variant={"outline"}
															className={`w-full pl-3 text-left font-normal text-xs
																${!field.value && "text-muted-foreground"}`}
														>
															{field.value ? (
																format(field.value, "PPP")
															) : (
																<span className="text-xs">Pick a date</span>
															)}
															<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
														</Button>
													</FormControl>
												</PopoverTrigger>
												<PopoverContent className="text-xs w-auto p-0" align="start">
													<Calendar
														className="text-xs"
														mode="single"
														selected={field.value}
														onSelect={field.onChange}
														initialFocus
													/>
												</PopoverContent>
											</Popover>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="checkoutDate"
								render={({ field }) => (
									<FormItem>
										<div className="flex flex-row justify-between gap-x-2 items-center">
											<p className="text-xs w-1/3">Checkout Date:</p>
											<Popover>
												<PopoverTrigger asChild>
													<FormControl className="w-2/3">
														<Button
															variant={"outline"}
															className={`w-full pl-3 text-left font-normal text-xs
																${!field.value && "text-muted-foreground"}`}
														>
															{field.value ? (
																format(field.value, "PPP")
															) : (
																<span className="text-xs">Pick a date</span>
															)}
															<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
														</Button>
													</FormControl>
												</PopoverTrigger>
												<PopoverContent className="text-xs w-auto p-0" align="start">
													<Calendar
														className="text-xs"
														mode="single"
														selected={field.value}
														onSelect={field.onChange}
														initialFocus
													/>
												</PopoverContent>
											</Popover>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="numberOfNights"
								render={({ field }) => (
									<FormItem>
										<div className="flex flex-row items-center justify-between gap-x-2">
											<p className="text-xs w-1/3">Number of Nights:</p>
											<FormControl className="w-2/3">
												<CommonInput disabled={true} type="number" inputProps={{ ...field }} placeholder="Number of nights" containerProps={{ className: 'text-xs' }} />
											</FormControl>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="pax"
								render={({ field }) => (
									<FormItem>
										<div className="flex flex-row items-center justify-between gap-x-2">
											<p className="text-xs w-1/3">Number of People(Pax):</p>
											<FormControl className="w-2/3">
												<CommonInput type="number" inputProps={{ ...field }} placeholder="e.g. 2,4..." containerProps={{ className: 'text-xs' }} />
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
											<p className="text-xs w-1/3">Remarks (Optional):</p>
											<FormControl className="w-2/3">
												<CommonInput inputProps={{ ...field }} placeholder="Enter remarks" containerProps={{ className: 'text-xs' }} />
											</FormControl>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="flex flex-row justify-end">
								<Button type="submit" className="text-xs" disabled={updatingAccommodation}>
									{
										updatingAccommodation ?
											<div className="flex flex-row items-center gap-x-">
												<p className="text-xs">Updating..</p>
												<Loader2 className="animate-spin" />
											</div> :
											<p className="text-xs">Update</p>
									}
								</Button>
							</div>
						</AnimatedDiv>
					</form>
				</Form>
			</DialogContent>
		</Dialog>

	)

}
