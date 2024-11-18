import { useParams } from "react-router-dom";
import TopBar from "@/components/section/topbar";
import { useQuery } from "@tanstack/react-query";
import { fetchTransaction } from "@/api/queries/transaction";
import TravelVoucher from "@/components/section/transaction/travel-voucher";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import SelectSalesAgreementDialog from "@/components/dialogs/transaction/horizon-only/sales-agreement";
import SelectPurchaseRequestDialog from "@/components/dialogs/transaction/horizon-only/purchase-request-order";
import { Car, Hotel, MapPin, PlaneIcon } from "lucide-react";
import Loader from "@/components/animated/Loader";
import AddAccommodationVoucherDialog from "@/components/dialogs/transaction/accommodation-voucher/add";
import AccommodationVoucher from "@/components/section/transaction/accommodation-voucher";
import TourVoucher from "@/components/section/transaction/tour-voucher";
import AddTravelVoucherDialog from "@/components/dialogs/transaction/travel-voucher/add";
import AddTransportVoucherDialog from "@/components/dialogs/transaction/transport-voucher/add";
import TransportVoucher from "@/components/section/transaction/transport-voucher";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import AddTourVoucherDialog from "@/components/dialogs/transaction/tour-voucher/add";
import PrintPreview from "@/components/section/transaction/print-preview";
import { tabs } from "@/components/section/transaction/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardPlus } from "lucide-react";
import SalesAgreementInfo from "@/components/section/sales-agreement/info";
import PurchaseRequestInfo from "@/components/section/purchase-request/info";
import SalesAgreementItems from "@/components/section/sales-agreement/items";
import PurchaseRequestItems from "@/components/section/purchase-request/items";
import { Accordion, AccordionItem, AccordionContent, AccordionTrigger } from "@/components/ui/accordion";
import ClientDetails from "@/components/section/transaction/lead";

