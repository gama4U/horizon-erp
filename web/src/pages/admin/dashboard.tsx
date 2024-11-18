import { fetchClientsSummary, IClientSummary } from "@/api/queries/clients.query";
import { fetchDtsSummary } from "@/api/queries/document-transaction.query";
import { fetchMemorandumSummary } from "@/api/queries/memorandums.query";
import { fetchPurchaseRequestSummary } from "@/api/queries/purchase-request.queries";
import { fetchSalesAgreementSummary } from "@/api/queries/sales-agreements.queries";
import { fetchTransactionsSummary } from "@/api/queries/transaction";
import AnimatedDiv from "@/components/animated/Div";
import Loader from "@/components/animated/Loader";
import { DashboardCard } from "@/components/cards/admin";
import { TransactionChart } from "@/components/charts/bar-chart";
import { DatePickerWithRange } from "@/components/common/date-range-picker";
import TopBar from "@/components/section/topbar";
import { useAuth } from "@/providers/auth-provider";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { startOfMonth, endOfMonth } from 'date-fns';
import { fetchSuppliersSummary, ISupplierSummary } from "@/api/queries/suppliers.query";
import { ClientPieChart } from "@/components/charts/pie/client";
import { SupplierPieChart } from "@/components/charts/pie/supplier";
import { ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { session } = useAuth();
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>();
  const [pieChartDateRange, setPieChartDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  const [pieToggle, setPieToggle] = useState<'clients' | 'suppliers'>('clients')

  const togglePieChart = () => {
    if (pieToggle === 'suppliers') {
      setPieToggle('clients')
    }
    else {
      setPieToggle('suppliers')
    }
  }

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['transactions-summary', selectedDateRange],
    queryFn: async () => await fetchTransactionsSummary({
      from: selectedDateRange?.from,
      to: selectedDateRange?.to
    }),
  });

  const { data: salesAgreements, isLoading: salesLoading } = useQuery({
    queryKey: ['sales-agreement-summary'],
    queryFn: async () => await fetchSalesAgreementSummary(),
  });

  const { data: purchaseRequests, isLoading: purchaseLoading } = useQuery({
    queryKey: ['purchase-request-summary'],
    queryFn: async () => await fetchPurchaseRequestSummary(),
  });

  const { data: memorandums, isLoading: memorandumsLoading } = useQuery({
    queryKey: ['memorandums-summary'],
    queryFn: async () => await fetchMemorandumSummary(),
  });

  const { data: dts, isLoading: dtsLoading } = useQuery({
    queryKey: ['dts-summary'],
    queryFn: async () => await fetchDtsSummary(),
  });

  const { data: clients, isLoading: clientsLoading } = useQuery({
    queryKey: ['clients-summary', pieChartDateRange],
    queryFn: async () => {
      const startMonth = pieChartDateRange?.from ? pieChartDateRange.from.getMonth() + 1 : 1;
      const endMonth = pieChartDateRange?.to ? pieChartDateRange.to.getMonth() + 1 : 12;
      return await fetchClientsSummary(startMonth, endMonth);
    },
    enabled: !!pieChartDateRange,
  });

  const clientsData = clients?.map((client: IClientSummary) => ({
    month: client.month,
    count: client.desktop,
    calbayogCount: client.calbayogCount,
    cebuCount: client.cebuCount,
  })) || [];
  const { data: suppliers, isLoading: suppliersLoading } = useQuery({
    queryKey: ['suppliers-summary', pieChartDateRange],
    queryFn: async () => {
      const startMonth = pieChartDateRange?.from ? pieChartDateRange.from.getMonth() + 1 : 1;
      const endMonth = pieChartDateRange?.to ? pieChartDateRange.to.getMonth() + 1 : 12;
      return await fetchSuppliersSummary(startMonth, endMonth);
    },
    enabled: !!pieChartDateRange,
  });

  const suppliersData = suppliers?.map((supplier: ISupplierSummary) => ({
    month: supplier.month,
    count: supplier.desktop,
    calbayogCount: supplier.calbayogCount,
    cebuCount: supplier.cebuCount,
  })) || [];


  const handleDateChange = (range: DateRange | undefined) => {
    setSelectedDateRange(range);
  };


  const handlePieChartDateChange = (range: DateRange | undefined) => {
    setPieChartDateRange(range);
  };

  const isLoading = transactionsLoading || salesLoading || purchaseLoading || memorandumsLoading || dtsLoading || clientsLoading || suppliersLoading

  return (
    <div className="flex flex-col space-y-2 ">
      <TopBar
        LeftSideHeader={<p className="text-sm">Good day, {session.user?.firstName}</p>}
        LeftSideSubHeader={<p className="text-primary text-xs">Overview of today's activities and transactions.</p>}
      />
      {isLoading && <Loader isLoading={true} />}
      <div className="bg-white flex-1 rounded-lg overflow-hidden p-4 md:p-6">
        <AnimatedDiv animationType="FadeInFromUp" className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <DashboardCard title="Transaction Vouchers" value={transactions?.total ?? 0} showRate={true} rate={transactions?.rate} shortLabel="Last 7 days" calbayogCount={transactions?.calbayogCount} cebuCount={transactions?.cebuCount} />
          <DashboardCard title="Sales Agreements" value={salesAgreements?.total ?? 0} showRate={true} rate={salesAgreements?.rate} shortLabel="Last 7 days" cebuCount={salesAgreements?.cebuCount} calbayogCount={salesAgreements?.calbayogCount} />
          <DashboardCard title="Purchase Requests" value={purchaseRequests?.total ?? 0} showRate={true} rate={purchaseRequests?.rate} shortLabel="Last 7 days" cebuCount={purchaseRequests?.cebuCount} calbayogCount={purchaseRequests?.calbayogCount} />
          <DashboardCard title="Memorandum" value={memorandums?.total ?? 0} showRate={true} rate={memorandums?.rate} shortLabel="Last 7 days" cebuCount={memorandums?.cebuCount} calbayogCount={memorandums?.calbayogCount} />
          <DashboardCard title="Document Transactions" value={dts?.total ?? 0} showRate={true} rate={dts?.rate} shortLabel="Last 7 days" cebuCount={dts?.cebuCount} calbayogCount={dts?.calbayogCount} />
        </AnimatedDiv>

        <div className="flex flex-col md:flex-row lg:flex-row gap-2 p-2 mt-2">
          <div className="w-full">
            <DatePickerWithRange onDateChange={handleDateChange} />
            <div className="w-full flex flex-col lg:flex-row space-x-4 lg:justify-between items-start space-y-4 lg:space-y-0">
              <div className="w-full ">
                {isLoading ? (
                  <div className="w-full rounded-lg bg-white h-[300px] md:h-[400px]"></div>
                ) : (
                  <TransactionChart
                    enrichedTransactions={transactions?.enrichedTransactions ?? []}
                    selectedDateRange={selectedDateRange}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="gap-2 flex flex-col relative">
            <Button variant="outline" size="icon" className="absolute top-14 right-4" onClick={togglePieChart}>
              <ArrowRightLeft size={16} />
            </Button>
            <DatePickerWithRange onDateChange={handlePieChartDateChange} />
            {pieToggle === 'clients' &&
              <ClientPieChart clientsData={clientsData ?? []} />
            }
            {pieToggle === 'suppliers' &&
              <SupplierPieChart suppliersData={suppliersData ?? []} />
            }
          </div>
        </div>
      </div>
    </div>
  );
}
