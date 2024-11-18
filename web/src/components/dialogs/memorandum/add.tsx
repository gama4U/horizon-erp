import { Loader2, StickyNote } from "lucide-react";
import { z } from "zod";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
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
import { createMemorandum, ICreateMemorandum } from "@/api/mutations/memorandum.mutation";
import React, { Suspense, useState } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { EditorState, convertToRaw } from 'draft-js'
import { useAuth } from "@/providers/auth-provider";
import { OfficeBranch } from "@/interfaces/user.interface";

const Editor = React.lazy(() =>
	import('react-draft-wysiwyg').then((mod) => ({ default: mod.Editor }))
);

interface ICreateMemorandumProps {
	openDialog: boolean;
	creatorId: string;
	setOpenDialog: (open: boolean) => void;
	successNavigate: (data: any) => void
}

const formSchema = z.object({
	to: z.string().trim().min(1, {
		message: "To is required",
	}),
	subject: z.string().trim().min(1, {
		message: "Subject is required",
	}),
}
);

export default function CreateMemorandumDialog({ openDialog, setOpenDialog, creatorId, successNavigate }: ICreateMemorandumProps) {
	const queryClient = useQueryClient();
	const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
	const { branch } = useAuth()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});

	const handleOnEditorStateChange = (editorState: EditorState) => {
		setEditorState(editorState)
	}

	const { mutate: createMemoMutate, isPending: creatingMemo } = useMutation({
		mutationFn: async (data: ICreateMemorandum) => await createMemorandum(data),
		onError: (error) => {
			toast.error(error.message, {
				className: "text-destructive",
				position: "top-center",
			});
		},
		onSuccess: (data) => {
			queryClient.refetchQueries({ queryKey: ["memorandums"] });
			setOpenDialog(false);
			form.reset();
			toast.custom(() => <CommonToast message="Successfully created memorandum" />, {
				position: "bottom-right",
				duration: 2500,
			});
			successNavigate(data)
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		const contentState = editorState.getCurrentContent()
		const contents = JSON.stringify(convertToRaw(contentState))
		createMemoMutate({
			creatorId,
			contents,
			branch: branch as OfficeBranch,
			...values
		});
	}

	return (
		<Dialog open={openDialog} onOpenChange={(value) => setOpenDialog(value)}>
			<DialogContent className="max-w-[800px] max-h-[700px] overflow-auto">
				<DialogTitle>
					<DialogHeader className="flex flex-row items-center gap-x-2">
						<StickyNote className="text-secondary" />
						Create Memorandum
					</DialogHeader>
				</DialogTitle>
				<Separator />
				<div className="space-y-8">
					<AnimatedDiv animationType="SlideInFromLeft" slideEntrancePoint={-20}>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
								<FormField
									control={form.control}
									name="to"
									render={({ field }) => (
										<FormItem>
											<div className="flex flex-row items-center justify-between gap-x-2">
												<p className="text-xs w-1/3">To:</p>
												<FormControl className="w-2/3">
													<CommonInput
														inputProps={{ ...field }}
														placeholder="e.g. John Doe"
														containerProps={{ className: 'text-xs' }}
													/>
												</FormControl>
											</div>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="subject"
									render={({ field }) => (
										<FormItem>
											<div className="flex flex-row items-center justify-between gap-x-2">
												<p className="text-xs w-1/3">Subject:</p>
												<FormControl className="w-2/3">
													<CommonInput
														inputProps={{ ...field }}
														placeholder="Enter subject"
														containerProps={{ className: 'text-xs' }}
													/>
												</FormControl>
											</div>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className="w-full min-h-[300px] max-h-[300px] h-full border border-gray-200 rounded-md p-3 flex flex-col">
									<Suspense fallback={<div>Loading editor...</div>}>
										<Editor
											editorState={editorState}
											onEditorStateChange={
												handleOnEditorStateChange
											}
											editorClassName="p-1 h-full max-h-full"
											wrapperClassName="w-full h-full max-h-full overflow-auto"
											placeholder="Begin typing..."
										/>
									</Suspense>
								</div>

								<div className="flex flex-row items-center gap-x-2 justify-end">
									<Button type="submit" className="text-xs" disabled={creatingMemo}>
										{creatingMemo ? (
											<div className="flex flex-row items-center gap-x-2">
												<p className="text-xs">Creating...</p>
												<Loader2 className="animate-spin" />
											</div>
										) : (
											<p className="text-xs">Create</p>
										)}
									</Button>
								</div>
							</form>
						</Form>
					</AnimatedDiv>
				</div>
			</DialogContent>
		</Dialog>
	);
}
