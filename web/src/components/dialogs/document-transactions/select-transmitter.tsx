import { CircleCheck, Loader2, Users } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { IDocumentTransaction } from "@/api/queries/document-transaction.query";
import useDebounce from "@/hooks/useDebounce";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUsers } from "@/api/queries/user.query";
import AnimatedDiv from "@/components/animated/Div";
import CommonInput from "@/components/common/input";
import Lottie from "lottie-react";
import skeletonLoader from "../../../assets/loaders/skeleton.json"
import { IUser } from "@/interfaces/user.interface";
import UserDetails from "@/components/section/user/details";
import { IUpdateDocumentTransaction, updateDocumentTransaction } from "@/api/mutations/document-transaction.mutation";
import { toast } from "sonner";
import CommonToast from "@/components/common/toast";
import { Button } from "@/components/ui/button";


interface ISelectTransmitterDialogProps {
	existingUser: IDocumentTransaction
	openDialog: boolean;
	setOpenDialog: (open: boolean) => void;
	id: string
}

export default function SelectTransmitterDialog({ openDialog, setOpenDialog, existingUser, id }: ISelectTransmitterDialogProps) {
	const queryClient = useQueryClient()
	const [search, setSearch] = useState('')
	const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
	const debouncedSearch = useDebounce(search, 500);

	const { data, isLoading } = useQuery({
		queryKey: ['users', debouncedSearch],
		queryFn: async () => await fetchUsers({
			search: debouncedSearch
		})
	});

	const { mutate: updateMutate, isPending: updating } = useMutation({
		mutationFn: async (data: IUpdateDocumentTransaction) => await updateDocumentTransaction(data),
		onError: (error) => {
			toast.error(error.message, {
				className: "text-destructive",
				position: "top-center",
			});
		},
		onSuccess: () => {
			queryClient.refetchQueries({ queryKey: ["document-transactions"] });
			queryClient.refetchQueries({ queryKey: ["document-transaction-details"] });
			toast.custom(() => <CommonToast message="Successfully updated document" />, {
				position: "bottom-right",
				duration: 2500
			});
			setOpenDialog(false)
		},
	});

	const handleUpdateDocument = () => {
		updateMutate({
			id,
			transmittedById: selectedUser?.id
		})
	}

	const handleSelectUser = (user: IUser) => {
		setSelectedUser(user);
	};
	return (
		<Dialog open={openDialog} onOpenChange={() => setOpenDialog(false)}>
			<DialogContent className="max-w-[520px] max-h-[90vh] overflow-y-auto rounded-[25px] p-6">
				<DialogTitle>
					<DialogHeader className="flex flex-row items-center gap-x-2 justify-between mt-2">
						<div className="flex flex-row gap-x-2 items-center">
							<Users />
							Select Assignee
						</div>

						{selectedUser &&
							<Button className="text-xs" disabled={updating} onClick={handleUpdateDocument}>
								{updating ? (
									<div className="flex flex-row items-center gap-x-2">
										<p className="text-xs">Assigning...</p>
										<Loader2 className="animate-spin" />
									</div>
								) : (
									<p className="text-xs">Assign</p>
								)}
							</Button>}
					</DialogHeader>
				</DialogTitle>
				<Separator />
				<AnimatedDiv animationType="SlideInFromLeft" slideEntrancePoint={-20}>
					<div className="flex flex-row justify-center">
						<div className="w-full">
							<div className="flex flex-1 gap-2 items-center p-[1px] border-b pb-2">
								<CommonInput
									placeholder="Search by user name"
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
								data?.users?.slice(0, 3).map((user, index) => (
									<div
										className={`my-2 relative border-[1px]  cursor-pointer hover:bg-green-100 
												${existingUser?.id === user.id ? 'border-green-500 bg-green-100' : 'border-dotted'}`}
										key={index}
										onClick={() => handleSelectUser(user)}
									>
										{selectedUser?.id === user.id && (
											<div className="absolute top-4 right-4 text-green-500">
												<AnimatedDiv animationType="Glowing" repeatDelay={0.5}>
													<CircleCheck size={24} />
												</AnimatedDiv>
											</div>
										)}
										<UserDetails userData={user} />
									</div>
								))
							)}
						</div>
					</div>
				</AnimatedDiv>

			</DialogContent>
		</Dialog>
	);
}
