import { Check, ChevronsUpDown, FileEdit, Loader2, Pencil } from "lucide-react";
import { Button } from "../../ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import CommonInput from "../../common/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { DisbursementType, IPurchaseRequestOrder, IUpdatePurchaseRequest } from "@/interfaces/purchase-request.interface";
import { updatePurchaseRequest } from "@/api/mutations/purchase-request..mutation";
import Constants from "@/constants";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { fetchSuppliers } from "@/api/queries/suppliers.query";
import useDebounce from "@/hooks/useDebounce";
import { TypeOfClient } from "@/interfaces/sales-agreement.interface";
import { fetchSalesAgreements } from "@/api/queries/sales-agreements.queries";
import { useAuth } from "@/providers/auth-provider";
import { OfficeBranch } from "@/interfaces/user.interface";
import { Currency } from "@/interfaces/sales-agreement-item.interface";

const formSchema = z.object({
  supplierId: z.string().min(1, {
    message: 'Supplier id is required'
  }),
  salesAgreementId: z.string().nullable(),
  disbursementType: z.string().min(1, {
    message: 'Disbursement type is required'
  }),
  classification: z.string().min(1, {
    message: 'Classification is required'
  }),
  classificationType: z.string().min(1, {
    message: 'Classification type is required'
  }),
  currency: z.enum([Currency.PHP, Currency.USD]),
  other: z.string().optional(),
})

const clientTypesMap: Record<TypeOfClient, string> = {
  CORPORATE: 'Corporate',
  GROUP: 'Group',
  GOVERNMENT: 'Government',
  INDIVIDUAL: 'Individual',
  WALK_IN: 'Walk in',
}

const currencyMap: Record<Currency, string> = {
  PHP: 'Philippine Peso (PHP)',
  USD: 'US Dollar (USD)'
}

interface Props {
  data: IPurchaseRequestOrder;
}

