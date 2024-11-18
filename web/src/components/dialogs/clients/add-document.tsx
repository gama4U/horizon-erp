import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, X } from "lucide-react";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import { updateUserSignature } from "@/api/mutations/profile.mutation";

interface Props {
	action: "add" | "change";
}


export default function AddDocumentDialog({ action }: Props) {
	const inputFileRef = useRef<HTMLInputElement | null>(null);
	const [documentFile, setDocumentFile] = useState<File | null>(null);
	const [open, setOpen] = useState(false);
	// const queryClient = useQueryClient();

	// const { mutate: updateSignatureMutate, isPending: updating } = useMutation({
	// 	mutationFn: async (signature: string) => await updateUserSignature(signature),
	// 	onSuccess() {
	// 		toast.error("Signature updated successfully", {
	// 			position: "top-center",
	// 			className: "text-primary",
	// 		});
	// 		queryClient.refetchQueries({ queryKey: ["profile"] });
	// 		setOpen(false);
	// 		handleClear();
	// 	},
	// 	onError(error) {
	// 		toast.error(error.message, {
	// 			position: "top-center",
	// 			className: "text-destructive",
	// 		});
	// 	},
	// });

	// const { mutate: uploadFileMutate, isPending: uploading } = useMutation({
	// 	mutationFn: async (data: IUploadFile) => await uploadFile(data),
	// 	onSuccess(data) {
	// 		updateSignatureMutate(data.url);
	// 	},
	// 	onError(error) {
	// 		toast.error(error.message, {
	// 			position: "top-center",
	// 			className: "text-destructive",
	// 		});
	// 	},
	// });

	// const handleSave = () => {
	// 	const formData = new FormData();
	// 	if (!documentFile) return;
	// 	formData.append("file", documentFile);
	// };

	const handleClear = () => {
		setDocumentFile(null)
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setDocumentFile(file);
		}
	};

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		const file = event.dataTransfer.files?.[0];
		if (file) {
			setDocumentFile(file);
		}
	};


	return (
		<Dialog open={open} onOpenChange={(value) => setOpen(value)}>
			<DialogTrigger>
				<Button size={"sm"} className="gap-1 min-w-[80px]">
					<Plus size={16} />
					<span>{action === "add" ? "Add" : "Change"}</span>
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-[16px]">
						{action === "add" ? "Add signature" : "Change signature"}
					</DialogTitle>
				</DialogHeader>


				{documentFile ? (
					<div
						className="relative w-full h-[200px] border border-slate-300 bg-slate-100 flex justify-center items-center rounded-sm"
					>
						<img
							src={URL.createObjectURL(documentFile)}
						/>
						<Button
							className="absolute top-1 left-1 hover:border-slate-500 hover:text-slate-500"
							size={"icon"}
							variant={"outline"}
							onClick={handleClear}
						>
							<X size={18} />
						</Button>
					</div>
				) : (
					<div
						className="w-full h-[200px] border border-dashed border-slate-300 bg-slate-100 flex justify-center items-center rounded-sm cursor-pointer"
						onDrop={handleDrop}
						onDragOver={(e) => e.preventDefault()}
						onClick={() => inputFileRef.current?.click()}
					>
						<span className="text-[12px] text-primary">
							Click or drag and drop document here.
						</span>
					</div>
				)}

				<input
					hidden
					ref={inputFileRef}
					type="file"
					onChange={handleFileChange}
					accept="image/*"
				/>

			</DialogContent>
		</Dialog>
	);
}
