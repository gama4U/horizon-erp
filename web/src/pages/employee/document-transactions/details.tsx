import { useParams } from "react-router-dom"
import TopBar from "../../../components/section/topbar";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/animated/Loader";
import { fetchDocumentTransaction } from "@/api/queries/document-transaction.query";
import DocumentTransactionPreview from "@/components/section/document-transaction/print-preview";
import ClientDetails from "@/components/section/transaction/lead";
import DocumentDetails from "@/components/section/document-transaction/details";

export default function DocumentTransactionDetails() {
	const { id } = useParams();

	const { data, isLoading } = useQuery({
		queryKey: ['document-transaction-details', id],
		queryFn: async () => {
			if (!id) return;
			return await fetchDocumentTransaction(id)
		},
	});

	return (
		<div className="space-y-2">
			<TopBar
				showBackButton={true}
				LeftSideHeader={
					<p className="text-sm">
						Document Transaction # {data?.dtsNumber}
					</p>
				}
				LeftSideSubHeader={
					<p className="text-primary text-xs">
						Manage document transaction details here
					</p>
				}
			/>
			<div className="w-full flex gap-x-2 flex-row rounded-lg">
				<Loader isLoading={isLoading} />
				{data ? (
					<>
						<div className="w-full md:w-1/2 h-full bg-white rounded-lg overflow-hidden">
							<DocumentDetails documentTransactionData={data} />
							<ClientDetails clientData={data.client} forSelection />
						</div>
						<div className="w-full md:w-1/2 h-full bg-white rounded-lg overflow-hidden">
							<DocumentTransactionPreview data={data} />
						</div>
					</>
				) : (
					<div className="h-[90vh] bg-white w-full rounded-lg" />
				)}
			</div>
		</div>
	)
}