export default function EditPurchaseRequestDialog({ data }: Props) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [supplierSearch, setSupplierSearch] = useState('');
  const debouncedSearch = useDebounce(supplierSearch, 200);
  const [salesAgreementSearch, setSalesAgreementSearch] = useState('');
  const debouncedSalesAgreementSearch = useDebounce(salesAgreementSearch, 200);
  const { branch } = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const selectedDisbursementType = form.watch('disbursementType');
  const selectedClassification = form.watch('classification');

  const { data: suppliers } = useQuery({
    queryKey: ['suppliers', debouncedSearch, branch],
    queryFn: async () => await fetchSuppliers({ search: debouncedSearch, branch: branch as OfficeBranch }),
  })

  const { data: salesAgreementsData } = useQuery({
    queryKey: ['sales-agreements', debouncedSalesAgreementSearch, branch],
    queryFn: async () => await fetchSalesAgreements({ search: debouncedSalesAgreementSearch, branch: branch as OfficeBranch }),
  })

  const { mutate: updateMutate, isPending } = useMutation({
    mutationFn: async (data: IUpdatePurchaseRequest) => await updatePurchaseRequest(data),
    onSuccess: (data) => {
      if (location.pathname === '/admin/purchase-requests') {
        queryClient.refetchQueries({ queryKey: ['purchase-requests'] })
      } else {
        queryClient.refetchQueries({ queryKey: ['purchase-request-details'] })
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

  useEffect(() => {
    if (data) {
      form.reset({
        ...data,
        other: data.other || ''
      })
    }
  }, [form, data]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateMutate({
      purchaseRequestId: data.id,
      ...values
    })
  }

  function renderSelectedCompany(supplierId?: string) {
    if (!supplierId) return "Select supplier";

    const supplier = suppliers?.suppliersData.find((supplier) => supplier.id === supplierId);
    if (!supplier) return "Select supplier";

    return supplier?.name;
  }

  function renderSelectedSalesAgreement(salesAgreementId?: string | null) {
    if (!salesAgreementId) return "Select sales agreement";

    const salesAgreement = salesAgreementsData?.salesAgreements.find((salesAgreement) => salesAgreement.id === salesAgreementId);
    if (!salesAgreement) return "Select sales agreement";

    return `${salesAgreement.serialNumber} - ${salesAgreement?.client.name} (${clientTypesMap[salesAgreement.client.clientType]})`;
  }

  const classifications = Constants.Disbursements.find(item => item.type === selectedDisbursementType)?.classifications || [];
  const classificationTypes = classifications.find(item => item.label === selectedClassification)?.types || [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button size={'icon'} variant={'ghost'} className="hover:text-primary">
          <Pencil size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[700px] max-h-[560px] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileEdit size={24} className="text-secondary" />
            Edit purchase request order
          </DialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="disbursementType"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-[12px]">Disbursement Type:</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-100 border-none text-[12px]">
                          <SelectValue placeholder="Select disbursement type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Constants.Disbursements.map((item, index) => (
                          <SelectItem
                            key={index}
                            value={item.type}
                            className="text-[12px]"
                          >
                            {item.type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
              {form.watch('disbursementType') === DisbursementType["Cost of Sales"] &&
                <FormField
                  control={form.control}
                  name="salesAgreementId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-[12px]">Sales agreement</FormLabel>
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
                              {renderSelectedSalesAgreement(field.value)}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[550px] p-0">
                          <Command shouldFilter={false}>
                            <CommandInput
                              className="text-[12px]"
                              onValueChange={(value) => setSalesAgreementSearch(value)}
                              placeholder="Search sales agreement..."
                            />
                            <CommandList className="w-full">
                              <CommandEmpty>No sales agreement found.</CommandEmpty>
                              <CommandGroup>
                                {salesAgreementsData?.salesAgreements.map((salesAgreement, index) => (
                                  <CommandItem
                                    value={salesAgreement.id}
                                    key={index}
                                    onSelect={() => {
                                      form.setValue("salesAgreementId", salesAgreement.id)
                                    }}
                                    className="text-[12px]"
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        salesAgreement.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    <div className="flex items-center gap-2">
                                      <span className="font-semibold">{salesAgreement.serialNumber}</span>
                                      <span> - </span>
                                      <span>{salesAgreement.client.name}</span>
                                      <span>{`(${clientTypesMap[salesAgreement.client.clientType]})`}</span>
                                    </div>
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
              }
              <FormField
                control={form.control}
                name="supplierId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-[12px]">Supplier</FormLabel>
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
                      <PopoverContent className="w-[550px] p-0">
                        <Command shouldFilter={false}>
                          <CommandInput
                            className="text-[12px]"
                            onValueChange={(value) => setSupplierSearch(value)}
                            placeholder="Search supplier..."
                          />
                          <CommandList className="w-full">
                            <CommandEmpty>No supplier found.</CommandEmpty>
                            <CommandGroup>
                              {suppliers?.suppliersData.map((supplier, index) => (
                                <CommandItem
                                  value={supplier.id}
                                  key={index}
                                  onSelect={() => {
                                    form.setValue("supplierId", supplier.id)
                                  }}
                                  className="text-[12px]"
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      supplier.id === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  <span>{supplier.name}</span>
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
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="classification"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-[12px]">Classification:</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-100 border-none text-[12px]">
                            <SelectValue placeholder="Select classification" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {classifications.length <= 0 && (
                            <div className="text-[12px] text-muted-foreground p-1">
                              <span>Empty</span>
                            </div>
                          )}
                          {classifications.map((item, index) => (
                            <SelectItem
                              key={index}
                              value={item.label}
                              className="text-[12px]"
                            >
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="classificationType"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-[12px]">Classification Type:</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-100 border-none text-[12px]">
                            <SelectValue placeholder="Select classification type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {classificationTypes.length <= 0 && (
                            <div className="text-[12px] text-muted-foreground p-1">
                              <span>Empty</span>
                            </div>
                          )}
                          {classificationTypes.map((item, index) => (
                            <SelectItem
                              key={index}
                              value={item.label}
                              className="text-[12px]"
                            >
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
              </div>
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

              <FormField
                control={form.control}
                name="other"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[12px]">Others:</FormLabel>
                    <FormControl>
                      <CommonInput inputProps={{ ...field }} placeholder="Others" />
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
