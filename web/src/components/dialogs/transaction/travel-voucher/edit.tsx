import { z } from "zod"
import { format } from "date-fns"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { CalendarIcon, Loader2 } from "lucide-react"
import { Button } from "../../../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../ui/dialog"
import { Separator } from "../../../ui/separator"
import { ITravelVoucher, TravelVoucherType } from "../../../../interfaces/travel.interface"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../../ui/form"
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "../../../ui/select"
import CommonInput from "../../../common/input"
import { Popover, PopoverContent, PopoverTrigger } from "../../../ui/popover"
import { Calendar } from "../../../ui/calendar"
import AnimatedDiv from "../../../animated/Div"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { IUpdateTravelVoucher, updateTravelVoucher } from "../../../../api/mutations/transaction.mutation"
import { toast } from "sonner"
import { useEffect } from "react"

interface UpdateTravelVoucherProps {
  openDialog: boolean
  setOpenDialog: (open: boolean) => void
  travelVoucher: ITravelVoucher
}

const formSchema = z.object({
  type: z.enum([TravelVoucherType.AIRLINES, TravelVoucherType.SHIPPING
  ]),
  airline: z.object({
    name: z.string().min(1, { message: "Airline name is required" }),
    code: z.string().min(1, { message: "Airline code is required" }),
    etd: z.date({ required_error: "Estimated time of Departure is required" }),
    eta: z.date({ required_error: "Estimated time of Arrival is required" }),
    origin: z.string().min(1, { message: "Origin is required" }),
    destination: z.string().min(1, { message: "Destination code is required" }),
  }).optional(),
  shipping: z.object({
    name: z.string().min(1, { message: "Shipping name is required" }),
    voyageNumber: z.string().min(1, { message: "Voyage number is required" }),
    dateOfTravel: z.date({ required_error: "Date of travel is required" }),
    origin: z.string().min(1, { message: "Origin is required" }),
    destination: z.string().min(1, { message: "Destination code is required" }),
  }).optional(),
})
export default function EditTravelVoucherDialog({ travelVoucher, openDialog, setOpenDialog }: UpdateTravelVoucherProps) {

  const queryClient = useQueryClient()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
    },
  })
  const { mutate: updateTravelVoucherMutate, isPending: updatingTravelVoucher } = useMutation({
    mutationFn: async (data: IUpdateTravelVoucher) => updateTravelVoucher(data),
    onError: (error) => {
      toast.error(error.message, {
        className: 'text-destructive',
        position: 'top-center',
      })
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['transaction'] })
      setOpenDialog(false)
      form.reset();
      toast.success("Travel voucher successfully updated", {
        position: 'top-center',
        className: 'text-primary'
      });
    }
  })

  const selectedTravelType = useWatch({
    control: form.control,
    name: "type",
  })

  const travelTypes = [
    {
      label: 'Airlines',
      value: TravelVoucherType.AIRLINES
    },
    {
      label: 'Shipping',
      value: TravelVoucherType.SHIPPING
    },
  ]


  useEffect(() => {
    if (travelVoucher) {
      form.reset({
        type: travelVoucher.type,
        airline: travelVoucher.airline
          ? {
            name: travelVoucher.airline.name,
            code: travelVoucher.airline.code,
            origin: travelVoucher.airline.origin,
            destination: travelVoucher.airline.destination,
            etd: new Date(travelVoucher.airline.etd),
            eta: new Date(travelVoucher.airline.eta),
          }
          : undefined,
        shipping: travelVoucher.shipping
          ? {
            name: travelVoucher.shipping.name,
            voyageNumber: travelVoucher.shipping.voyageNumber,
            origin: travelVoucher.shipping.origin,
            destination: travelVoucher.shipping.destination,
            dateOfTravel: new Date(travelVoucher.shipping.dateOfTravel),
          }
          : undefined,
      });
    }
  }, [form, travelVoucher]);


  function onSubmit(values: z.infer<typeof formSchema>) {

    const updatePayload: any = {
      id: travelVoucher.id,
      type: values.type,
    };

    if (values.shipping) {
      updatePayload.shipping = {
        ...values.shipping,
        id: String(travelVoucher?.shipping?.id),
        dateOfTravel: new Date(values.shipping.dateOfTravel),
      };
    }

    if (values.airline) {
      updatePayload.airline = {
        ...values.airline,
        id: String(travelVoucher?.airline?.id),
        eta: new Date(values.airline.eta),
        etd: new Date(values.airline.etd),
      };
    }

    updateTravelVoucherMutate(updatePayload);
  }


  return (
    <Dialog
      open={openDialog}
      onOpenChange={() => {
        setOpenDialog(false)
        form.reset()
      }}>
      <DialogContent>
        <DialogTitle>
          <DialogHeader>
            Update Travel Voucher
          </DialogHeader>
        </DialogTitle>
        <Separator />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled>
                    <FormControl>
                      <SelectTrigger className="text-xs">
                        <SelectValue placeholder="Select travel type" className="text-xs" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {
                        travelTypes.map((travelType, index) => (
                          <SelectItem className="text-xs" key={index} value={travelType.value}>{travelType.label}</SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {
              selectedTravelType === TravelVoucherType.AIRLINES &&
              <AnimatedDiv animationType="SlideInFromLeft" className="space-y-2" slideEntrancePoint={-50} duration={0.1}>
                <FormField
                  control={form.control}
                  name="airline.name"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-row items-center justify-between gap-x-2">
                        <p className="text-xs w-1/3">Name:</p>
                        <FormControl className="w-2/3">
                          <CommonInput inputProps={{ ...field }} placeholder="e.g. Cebu Pacific, Philippine Airlines, etc" containerProps={{ className: 'text-xs' }} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="airline.code"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-row justify-between gap-x-2 items-center">
                        <p className="text-xs w-1/3">Code:</p>
                        <FormControl className="w-2/3">
                          <CommonInput inputProps={{ ...field }} placeholder="e.g. 5G, PR, Z2, etc" containerProps={{ className: 'text-xs' }} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="airline.origin"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-row justify-between gap-x-2 items-center">
                        <p className="text-xs w-1/3">Origin:</p>
                        <FormControl className="w-2/3">
                          <CommonInput inputProps={{ ...field }} placeholder="Enter origin" containerProps={{ className: 'text-xs' }} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="airline.destination"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-row justify-between gap-x-2 items-center">
                        <p className="text-xs w-1/3">Destination:</p>
                        <FormControl className="w-2/3">
                          <CommonInput inputProps={{ ...field }} placeholder="Enter destination" containerProps={{ className: 'text-xs' }} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="airline.etd"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-row justify-between gap-x-2 items-center">
                        <p className="text-xs w-1/3">ETD:</p>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl className="w-2/3">
                              <Button
                                variant={"outline"}
                                className={`w-full pl-3 text-left font-normal text-xs
                        ${!field.value && "text-muted-foreground"}`}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span className="text-xs">Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="text-xs w-auto p-0" align="start">
                            <Calendar
                              className="text-xs"
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="airline.eta"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-row justify-between gap-x-2 items-center">
                        <p className="text-xs w-1/3">ETA:</p>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl className="w-2/3">
                              <Button
                                variant={"outline"}
                                className={`w-full pl-3 text-left font-normal text-xs
                        ${!field.value && "text-muted-foreground"}`}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span className="text-xs">Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="text-xs w-auto p-0" align="start">
                            <Calendar
                              className="text-xs"
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AnimatedDiv>
            }
            {
              selectedTravelType === TravelVoucherType.SHIPPING &&
              <>
                <AnimatedDiv animationType="SlideInFromLeft" className="space-y-2" slideEntrancePoint={-50} duration={0.1}>
                  <FormField
                    control={form.control}
                    name="shipping.name"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-row items-center justify-between gap-x-2">
                          <p className="text-xs w-1/3">Name:</p>
                          <FormControl className="w-2/3">
                            <CommonInput inputProps={{ ...field }} placeholder="e.g. 5G, PR, Z2, etc" containerProps={{ className: 'text-xs' }} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shipping.voyageNumber"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-row justify-between gap-x-2 items-center">
                          <p className="text-xs w-1/3">Voyage Number:</p>
                          <FormControl className="w-2/3">
                            <CommonInput inputProps={{ ...field }} placeholder="e.g. V. 284, etc" containerProps={{ className: 'text-xs' }} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shipping.origin"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-row justify-between gap-x-2 items-center">
                          <p className="text-xs w-1/3">Origin:</p>
                          <FormControl className="w-2/3">
                            <CommonInput inputProps={{ ...field }} placeholder="Enter origin" containerProps={{ className: 'text-xs' }} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shipping.destination"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-row justify-between gap-x-2 items-center">
                          <p className="text-xs w-1/3">Destination:</p>
                          <FormControl className="w-2/3">
                            <CommonInput inputProps={{ ...field }} placeholder="Enter destination" containerProps={{ className: 'text-xs' }} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shipping.dateOfTravel"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-row justify-between gap-x-2 items-center">
                          <p className="text-xs w-1/3">Date of Travel:</p>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl className="w-2/3">
                                <Button
                                  variant={"outline"}
                                  className={`w-full pl-3 text-left font-normal text-xs
                        ${!field.value && "text-muted-foreground"}`}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span className="text-xs">Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="text-xs w-auto p-0" align="start">
                              <Calendar
                                className="text-xs"
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AnimatedDiv>
              </>
            }
            <div className="flex flex-row justify-end">
              {selectedTravelType &&
                <Button type="submit" className="text-xs" disabled={updatingTravelVoucher}>
                  {
                    updatingTravelVoucher ?
                      <div className="flex flex-row items-center gap-x-">
                        <p className="text-xs">Creating..</p>
                        <Loader2 className="animate-spin" />
                      </div> :
                      <p className="text-xs">Update</p>
                  }
                </Button>}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
