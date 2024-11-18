import * as React from "react";
import { Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartConfig,
	ChartContainer,
	ChartStyle,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

interface SupplierPieChartProps {
	suppliersData: { month: string; count: number; calbayogCount: number; cebuCount: number }[];
}

const monthColors: { [key: string]: string } = {
	january: "#D1D5DB",
	february: "#FCA5A5",
	march: "#FBBF24",
	april: "#86EFAC",
	may: "#60A5FA",
	june: "#A5B4FC",
	july: "#C4B5FD",
	august: "#F9A8D4",
	september: "#5EEAD4",
	october: "#FB923C",
	november: "#A7F3D0",
	december: "#34D399",
};

const chartConfig = {
	clients: {
		label: "Clients",
	},
} satisfies ChartConfig;

export function SupplierPieChart({ suppliersData = [] }: SupplierPieChartProps) {
	const id = "pie-interactive";
	const totalSuppliers = suppliersData.reduce((acc, curr) => acc + curr.count, 0);
	const activeMonth = suppliersData[0]?.month || "";
	const activeMonthData = suppliersData.find(item => item.month === activeMonth) || { cebuCount: 0, calbayogCount: 0 };

	const activeIndex = React.useMemo(
		() => suppliersData.findIndex((item) => item.month === activeMonth),
		[activeMonth, suppliersData]
	);
	const months = React.useMemo(() => suppliersData.map((item) => item.month), [suppliersData]);

	return (
		<Card data-chart={id} className="flex flex-col pb-4">
			<ChartStyle id={id} config={chartConfig} />
			<CardHeader className="flex-row items-start space-y-0 pb-0">
				<div className="grid gap-1">
					<CardTitle>Suppliers Summary</CardTitle>
					<CardDescription>
						From {months[0] || "N/A"} to {months[months.length - 1] || "N/A"}
					</CardDescription>
				</div>
			</CardHeader>
			<CardContent className="flex flex-1 justify-center pb-0">
				<ChartContainer
					id={id}
					config={chartConfig}
					className="mx-auto aspect-square w-full max-w-[300px]"
				>
					<PieChart>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Pie
							data={totalSuppliers > 0
								? suppliersData.map((data) => ({
									...data,
									fill: monthColors[data.month.toLowerCase()] || "#D1D5DB",
								}))
								: [{ month: "No Supplieres", count: 1, fill: "#D1D5DB" }]
							}
							dataKey="count"
							nameKey="month"
							innerRadius={60}
							strokeWidth={5}
							activeIndex={activeIndex}
							activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
								<g>
									<Sector {...props} outerRadius={outerRadius + 10} />
									<Sector
										{...props}
										innerRadius={outerRadius + 12}
									/>
								</g>
							)}
						>
							<Label
								content={({ viewBox }) => {
									if (viewBox && "cx" in viewBox && "cy" in viewBox) {
										return (
											<g>
												<text
													x={viewBox.cx}
													y={viewBox.cy}
													textAnchor="middle"
													dominantBaseline="middle"
												>
													<tspan
														x={viewBox.cx}
														y={viewBox.cy}
														className="fill-foreground text-3xl font-bold"
													>
														{totalSuppliers.toLocaleString() || 0}
													</tspan>
													<tspan
														x={viewBox.cx}
														y={(viewBox.cy || 0) + 24}
														className="fill-muted-foreground"
													>
														Total Suppliers
													</tspan>
												</text>
											</g>
										);
									}
								}}
							/>
						</Pie>
					</PieChart>
				</ChartContainer>
			</CardContent>
			<div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
				<div className="flex items-center gap-x-2">
					<p className="text-xs font-medium text-primary">Cebu</p>
					<p className="text-sm font-medium text-primary">{activeMonthData.cebuCount ?? 0}</p>
				</div>
				<div className="flex items-center gap-x-2">
					<p className="text-xs font-medium text-secondary">Calbayog</p>
					<p className="text-sm font-medium text-secondary">{activeMonthData.calbayogCount ?? 0}</p>
				</div>
			</div>
		</Card>
	);
}
