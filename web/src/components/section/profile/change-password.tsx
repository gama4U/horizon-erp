import { updateUserPassword } from "@/api/mutations/profile.mutation";
import CommonInput from "@/components/common/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { IChangeUserPassword } from "@/interfaces/user.interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  currentPassword: z.string()
    .trim().min(1, { 
      message: "Current password is required" 
    }),
  password: z.string()
    .trim().min(8, { 
      message: "Password must be at least 8 characters."
    })
    .refine(password => {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return passwordRegex.test(password);
    }, {
      message: 'Password must have uppercase, lowercase, number, and special characters (@$!%*?&).'
    }),
  confirmPassword: z.string()
    .trim().min(1, { 
      message: "Please confirm your password"
    }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});

export default function ChangePassword() {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: '',
      password: '',
      confirmPassword: '',
    }
  });

  const {mutate: updateMutate, isPending: updatingProfile} = useMutation({
    mutationFn: async(data: IChangeUserPassword) => await updateUserPassword(data),
    onSuccess() {
      queryClient.refetchQueries({queryKey: ['profile']});
      form.reset()
      toast.success('Password updated successfully', { 
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
    updateMutate(values)
  }

  return (
    <div className="w-full border rounded-lg">
      <div className="p-4">
        <h1 className="text-[14px] font-semibold">Change password</h1>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 p-4">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-[12px]">Current password</FormLabel>
                <FormControl>
                  <CommonInput inputProps={{ ...field }} type="password" placeholder="Current password"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-[12px]">New password</FormLabel>
                <FormControl>
                  <CommonInput inputProps={{ ...field }} type="password" placeholder="New password"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[12px]">Confirm new password</FormLabel>
                <FormControl>
                  <CommonInput inputProps={{ ...field }} type="password" placeholder="Confirm new password"/>
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

