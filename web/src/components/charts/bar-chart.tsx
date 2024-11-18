import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { format, eachDayOfInterval } from "date-fns";
import { DateRange } from "react-day-picker";
import { EnrichedTransaction } from "@/api/queries/transaction";

type TransactionChartProps = {
	enrichedTransactions: EnrichedTransaction[];
	selectedDateRange: DateRange | undefined;
};

export function TransactionChart({
	enrichedTransactions,
	selectedDateRange
}: TransactionChartProps) {
	const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>(
		"travel"
	);

	const chartData = React.useMemo(() => {
		if (!selectedDateRange?.from || !selectedDateRange?.to) return [];

		const dateRange = eachDayOfInterval({
			start: selectedDateRange.from,
			end: selectedDateRange.to,
		}).map((date) => ({
			date: format(date, "yyyy-MM-dd"),
			travel: 0,
			accommodation: 0,
			tour: 0,
			transport: 0,
		}));

		return dateRange.map((dateEntry) => {
			const transactionsForDate = enrichedTransactions.filter(
				(transaction) =>
					format(new Date(transaction.createdAt), "yyyy-MM-dd") === dateEntry.date
			);

			if (transactionsForDate.length === 0) {
				return dateEntry;
			}

			const aggregatedCounts = transactionsForDate.reduce(
				(acc, transaction) => ({
					travel: acc.travel + transaction.voucherCounts.travel,
					accommodation: acc.accommodation + transaction.voucherCounts.accommodation,
					tour: acc.tour + transaction.voucherCounts.tour,
					transport: acc.transport + transaction.voucherCounts.transport,
				}),
				{ travel: 0, accommodation: 0, tour: 0, transport: 0 }
			);

			return {
				...dateEntry,
				...aggregatedCounts,
			};
		});
	}, [enrichedTransactions, selectedDateRange]);
	const chartConfig = {
		travel: {
			label: "Travel",
			color: "hsl(var(--chart-1))",
		},
		accommodation: {
			label: "Accommodation",
			color: "hsl(var(--chart-2))",
		},
		tour: {
			label: "Tour",
			color: "hsl(var(--chart-3))",
		},
		transport: {
			label: "Transport",
			color: "hsl(var(--chart-4))",
		},
	} satisfies ChartConfig;

	const total = React.useMemo(
		() => ({
			travel: chartData.reduce((acc, curr) => acc + curr.travel, 0),
			accommodation: chartData.reduce((acc, curr) => acc + curr.accommodation, 0),
			tour: chartData.reduce((acc, curr) => acc + curr.tour, 0),
			transport: chartData.reduce((acc, curr) => acc + curr.transport, 0),
		}),
		[chartData]
	);

	return (
		<Card className="border-none shadow-none bg-[#FFFFFF99]">
			<CardHeader className="flex flex-col items-stretch space-y-0  p-0 sm:flex-row">
				<div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
					<CardTitle>Transaction Voucher Summary</CardTitle>
				</div>
				<div className="flex space-x-2 p-2">
					{["travel", "accommodation", "tour", "transport"].map((key) => {
						const chart = key as keyof typeof chartConfig;
						const isActive = activeChart === chart;
						const activeTextColor = "text-white";
						const activeCircleBgColor = "bg-green-300";
						const activeTabBgColor = "hsl(var(--chart-2))";

						return (
							<button
								key={chart}
								data-active={isActive}
								className={`relative z-30 gap-x-2 flex flex-row items-center justify-center rounded-lg bg-white px-4 transition-all hover:shadow-lg active:scale-95 ${isActive ? activeTabBgColor : 'data-[active=true]:bg-muted/50'
									}`}
								onClick={() => setActiveChart(chart)}
								style={{
									backgroundColor: isActive ? activeTabBgColor : 'white',
								}}
							>
								<span
									className={`text-xs ${isActive ? activeTextColor : 'text-muted-foreground'}`}
								>
									{chartConfig[chart].label}
								</span>
								<div
									className={`flex items-center justify-center w-4 h-4 rounded-full text-xs font-medium text-center 
          ${isActive ? activeTextColor : 'text-black'}
          ${isActive ? activeCircleBgColor : 'bg-gray-200'}`}
								>
									{total[chart as keyof typeof total].toLocaleString()}
								</div>
							</button>
						);
					})}
				</div>
			</CardHeader>
			<CardContent className="px-2 sm:p-6">
				<ChartContainer
					config={chartConfig}
					className="aspect-auto h-[250px] w-full"
				>
					<BarChart
						data={chartData}
						margin={{ left: 12, right: 12 }}
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="date"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							minTickGap={32}
							tickFormatter={(value) => {
								const date = new Date(value);
								return date.toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
								});
							}}
						/>
						<ChartTooltip
							content={
								<ChartTooltipContent
									className="w-[150px]"
									labelFormatter={(value) => {
										return new Date(value).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
											year: "numeric",
										});
									}}
								/>
							}
						/>
						{Object.keys(chartConfig).map((key) => {
							const chartKey = key as keyof typeof chartConfig;
							return (
								<Bar
									key={chartKey}
									dataKey={chartKey}
									fill={`var(--color-${chartKey})`}
									className={activeChart !== chartKey ? "opacity-50" : ""}
								/>
							);
						})}
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
