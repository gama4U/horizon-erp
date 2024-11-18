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
import { Loader2, Package, Pencil } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import CommonInput from "@/components/common/input";
import { IPackageAirfare, IUpdatePackageAirfare } from "@/interfaces/package.interface";
import { updatePackageAirfare } from "@/api/mutations/package.mutation";

const formSchema = z.object({
  airline: z.string().trim().min(1, {
    message: "Airline is required"
  }),
  flightDetails: z.string().trim().min(1, {
    message: "Flight details is required"
  })
});

interface Props {
  data: IPackageAirfare;
}

export default function UpdatePackageAirfareDialog({data}: Props) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      airline: '',
      flightDetails: ''
    }
  });

  const { mutate: updateMutate, isPending } = useMutation({
    mutationFn: async (data: IUpdatePackageAirfare) => await updatePackageAirfare(data),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['package-details'] })
      form.reset();
      setOpen(false);
      toast.success("Package airfare updated successfully", {
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
    updateMutate({
      id: data.id,
      ...values,
    });
  }

  useEffect(() => {
    if (data) {
      form.reset({
        airline: data.airline,
        flightDetails: data.flightDetails
      })
    }
  }, [data]);

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogTrigger>
        <Button size={'icon'} variant={'ghost'} className="hover:text-primary">
          <Pencil size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[600px] max-h-[560px] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package size={24} />
            <p className="flex-1 truncate">
              Update package airfare
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
                <span>Save</span>
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
