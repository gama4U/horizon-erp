import { VoucherTypes } from "@/interfaces/transaction.interface";
import { Badge } from "../ui/badge";

interface VoucherBadgeProps {
	type: VoucherTypes;
	count: number;
}

const voucherTypeColors: Record<VoucherTypes, string> = {
	travel: "bg-blue-300 text-blue-900",
	accommodation: "bg-green-300 text-green-900",
	tour: "bg-yellow-300 text-yellow-900",
	transport: "bg-red-300 text-red-900",
}

export function VoucherBadge({ type, count }: VoucherBadgeProps) {
	const colorClass = voucherTypeColors[type];

	return (
		<Badge className={`hover:bg-transparent text-[8px] w-fit min-w-[10px] justify-center gap-x-2 ${colorClass} cursor-pointer`}>
			<p>{type.charAt(0).toUpperCase() + type.slice(1)}</p>
			<div className="rounded-full w-[14px] h-[14px] bg-white items-center justify-center flex">
				<p className="text-[8px] text-black">{count}</p>
			</div>
		</Badge>
	);
}
