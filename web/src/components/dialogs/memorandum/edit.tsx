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
import { IUpdateMemorandum, updateMemorandum } from "@/api/mutations/memorandum.mutation";
import { IMemorandum } from "@/api/queries/memorandums.query";
import React, { Suspense, useEffect, useState } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js'


const Editor = React.lazy(() =>
	import('react-draft-wysiwyg').then((mod) => ({ default: mod.Editor }))
);


interface IUpdateMemorandumProps {
	memorandumData: IMemorandum
	openDialog: boolean;
	setOpenDialog: (open: boolean) => void;
}

const formSchema = z.object({
	to: z.string().trim().min(1, {
		message: "To is required",
	}),
	subject: z.string().min(1, {
		message: "Subject is required",
	}),
}
);

export default function UpdateMemorandumDialog({ openDialog, setOpenDialog, memorandumData }: IUpdateMemorandumProps) {
	const queryClient = useQueryClient();
	const [editorState, setEditorState] = useState(() => EditorState.createEmpty())

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});

	const handleOnEditorStateChange = (editorState: EditorState) => {
		setEditorState(editorState)
	}

	const { mutate: updateMemoMutate, isPending: updatingMemo } = useMutation({
		mutationFn: async (data: IUpdateMemorandum) => await updateMemorandum(data),
		onError: (error) => {
			toast.error(error.message, {
				className: "text-destructive",
				position: "top-center",
			});
		},
		onSuccess: () => {
			queryClient.refetchQueries({ queryKey: ["memorandum-details"] });
			queryClient.refetchQueries({ queryKey: ["memorandums"] });
			setOpenDialog(false);
			form.reset();
			toast.custom(() => <CommonToast message="Successfully updated memorandum" />, {
				position: "bottom-right",
				duration: 2500
			});
		},
	});

	useEffect(() => {
		if (memorandumData) {
			form.reset({
				to: memorandumData.to,
				subject: memorandumData.subject,
			})
			const contentState = convertFromRaw(JSON.parse(memorandumData.contents as string));
			const editorState = EditorState.createWithContent(contentState);
			setEditorState(editorState);
		}
	}, [form, memorandumData])

	function onSubmit(values: z.infer<typeof formSchema>) {
		const contentState = editorState.getCurrentContent()
		const contents = JSON.stringify(convertToRaw(contentState))
		updateMemoMutate({
			id: String(memorandumData.id),
			contents,
			...values
		});
	}

	return (
		<Dialog open={openDialog} onOpenChange={() => { setOpenDialog(false); }}>
			<DialogContent className="max-w-[800px] max-h-[700px] overflow-auto">
				<DialogTitle>
					<DialogHeader className="flex flex-row items-center gap-x-2">
						<StickyNote className="text-secondary" />
						Update Memorandum
					</DialogHeader>
				</DialogTitle>
				<Separator />
				<div className="space-y-8 p-4">
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
									<Button type="submit" className="text-xs" disabled={updatingMemo}>
										{updatingMemo ? (
											<div className="flex flex-row items-center gap-x-2">
												<p className="text-xs">Updating...</p>
												<Loader2 className="animate-spin" />
											</div>
										) : (
											<p className="text-xs">Update</p>
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
