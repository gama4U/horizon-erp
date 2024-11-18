import { z } from "zod";
import CommonInput from "../../../common/input";
import { Popover, PopoverContent, PopoverTrigger } from "../../../ui/popover"
import { format } from "date-fns"
import { Calendar } from "../../../ui/calendar"
import { CalendarIcon, ListCheck, Loader2 } from "lucide-react"
import { Button } from "../../../ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../../../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "../../../ui/dialog"
import { Separator } from "../../../ui/separator"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AnimatedDiv from "../../../animated/Div";
import { toast } from "sonner";
import { createTransportItinerary, ICreateTransportItinerary } from "../../../../api/mutations/itinerary.mutation";

interface AddTransportItineraryProps {
	transportId?: string
	openDialog: boolean
	setOpenDialog: (open: boolean) => void
}

const formSchema = z.object({
	title: z.string(),
	description: z.string(),
	startDate: z.date(),
	endDate: z.date()
});

export function AddTransportItineraryDialog({ transportId, openDialog, setOpenDialog }: AddTransportItineraryProps) {

	const queryClient = useQueryClient()
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	})

	const { mutate: addItineraryMutate, isPending: addingItinerary } = useMutation({
		mutationFn: async (data: ICreateTransportItinerary) => await createTransportItinerary(data),
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
			toast.success("Itinerary added successfully", {
				className: 'text-primary',
				position: 'top-center',
			});
		}
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		addItineraryMutate({
			transportId: String(transportId),
			...values
		})
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
						<ListCheck />
						Add Itinerary
					</DialogHeader>
				</DialogTitle>
				<Separator />
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<AnimatedDiv animationType="SlideInFromLeft" className="space-y-2" slideEntrancePoint={-50} duration={0.1}>
							<FormField
								control={form.control}
								name={`title`}
								render={({ field }) => (
									<FormItem>
										<div className="flex flex-row items-center justify-between gap-x-2">
											<p className="text-xs w-1/3">Itinerary Title</p>
											<FormControl className="w-2/3">
												<CommonInput inputProps={{ ...field }} placeholder="Title" containerProps={{ className: 'text-xs' }} />
											</FormControl>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name={`description`}
								render={({ field }) => (
									<FormItem>
										<div className="flex flex-row items-center justify-between gap-x-2">
											<p className="text-xs w-1/3">Description</p>
											<FormControl className="w-2/3">
												<CommonInput inputProps={{ ...field }} placeholder="Description" containerProps={{ className: 'text-xs' }} />
											</FormControl>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name={`startDate`}
								render={({ field }) => (
									<FormItem>
										<div className="flex flex-row justify-between gap-x-2 items-center">
											<p className="text-xs w-1/3">Start Date</p>
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
								name={`endDate`}
								render={({ field }) => (
									<FormItem>
										<div className="flex flex-row justify-between gap-x-2 items-center">
											<p className="text-xs w-1/3">End Date</p>
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
						</AnimatedDiv>
						<div className="flex justify-end">
							<Button type="submit" className="text-xs" disabled={addingItinerary}>
								{
									addingItinerary ?
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
