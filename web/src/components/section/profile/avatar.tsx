import { updateAvatar } from "@/api/mutations/profile.mutation";
import { uploadFile } from "@/api/mutations/upload.mutation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IUploadFile } from "@/interfaces/upload.interface";
import { IUser } from "@/interfaces/user.interface";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import { toast } from "sonner";

interface Props {
  data?: IUser
}

export default function UserAvatar({ data }: Props) {
  const pictureInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const { mutate: updateAvatarMutate } = useMutation({
    mutationFn: async (avatarUrl: string) => await updateAvatar(avatarUrl),
    onSuccess() {
      queryClient.refetchQueries({ queryKey: ['profile'] });
      toast.success('Avatar uploaded successfully', {
        position: 'top-center',
        className: 'text-primary',
      })
    },
    onError(error) {
      toast.error(error.message, {
        position: 'top-center',
        className: 'text-destructive'
      })
    }
  });

  const { mutate: uploadFileMutate, isPending: savingProfilePicture } = useMutation({
    mutationFn: async (data: IUploadFile) => await uploadFile(data),
    onSuccess(data) {
      updateAvatarMutate(data.url);
      setAvatarFile(null);
    },
    onError(error) {
      toast.error(error.message, {
        position: 'top-center',
        className: 'text-destructive',
      })
    }
  });

  const handleChangePicture = () => {
    if (pictureInputRef) {
      pictureInputRef.current?.click();
    }
  }

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file)
    }
  }

  const handleCancelChangePicture = () => {
    setAvatarFile(null);
    if (pictureInputRef.current) {
      pictureInputRef.current.value = '';
    }
  }

  const handleSavePicture = () => {
    if (!avatarFile) return;
    const formData = new FormData();
    formData.append('file', avatarFile);
    uploadFileMutate({ data: formData });
  }

  return (
    <div className="w-full p-4 flex items-center gap-4 border rounded-lg">
      {avatarFile ? (
        <Avatar className="h-[80px] w-[80px] border">
          <AvatarImage
            src={URL.createObjectURL(avatarFile)}
            className="object-cover"
          />
        </Avatar>
      ) : (
        <Avatar className="h-[80px] w-[80px] border">
          <AvatarImage
            src={data?.avatar}
            className="object-cover"
          />
          <AvatarFallback className="text-[24px]">
            {data?.firstName[0]}
          </AvatarFallback>
        </Avatar>
      )}
      <div className="space-y-2">
        <h3 className="text-[14px] font-[600]">Profile avatar</h3>
        <div className="space-x-4">
          {avatarFile ? (
            <>
              <Button
                size={'sm'}
                className="w-[150px] gap-1"
                onClick={handleSavePicture}
                disabled={savingProfilePicture}
              >
                {savingProfilePicture && (
                  <Loader2 size={18} className="animate-spin" />
                )}
                <span>Save</span>
              </Button>
              <Button
                size={'sm'}
                variant={'outline'}
                className="w-[150px]"
                onClick={handleCancelChangePicture}
                disabled={savingProfilePicture}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              size={'sm'}
              className="w-[150px]"
              onClick={handleChangePicture}
            >
              {data?.avatar ? 'Change avatar' : 'Upload avatar'}
            </Button>
          )}
          <input
            ref={pictureInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            hidden
          />
        </div>
      </div>
    </div>
  )
}
