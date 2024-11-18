import { FilePenLine, Loader2, Pencil } from "lucide-react";
import { Button } from "../../ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import CommonInput from "../../common/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { IPurchaseRequestOrderItem, IUpdatePurchaseRequestItem } from "@/interfaces/purchase-request-item.interface";
import { updatePurchaseRequestItem } from "@/api/mutations/purchase-request-item.mutation";
import { MultiInput } from "@/components/common/multi-input";

const formSchema = z.object({
  particulars: z.array(z.string().min(1, {
    message: 'Particular item should not be empty'
  })),
  quantity: z.string().refine(value => {
    const numberValue = Number(value);
    return !isNaN(numberValue) && numberValue > 0;
  }, {
    message: 'Invalid quantity'
  }),
  unitPrice: z.preprocess((value) => parseFloat(value as string), z.number().positive({
    message: 'Invalid unit price'
  })),
  total: z.number().refine(value => value > 0, {
    message: 'Invalid total'
  }),
});

interface Props {
  data: IPurchaseRequestOrderItem;
}

export default function EditPurchaseRequestItemDialog({ data }: Props) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      particulars: [],
    }
  });

  const quantity = form.watch('quantity');
  const unitPrice = form.watch('unitPrice');

  useEffect(() => {
    const total = (Number(quantity) * Number(unitPrice)).toFixed(2);
    form.setValue('total', Number(total));
  }, [quantity, unitPrice])

  useEffect(() => {
    if (data) {
      form.reset({
        particulars: data.particulars,
        quantity: String(data.quantity),
        unitPrice: Number(data.unitPrice),
        total: data.total,
      })
    }
  }, [data]);

  const { mutate: updateMutate, isPending } = useMutation({
    mutationFn: async (data: IUpdatePurchaseRequestItem) => await updatePurchaseRequestItem(data),
    onSuccess: (data) => {
      queryClient.refetchQueries({ queryKey: ['purchase-request-details'] })
      form.reset();
      setOpen(false);
      toast.success(data?.message, {
        position: 'top-center',
        className: 'text-primary'
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        position: 'top-center',
        className: 'text-destructive'
      })
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateMutate({
      id: data.id,
      particulars: values.particulars,
      quantity: Number(values.quantity),
      unitPrice: Number(values.unitPrice),
      total: Number(values.total)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Pencil size={16} className="cursor-pointer hover:text-primary" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FilePenLine size={24} className="text-secondary" />
            <span>
              Edit purchase request item
            </span>
          </DialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="particulars"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Particulars:</FormLabel>
                    <FormControl>
                      <MultiInput {...field} placeholder="Enter particulars" />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity:</FormLabel>
                    <FormControl>
                      <CommonInput inputProps={{ ...field }} type="number" placeholder="Quantity" />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unitPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit price:</FormLabel>
                    <FormControl>
                      <CommonInput inputProps={{ ...field }} type="number" placeholder="Unit price" />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="total"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total:</FormLabel>
                    <FormControl>
                      <CommonInput inputProps={{ ...field, readOnly: true }} type="number" placeholder="Total" />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
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
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
