import { RedoDot, Split, UndoDot } from "lucide-react";
import { Badge } from "../ui/badge";
import { DocumentTransactionType } from "@/api/mutations/document-transaction.mutation";

interface DocumentTransactionBadgeProps {
	type: DocumentTransactionType;
	forTable?: boolean;
}

const voucherTypeColors: Record<DocumentTransactionType, string> = {
	RETURN: "bg-blue-300 text-blue-900",
	RECIEVE: "bg-green-300 text-green-900",
	TRANSMITTAL: "bg-yellow-300 text-yellow-900",
};

export function DocumentTransactionBadge({
	type,
	forTable,
}: DocumentTransactionBadgeProps) {
	const colorClass = voucherTypeColors[type];
	const formattedType = type.charAt(0).toUpperCase() + type.slice(1);
	const textColorClass = colorClass.split(' ').find((cls) => cls.startsWith("text-"));

	return forTable ? (
		<Badge
			className={`hover:bg-transparent text-[10px] w-fit min-w-[10px] justify-center gap-x-2 ${colorClass} cursor-pointer`}
		>
			<p>{formattedType}</p>
			{type === DocumentTransactionType.RECIEVE && <RedoDot className={textColorClass} size={12} />}
			{type === DocumentTransactionType.RETURN && <UndoDot className={textColorClass} size={12} />}
			{type === DocumentTransactionType.TRANSMITTAL && <Split className={textColorClass} size={12} />}

		</Badge>
	) : (
		<Badge
			className={`hover:bg-transparent text-xs w-fit min-w-[40px] p-1 justify-center gap-x-2 ${colorClass} cursor-pointer`}
		>
			<p>{formattedType}</p>
			{type === DocumentTransactionType.RECIEVE && <RedoDot className={textColorClass} />}
			{type === DocumentTransactionType.RETURN && <UndoDot className={textColorClass} />}
			{type === DocumentTransactionType.TRANSMITTAL && <Split className={textColorClass} />}
		</Badge>
	);
}
