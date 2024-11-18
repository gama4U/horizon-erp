import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eraser, Loader2, PenIcon, Plus, UploadCloud, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import SignaturePad from "react-signature-canvas";
import ReactSignatureCanvas from "react-signature-canvas";
import { uploadFile } from "@/api/mutations/upload.mutation";
import { IUploadFile } from "@/interfaces/upload.interface";
import { toast } from "sonner";
import { updateUserSignature } from "@/api/mutations/profile.mutation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Props {
  action: "add" | "change";
}

type TabType = 'draw-signature' | 'upload-signature';

export default function AddSignatureDialog({ action }: Props) {
  const canvasRef = useRef<ReactSignatureCanvas | null>(null);
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const [hasDraw, setHasDraw] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('draw-signature')
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: updateSignatureMutate, isPending: updating } = useMutation({
    mutationFn: async (signature: string) => await updateUserSignature(signature),
    onSuccess() {
      toast.error("Signature updated successfully", {
        position: "top-center",
        className: "text-primary",
      });
      queryClient.refetchQueries({ queryKey: ["profile"] });
      setOpen(false);
      handleClear();
    },
    onError(error) {
      toast.error(error.message, {
        position: "top-center",
        className: "text-destructive",
      });
    },
  });

  const { mutate: uploadFileMutate, isPending: uploading } = useMutation({
    mutationFn: async (data: IUploadFile) => await uploadFile(data),
    onSuccess(data) {
      updateSignatureMutate(data.url);
    },
    onError(error) {
      toast.error(error.message, {
        position: "top-center",
        className: "text-destructive",
      });
    },
  });

  const handleSave = () => {
    const formData = new FormData();
    
    switch (activeTab) {
      case 'draw-signature':
        if (!canvasRef.current || !hasDraw) return;
        const trimmedCanvas = canvasRef.current.getTrimmedCanvas();
        trimmedCanvas.toBlob((blob) => {
          if (!blob) return;
          formData.append("file", blob, "image/png");
          uploadFileMutate({ data: formData });
        });
        break;

      case 'upload-signature':
        if (!signatureFile) return;
        formData.append("file", signatureFile);
        uploadFileMutate({ data: formData });
        break;
    }
  };

  const handleClear = () => {
    setSignatureFile(null)
    canvasRef.current?.clear();
    setHasDraw(false)
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSignatureFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setSignatureFile(file);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as TabType)
    handleClear();
  }

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

        <Tabs 
          value={activeTab} 
          onValueChange={handleTabChange}
        >
          <TabsList className="w-full ">
            <TabsTrigger value="draw-signature" className="w-full gap-1">
              <PenIcon size={16} />
              Draw
            </TabsTrigger>
            <TabsTrigger value="upload-signature" className="w-full gap-1">
              <UploadCloud size={16} />
              Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="draw-signature" className="relative">
            <SignaturePad
              ref={canvasRef}
              onBegin={() => setHasDraw(true)}
              canvasProps={{
                width: 450,
                height: 200,
                className:
                  "bg-slate-100 border border-slate-300 rounded-sm cursor-pointer",
              }}
            />
            <Button
              className="absolute top-1 left-1 hover:border-slate-500 hover:text-slate-500"
              size={"icon"}
              variant={"outline"}
              onClick={handleClear}
            >
              <Eraser size={18} />
            </Button>
          </TabsContent>

          <TabsContent value="upload-signature">
            {signatureFile ? (
              <div
                className="relative w-full h-[200px] border border-slate-300 bg-slate-100 flex justify-center items-center rounded-sm"
              >
                <img 
                  className="h-full w-full object-cover"
                  src={URL.createObjectURL(signatureFile)}
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
                  Click or drag and drop image here.
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
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2">
          <DialogClose>
            <Button
              size={"sm"}
              type="button"
              variant={"outline"}
              className="flex gap-2 mt-4"
              disabled={uploading || updating}
            >
              <span>Cancel</span>
            </Button>
          </DialogClose>
          <Button
            size={"sm"}
            type="submit"
            className="flex gap-2 mt-4 w-[80px] cursor-pointer"
            onClick={handleSave}
            disabled={uploading || updating}
          >
            {uploading || updating && <Loader2 size={20} className="animate-spin" />}
            <span>Save</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
