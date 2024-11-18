import { Check, ChevronsUpDown, FilePenLine, Loader2, Pencil } from "lucide-react";
import { Button } from "../../ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ISalesAgreement, IUpdateSalesAgreement } from "../../../interfaces/sales-agreement.interface";
import { updateSalesAgreement } from "../../../api/mutations/sales-agreement.mutation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Currency } from "@/interfaces/sales-agreement-item.interface";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import useDebounce from "@/hooks/useDebounce";
import { fetchClients } from "@/api/queries/clients.query";
import { useAuth } from "@/providers/auth-provider";
import { OfficeBranch } from "@/interfaces/user.interface";

const formSchema = z.object({
  clientId: z.string().min(1, {
    message: 'Client is required'
  }),
  currency: z.enum([Currency.PHP, Currency.USD]),
})

const currencyMap: Record<Currency, string> = {
  PHP: 'Philippine Peso (PHP)',
  USD: 'US Dollar (USD)'
}

interface Props {
  data: ISalesAgreement;
}

export default function EditSalesAgreementDialog({ data }: Props) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [clientSearch, setClientSearch] = useState('');
  const debouncedSearch = useDebounce(clientSearch, 300);
  const { branch } = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (data) {
      form.reset({
        ...data,
      })
    }
  }, [data]);

  const { data: clients } = useQuery({
    queryKey: ['clients', debouncedSearch, branch],
    queryFn: async () => await fetchClients({ search: debouncedSearch, branch: branch as OfficeBranch }),
  })

  const { mutate: updateMutate, isPending } = useMutation({
    mutationFn: async (data: IUpdateSalesAgreement) => await updateSalesAgreement(data),
    onSuccess: (data) => {
      if (location.pathname === '/admin/sales-agreements') {
        queryClient.refetchQueries({ queryKey: ['sales-agreements'] })
      } else {
        queryClient.refetchQueries({ queryKey: ['sales-agreement-details'] })
      }
      form.reset();
      setOpen(false);
      toast.success(data.message, {
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
      salesAgreementId: data.id,
      ...values
    })
  }

  function renderSelectedCompany(clientId?: string) {
    if (!clientId) return "Select client";

    const client = clients?.clientsData.find((client) => client.id === clientId);
    if (!client) return "Select client";

    const department = client?.department ? ` - ${client.department}` : '';
    return `${client?.name} ${department}`;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button size={'icon'} variant={'ghost'} className="hover:text-primary">
          <Pencil size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FilePenLine size={24} className="text-secondary" />
            Edit sales agreement
          </DialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Client</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between text-[12px]",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {renderSelectedCompany(field.value)}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[450px] p-0">
                        <Command shouldFilter={false}>
                          <CommandInput
                            className="text-[12px]"
                            onValueChange={(value) => setClientSearch(value)}
                            placeholder="Search client..."
                          />
                          <CommandList className="w-full">
                            <CommandEmpty>No client found.</CommandEmpty>
                            <CommandGroup>
                              {clients?.clientsData.map((client, index) => (
                                <CommandItem
                                  value={client.id}
                                  key={index}
                                  onSelect={() => {
                                    form.setValue("clientId", client.id)
                                  }}
                                  className="text-[12px]"
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      client.id === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  <span>{client.name}</span>
                                  {client.department &&
                                    <span className="ml-1 text-muted-foreground text-[12px]"> - {client.department}</span>
                                  }
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
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
