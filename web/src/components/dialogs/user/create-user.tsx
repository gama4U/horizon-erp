import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CircleX, Loader2, Plus, UserPlus } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ICreateUser, OfficeBranch, PermissionType, UserType } from "@/interfaces/user.interface";
import { createUser } from "@/api/mutations/user.mutation";
import { Button } from "@/components/ui/button";
import CommonInput from "@/components/common/input";

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
  userType: z.enum([
    UserType.ADMIN,
    UserType.EMPLOYEE,
  ]),
  permission: z.enum([
    PermissionType.SUPER_ADMIN,
    PermissionType.SUPERVISOR,
    PermissionType.ACCOUNTING,
    PermissionType.RESERVATION,
  ]),
  officeBranch: z.enum([
    OfficeBranch.CEBU,
    OfficeBranch.CALBAYOG
  ]),
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

const selectUserMap: Record<UserType, string> = {
  ADMIN: 'Admin',
  EMPLOYEE: 'Employee'
}

const userPermissionMap: Record<UserType, Record<PermissionType, string>> = {
  ADMIN: {
    SUPER_ADMIN: 'Super Admin',
    SUPERVISOR: 'Supervisor',
    ACCOUNTING: 'Accounting',
    [PermissionType.RESERVATION]: ""
  },
  EMPLOYEE: {
    RESERVATION: 'Reservation',
    [PermissionType.SUPER_ADMIN]: "",
    [PermissionType.SUPERVISOR]: "",
    [PermissionType.ACCOUNTING]: ""
  }
}

const userOfficeBranch: Record<OfficeBranch, string> = {
  CEBU: 'Cebu',
  CALBAYOG: 'Calbayog'
}

export default function CreateUserDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      userType: UserType.EMPLOYEE,
      officeBranch: OfficeBranch.CEBU,
      password: '',
      confirmPassword: ''
    }
  });

  const { mutate: createUserMutate, isPending } = useMutation({
    mutationFn: async (data: ICreateUser) => await createUser(data),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['users'] })
      form.reset();
      setOpen(false);
      toast.success("Users created successfully", {
        position: 'top-center',
        className: 'text-primary'
      });
    },
    onError: (error) => {
      toast.success(error.message, {
        position: 'top-center',
        className: 'text-destructive'
      });
    }
  });

  const selectedUserType = form.watch('userType');
  useEffect(() => {
    const currentPermission = form.getValues('permission');
    if (currentPermission) {
      form.resetField('permission')
    }
  }, [selectedUserType]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { confirmPassword, ...data } = values;

    if (data.password.trim() !== confirmPassword.trim()) {
      toast("Passwords are not the same!", {
        position: 'top-center',
        icon: <CircleX size={20} className="text-destructive" />
      });
      return;
    }

    if (values.userType === UserType.ADMIN && !values.permission) {
      form.setError('permission', {
        message: 'Permission is required for admin user',
      });
      return;
    }

    createUserMutate(data);
  }

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogTrigger>
        <Button size={'sm'} className="gap-1">
          <Plus size={16} />
          <span>Create</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[600px] max-h-[560px] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus size={24} />
            <p className="flex-1 truncate">
              Create new user
            </p>
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} >
            <div className="w-full space-y-2">
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <CommonInput inputProps={{ ...field }} placeholder="First name" />
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
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <CommonInput inputProps={{ ...field }} placeholder="Last name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <CommonInput inputProps={{ ...field }} placeholder="Email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full h-[40px] py-0 gap-[12px] text-muted-foreground bg-slate-100 border-none text-[12px]">
                          <SelectValue placeholder="Select user type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(selectUserMap)?.map(([value, label]) => {
                          return (
                            <SelectItem value={value} className="text-[12px] text-muted-foreground">
                              {label}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="permission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Permission</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ''}>
                      <FormControl>
                        <SelectTrigger className="w-full h-[40px] py-0 gap-[12px] text-muted-foreground bg-slate-100 border-none text-[12px]">
                          <SelectValue placeholder="Select permission" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(userPermissionMap[form.getValues('userType')])
                          .filter(([_, label]) => label !== '')
                          .map(([value, label]) => (
                            <SelectItem key={value} value={value} className="text-[12px] text-muted-foreground">
                              {label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="officeBranch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Office branch</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full h-[40px] py-0 gap-[12px] text-muted-foreground bg-slate-100 border-none text-[12px]">
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(userOfficeBranch)?.map(([value, label]) => {
                          return (
                            <SelectItem value={value} className="text-[12px] text-muted-foreground">
                              {label}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <CommonInput
                        inputProps={{ ...field }}
                        type={'password'}
                        placeholder="Password"
                      />
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
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <CommonInput
                        inputProps={{ ...field }}
                        type={'password'}
                        placeholder="Confirm password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
                <span>Create</span>
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
