import clsx from "clsx";
import AnimatedDiv from "../animated/Div";
import { CircleCheck } from "lucide-react";
import { DocumentTransactionType } from "@/api/mutations/document-transaction.mutation";

const voucherTypeColors: Record<DocumentTransactionType, string> = {
	RETURN: "bg-blue-300 text-blue-900",
	RECIEVE: "bg-green-300 text-green-900",
	TRANSMITTAL: "bg-yellow-300 text-yellow-900",
};

interface DocumentTransactionFilterProps {
	type: DocumentTransactionType;
	selected: boolean;
	onToggle: (type: DocumentTransactionType) => void;
}

export function DocumentTransactionTypeFilter({
	type,
	selected,
	onToggle,
}: DocumentTransactionFilterProps) {
	const handleToggle = () => {
		onToggle(type);
	};

	const colorClass = selected ? voucherTypeColors[type] : "bg-gray-200 text-gray-600 border-gray-300";

	return (
		<div
			className={clsx(
				"cursor-pointer px-3 rounded-sm py-1 transition-all duration-300 text-xs flex flex-row items-center gap-x-2",
				colorClass
			)}
			onClick={handleToggle}
		>
			{type.charAt(0).toUpperCase() + type.slice(1)}
			{selected && (
				<AnimatedDiv animationType="Glowing" repeatDelay={0.5}>
					<CircleCheck size={18} />
				</AnimatedDiv>
			)}
		</div>
	);
}
