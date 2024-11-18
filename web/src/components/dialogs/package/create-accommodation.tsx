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
import { MultiInput } from "@/components/common/multi-input";
import { ICreatePackageAccommodation } from "@/interfaces/package.interface";
import { Currency } from "@/interfaces/sales-agreement-item.interface";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createPackageAccommodation } from "@/api/mutations/package.mutation";
import Constants from "@/constants";

const formSchema = z.object({
  category: z.string().trim().min(1, {
    message: "Name is required"
  }),
  options: z.array(
    z.string().trim().min(1, {
      message: "Option item must not be empty"
    })
  ).refine(items => items.length > 0, {
    message: 'Please add at least one option'
  }),
  ratePerPerson: z.string().refine(value => {
    const numberValue = Number(value);
    return !isNaN(numberValue) && numberValue > 0;
  }, {
    message: 'Invalid rate'
  }),
  currency: z.enum([Currency.PHP, Currency.USD]),
});

const currencyMap: Record<Currency, string> = {
  PHP: 'Philippine Peso (PHP)',
  USD: 'US Dollar (USD)'
}

interface Props {
  packageId: string;
}

export default function CreatePackageAccommodationDialog({packageId}: Props) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const {HotelCategories} = Constants;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: '',
      options: [],
      currency: Currency.PHP
    }
  });

  const { mutate: createMutate, isPending } = useMutation({
    mutationFn: async (data: ICreatePackageAccommodation) => await createPackageAccommodation(data),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['package-details'] })
      form.reset();
      setOpen(false);
      toast.success("Package accommodation created successfully", {
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
      ratePerPerson: Number(values.ratePerPerson)
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
              Add package accommodation
            </p>
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} >
            <div className="w-full space-y-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Hotel category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-100 border-none text-[12px]">
                          <SelectValue placeholder="Select a hotel category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {HotelCategories.map((item, index) => (
                          <SelectItem
                            key={index}
                            value={item}
                            className="text-[12px]"
                          >
                            {item}
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
                name="options"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Hotel options</FormLabel>
                    <FormControl>
                      <MultiInput {...field} placeholder="Add options (Enter to add) "/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ratePerPerson"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Rate per person</FormLabel>
                    <FormControl>
                      <CommonInput inputProps={{ ...field }} type="number" placeholder="Rate per person" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency:</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-100 border-none text-[12px]">
                          <SelectValue placeholder="Select a currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(currencyMap).map(([value, label], index) => (
                          <SelectItem
                            key={index}
                            value={value}
                            className="text-[12px]"
                          >
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[10px]" />
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
