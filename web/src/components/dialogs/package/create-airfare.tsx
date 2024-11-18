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
import { Loader2, PackagePlus, Plus } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import CommonInput from "@/components/common/input";
import { ICreatePackageAirfare } from "@/interfaces/package.interface";
import { createPackageAirfare } from "@/api/mutations/package.mutation";

const formSchema = z.object({
  airline: z.string().trim().min(1, {
    message: "Airline is required"
  }),
  flightDetails: z.string().trim().min(1, {
    message: "Flight details is required"
  })
});

interface Props {
  packageId: string;
}

export default function CreatePackageAirfareDialog({packageId}: Props) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      airline: '',
      flightDetails: ''
    }
  });

  const { mutate: createMutate, isPending } = useMutation({
    mutationFn: async (data: ICreatePackageAirfare) => await createPackageAirfare(data),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['package-details'] })
      form.reset();
      setOpen(false);
      toast.success("Package airfare created successfully", {
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    createMutate({
      packageId,
      ...values,
    });
  }

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogTrigger>
        <Button size={'sm'} className="gap-1">
          <Plus size={16} />
          <span>Add</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[600px] max-h-[560px] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PackagePlus size={24} />
            <p className="flex-1 truncate">
              Add package airfare
            </p>
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} >
            <div className="w-full space-y-2">
              <FormField
                control={form.control}
                name="airline"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Airline</FormLabel>
                    <FormControl>
                      <CommonInput inputProps={{ ...field }} placeholder="Airline" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="flightDetails"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Flight Details</FormLabel>
                    <FormControl>
                      <CommonInput inputProps={{ ...field }} placeholder="Flight details" />
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
                <span>Add</span>
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
