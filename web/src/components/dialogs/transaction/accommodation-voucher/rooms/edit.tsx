import { FilePlus, Loader2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import CommonInput from "@/components/common/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { IAddRoomAccommodation, updateRoomAccommodation } from "@/api/mutations/room-accommodation.mutation";
import { IRoomAccommodation } from "@/interfaces/accommodation.interface";

const formSchema = z.object({
	childrenCount: z.preprocess((value) => {
		const parsedValue = parseFloat(value as string);
		return isNaN(parsedValue) ? 0 : parsedValue;
	}, z.number().nonnegative()).optional(),
	adultCount: z.preprocess((value) => {
		const parsedValue = parseFloat(value as string);
		return isNaN(parsedValue) ? 0 : parsedValue;
	}, z.number().nonnegative()).optional(),
	infantCount: z.preprocess((value) => {
		const parsedValue = parseFloat(value as string);
		return isNaN(parsedValue) ? 0 : parsedValue;
	}, z.number().nonnegative()).optional(),
	seniorCount: z.preprocess((value) => {
		const parsedValue = parseFloat(value as string);
		return isNaN(parsedValue) ? 0 : parsedValue;
	}, z.number().nonnegative()).optional(),
});

interface Props {
	accommodationId: string;
	id: string;
	roomData: IRoomAccommodation
}

export default function EditRoomAccommodation({ accommodationId, roomData, id }: Props) {
	const queryClient = useQueryClient();
	const [open, setOpen] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			childrenCount: 0,
			adultCount: 0,
			infantCount: 0,
			seniorCount: 0
		}
	});

	const { mutate: updateMutate, isPending } = useMutation({
		mutationFn: async (data: IAddRoomAccommodation) => await updateRoomAccommodation(data),
		onSuccess: (data) => {
			queryClient.refetchQueries({ queryKey: ['transaction'] });
			form.reset();
			setOpen(false);
			toast.success(data.message, {
				position: 'top-center',
				className: 'text-primary'
			});
		},
		onError: (error) => {
			toast.error(error.message, {
				position: 'top-center',
				className: 'text-destructive'
			});
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		updateMutate({
			accommodationId,
			id: id,
			...values,
		});
	}

	useEffect(() => {
		if (roomData) {
			form.reset({
				adultCount: roomData.adultCount,
				childrenCount: roomData.childrenCount,
				seniorCount: roomData.seniorCount,
				infantCount: roomData.infantCount
			})
		}
	}, [roomData, form])

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger>
				<Button size={'icon'} variant={'ghost'} className="text-primary">
					<Pencil size={18} />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<FilePlus size={24} className="text-secondary" />
						<span>Update Room Details</span>
					</DialogTitle>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
							<FormField
								control={form.control}
								name="childrenCount"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Number of Children:</FormLabel>
										<FormControl>
											<CommonInput inputProps={{ ...field }} type="number" placeholder="Number of Children" />
										</FormControl>
										<FormMessage className="text-[10px]" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="infantCount"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Number of Infants:</FormLabel>
										<FormControl>
											<CommonInput inputProps={{ ...field }} type="number" placeholder="Number of Infants" />
										</FormControl>
										<FormMessage className="text-[10px]" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="adultCount"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Number of Adults:</FormLabel>
										<FormControl>
											<CommonInput inputProps={{ ...field }} type="number" placeholder="Number of Adults" />
										</FormControl>
										<FormMessage className="text-[10px]" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="seniorCount"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Number of Senior Citizens:</FormLabel>
										<FormControl>
											<CommonInput inputProps={{ ...field }} type="number" placeholder="Number of Senior Citizens" />
										</FormControl>
										<FormMessage className="text-[10px]" />
									</FormItem>
								)}
							/>

							<div className="flex gap-2 justify-end">
								<DialogClose>
									<Button
										type="button"
										variant={'outline'}
										className="flex gap-2 mt-4"
										disabled={isPending}
									>
										<span>Cancel</span>
									</Button>
								</DialogClose>
								<Button
									type="submit"
									className="flex gap-2 mt-4"
									disabled={isPending}
								>
									{isPending &&
										<Loader2 size={20} className="animate-spin" />
									}
									<span>Update</span>
								</Button>
							</div>
						</form>
					</Form>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}
