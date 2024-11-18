import { z } from "zod"
import { format } from "date-fns"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { CalendarIcon, CircleCheck, Loader2, Plane, Ship } from "lucide-react"
import { Button } from "../../../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../ui/dialog"
import { Separator } from "../../../ui/separator"
import { TravelVoucherType } from "../../../../interfaces/travel.interface"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../../ui/form"
import CommonInput from "../../../common/input"
import { Popover, PopoverContent, PopoverTrigger } from "../../../ui/popover"
import { Calendar } from "../../../ui/calendar"
import AnimatedDiv from "../../../animated/Div"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createTravelVoucher, ICreateTravelVoucher } from "../../../../api/mutations/transaction.mutation"
import { toast } from "sonner"
import { useState } from "react"


interface AddTravelVoucherProps {
  transactionId: string
  openDialog: boolean
  setOpenDialog: (open: boolean) => void
}

const formSchema = z.object({
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
export default function AddTravelVoucherDialog({ transactionId, openDialog, setOpenDialog }: AddTravelVoucherProps) {

  const queryClient = useQueryClient()
  const [step, setStep] = useState(0)
  const [selectedType, setSelectedType] = useState<TravelVoucherType | undefined>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
    },
  })

  const { mutate: createTravelVoucherMutate, isPending: creatingTravelVoucher } = useMutation({
    mutationFn: async (data: ICreateTravelVoucher) => createTravelVoucher(data),
    onError: (error) => {
      toast.error(error.message, {
        className: 'text-destructive',
        position: 'top-center',
      })
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['transaction'] })
      setStep(0)
      setOpenDialog(false)
      form.reset();
      toast.success("Travel voucher successfully added", {
        position: 'top-center',
        className: 'text-primary'
      });
    }
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    createTravelVoucherMutate({
      type: selectedType,
      transactionId: transactionId,
      ...values
    })
  }
  const cardOptions = [
    {
      key: TravelVoucherType.AIRLINES,
      title: 'Airline',
      description: 'Create an airline travel type voucher',
      icon: <Plane size={82} className="text-muted-foreground" />
    },
    {
      key: TravelVoucherType.SHIPPING,
      title: 'Shipping',
      description: 'Create a shipping travel type voucher',
      icon: <Ship size={82} className="text-muted-foreground" />
    }
  ];
  const handleSelectCard = (option: TravelVoucherType) => {
    setSelectedType(option);
    setStep(1)
  };


  return (
    <Dialog
      open={openDialog}
      onOpenChange={() => {
        setSelectedType(undefined)
        setStep(0)
        setOpenDialog(false)
        form.reset()
      }}>
      <DialogContent>
        <DialogTitle>
          <DialogHeader className="flex flex-row items-center gap-x-2">
            Add Travel Voucher {selectedType && `- ${selectedType}`}
          </DialogHeader>
        </DialogTitle>
        <Separator />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {step === 0 &&
              <div className="flex gap-x-2 justify-between w-full">
                {cardOptions.map((card) => (
                  <AnimatedDiv
                    slideEntrancePoint={-20}
                    animationType="CardSpin"
                    key={card.key}
                    className={`relative rounded-lg p-4 border-[1px] my-2 shadow-lg cursor-pointer hover:bg-green-100 flex flex-col justify-between w-[50%] h-[200px] ${selectedType === card.key ? 'border-green-500 bg-green-100' : 'border-dotted'
                      }`}
                    onClick={() => handleSelectCard(card.key)}
                  >
                    {selectedType === card.key && (
                      <div className="absolute top-2 right-2 text-green-500">
                        <AnimatedDiv animationType="Glowing" repeatDelay={0.5}>
                          <CircleCheck size={24} />
                        </AnimatedDiv>
                      </div>
                    )}
                    <div className="flex flex-col items-start">
                      <p className="text-lg font-normal text-muted-foreground">{card.title}</p>
                      <p className="text-xs text-muted-foreground">{card.description}</p>
                    </div>
                    <div className="flex justify-end">
                      {card.icon}
                    </div>
                  </AnimatedDiv>
                ))}
              </div>
            }
            {(step === 1 &&
              selectedType === TravelVoucherType.AIRLINES) &&
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
                        <p className="text-xs w-1/3">Airline Flight Code:</p>
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
            {(step === 1 &&
              selectedType === TravelVoucherType.SHIPPING) &&
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
            {step === 1 &&
              <div className="flex flex-row justify-end gap-x-2">
                <Button type="button" className="text-xs bg-muted-foreground" onClick={() => {
                  form.reset()
                  setSelectedType(undefined)
                  setStep(0)
                }}>Back</Button>
                <Button type="submit" className="text-xs" disabled={creatingTravelVoucher}>
                  {
                    creatingTravelVoucher ?
                      <div className="flex flex-row items-center gap-x-">
                        <p className="text-xs">Creating..</p>
                        <Loader2 className="animate-spin" />
                      </div> :
                      <p className="text-xs">Create</p>
                  }
                </Button>
              </div>
            }
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