export default function ManageTransaction() {
  const { id } = useParams();
  const [openAddTravelDialog, setOpenAddTravelDialog] = useState(false);
  const [openAddAccommodationDialog, setOpenAddAccommodationDialog] = useState(false);
  const [openAddTourDialog, setOpenAddTourDialog] = useState(false);
  const [openAddTransportDialog, setOpenAddTransportDialog] = useState(false);
  const [openSelectSalesAgreement, setOpenSelectSalesAgreement] = useState(false);
  const [openSelectPurchaseRequest, setOpenSelectPurchaseRequest] = useState(false);

  const { data: transaction, isLoading } = useQuery({
    queryKey: ["transaction", id],
    queryFn: async () => {
      if (!id) return null;
      return await fetchTransaction({ id });
    },
    enabled: !!id,
  });


  return (
    <div className="h-screen w-full flex flex-col space-y-2">
      <TopBar
        showBackButton
        LeftSideHeader={<p className="text-sm">Manage transaction</p>}
        LeftSideSubHeader={<p className="text-primary text-xs">Transaction ID: {transaction?.transactionNumber}</p>}
      />
      <div className="flex-1 flex flex-col md:flex-row gap-2">
        {isLoading ? (
          <Loader isLoading label="Fetching transaction details" />
        ) : (
          <>
            <div className="w-full md:w-1/2 h-full flex flex-col bg-white rounded-lg p-4">
              <Tabs defaultValue={tabs[0].value} className="flex-1">
                <TabsList className="grid grid-cols-5 md:grid-cols-5">
                  {tabs.map((tab, index) => (
                    <TabsTrigger key={index} value={tab.value} className="">
                      <p className="text-xs">{tab.label}</p>
                    </TabsTrigger>
                  ))}
                </TabsList>
                <TabsContent value={tabs[0].value} className="flex gap-y-2 flex-col">
                  {transaction?.client &&
                    <ClientDetails clientData={transaction.client} forSelection={true} />
                  }
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Sales Agreement</AccordionTrigger>
                      <AccordionContent>
                        <Card className="w-full p-4 border">
                          <CardContent className="p-0 justify-center border-none border-2 rounded-lg">
                            {transaction?.salesAgreement ?
                              <div>
                                <div className="flex justify-between items-center px-4">
                                  <p className="text-xs">Sales Agreement #: <span className="font-semibold">{transaction.salesAgreement.serialNumber}</span></p>
                                  <Button variant="outline" className="text-xs gap-x-2 text-primary" onClick={() => setOpenSelectSalesAgreement(true)}>
                                    Update
                                    <ClipboardPlus size={14} />
                                  </Button>
                                </div>
                                <SalesAgreementInfo data={transaction?.salesAgreement} />
                                <SalesAgreementItems
                                  data={transaction.salesAgreement.salesAgreementItems}
                                  salesAgreementId={transaction.salesAgreement.id}
                                />
                              </div>
                              :
                              <div className="rounded-lg border-[1px] h-[200px] flex flex-row items-center justify-center text-muted-foreground gap-2 hover:bg-green-50 cursor-pointer"
                                onClick={() => setOpenSelectSalesAgreement(true)}
                              >
                                <p className="text-xs">Add sales agreement</p>
                                <ClipboardPlus />
                              </div>}
                          </CardContent>
                        </Card>

                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>Purchase Request</AccordionTrigger>
                      <AccordionContent>
                        <Card className="w-full p-4">
                          <CardContent className="p-4 justify-center  rounded-lg">
                            {transaction?.purchaseOrder ?
                              <div>
                                <div className="flex justify-between items-center px-4">
                                  <p className="text-xs">Purchase Request Order #: <span className="font-semibold">{transaction.purchaseOrder.serialNumber}</span></p>
                                  <Button variant="outline" className="text-xs gap-x-2 text-primary" onClick={() => setOpenSelectPurchaseRequest(true)}>
                                    Update
                                    <ClipboardPlus size={14} />
                                  </Button>
                                </div>
                                <PurchaseRequestInfo data={transaction?.purchaseOrder} />
                                <PurchaseRequestItems data={transaction.purchaseOrder.purchaseOrderItems} purchaseRequestId={transaction.purchaseOrder.id} />
                              </div>
                              :
                              <div className="rounded-lg border-[1px] h-[200px] flex flex-row items-center justify-center text-muted-foreground gap-2 hover:bg-green-50 cursor-pointer"
                                onClick={() => setOpenSelectPurchaseRequest(true)}
                              >
                                <p className="text-xs">Add purchase request order</p>
                                <ClipboardPlus />
                              </div>}
                          </CardContent>
                        </Card>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </TabsContent>
                <TabsContent value={tabs[1].value} className="flex-1">
                  <div className="flex justify-end">
                    <Button variant="outline" className="text-xs gap-x-2 text-primary" onClick={() => setOpenAddTravelDialog(true)}>
                      Add
                      <PlaneIcon />
                    </Button>
                  </div>
                  {transaction?.travelVoucher?.length ? (
                    <TravelVoucher travelVoucher={transaction?.travelVoucher} />
                  ) : (
                    <div className="flex justify-center p-5">
                      <p className="text-gray-400 text-xs">Transaction does not include any travel voucher.</p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value={tabs[2].value} className="flex-1">
                  <div className="flex justify-end">
                    <Button variant="outline" className="text-xs gap-x-2 text-primary" onClick={() => setOpenAddAccommodationDialog(true)}>
                      Add
                      <Hotel />
                    </Button>
                  </div>
                  {transaction?.accommodationVoucher?.length ? (
                    <AccommodationVoucher accommodationVoucher={transaction?.accommodationVoucher} />
                  ) : (
                    <div className="flex justify-center p-5">
                      <p className="text-gray-400 text-xs">Transaction does not include any accommodation voucher.</p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value={tabs[3].value} className="flex-1">
                  <div className="flex justify-end">
                    <Button variant="outline" className="text-xs gap-x-2 text-primary" onClick={() => setOpenAddTourDialog(true)}>
                      Add
                      <MapPin />
                    </Button>
                  </div>
                  {transaction?.tourVoucher?.length ? (
                    <TourVoucher tourVoucher={transaction?.tourVoucher} />
                  ) : (
                    <div className="flex justify-center p-5">
                      <p className="text-gray-400 text-xs">Transaction does not include any tour voucher.</p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value={tabs[4].value} className="flex-1">
                  <div className="flex justify-end">
                    <Button variant="outline" className="text-xs gap-x-2 text-primary" onClick={() => setOpenAddTransportDialog(true)}>
                      Add
                      <Car />
                    </Button>
                  </div>
                  {transaction?.transportVoucher?.length ? (
                    <TransportVoucher transportVoucher={transaction?.transportVoucher} />
                  ) : (
                    <div className="flex justify-center p-5">
                      <p className="text-gray-400 text-xs">Transaction does not include any transport voucher.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
            <div className="w-full md:w-1/2 h-full bg-white rounded-lg overflow-hidden">
              {transaction && <PrintPreview data={transaction} />}
            </div>
          </>
        )}
      </div>

      <AddTravelVoucherDialog
        transactionId={String(id)}
        openDialog={openAddTravelDialog}
        setOpenDialog={setOpenAddTravelDialog}
      />
      <AddAccommodationVoucherDialog
        transactionId={String(id)}
        openDialog={openAddAccommodationDialog}
        setOpenDialog={setOpenAddAccommodationDialog}
      />
      <AddTourVoucherDialog
        transactionId={String(id)}
        openDialog={openAddTourDialog}
        setOpenDialog={setOpenAddTourDialog}
      />
      <AddTransportVoucherDialog
        transactionId={String(id)}
        openDialog={openAddTransportDialog}
        setOpenDialog={setOpenAddTransportDialog}
      />
      <SelectSalesAgreementDialog
        transactionId={String(id)}
        selectedSalesAgreement={transaction?.salesAgreement}
        openDialog={openSelectSalesAgreement}
        setOpenDialog={setOpenSelectSalesAgreement}
      />
      <SelectPurchaseRequestDialog
        transactionId={String(id)}
        selectedPurchaseRequestOrder={transaction?.purchaseOrder}
        openDialog={openSelectPurchaseRequest}
        setOpenDialog={setOpenSelectPurchaseRequest}
      />
    </div>
  );
}
