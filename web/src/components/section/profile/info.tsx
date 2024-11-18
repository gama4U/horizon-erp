import { updateProfile } from "@/api/mutations/profile.mutation";
import CommonInput from "@/components/common/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { IUpdateUserProfile, IUser } from "@/interfaces/user.interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface Props {
  data: IUser;
}

const formSchema = z.object({
  firstName: z.string()
    .trim().min(1, { 
      message: "First name is required" 
    }),
  lastName: z.string()
    .trim().min(1, {
      message: "Last name is required"
    }),
  email: z.string()
    .email({ message: "Invalid email address" }),
});

export default function ProfileInfo({data}: Props) {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
    }
  });

  useEffect(() => {
    if (data) {
      form.reset({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      })
    }
  }, [data]);

  const {mutate: updateProfileMutate, isPending: updatingProfile} = useMutation({
    mutationFn: async(data: IUpdateUserProfile) => await updateProfile(data),
    onSuccess() {
      queryClient.refetchQueries({queryKey: ['profile']});
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
  })
 
  function onSubmit(values: z.infer<typeof formSchema>) {
    updateProfileMutate(values)
  }

  return (
    <div className="w-full border rounded-lg p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-[12px]">First name</FormLabel>
                <FormControl>
                  <CommonInput inputProps={{ ...field }} placeholder="First name"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-[12px]">Last name</FormLabel>
                <FormControl>
                  <CommonInput inputProps={{ ...field }} placeholder="Last name"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[12px]">Email</FormLabel>
                <FormControl>
                  <CommonInput inputProps={{ ...field }} placeholder="Email"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2 justify-end">
            <Button 
              size={'sm'}
              type="button" 
              variant={'outline'}
              className="flex gap-2 mt-4 w-[80px]"
              disabled={updatingProfile}
            >
              <span>Cancel</span>
            </Button>
            <Button 
              size={'sm'}
              type="submit" 
              className="flex gap-2 mt-4 w-[80px]"
              disabled={updatingProfile}
            >
              {updatingProfile && 
                <Loader2 size={20} className="animate-spin"/>
              }
              <span>Save</span>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

