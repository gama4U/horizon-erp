import { Printer } from 'lucide-react';
import { Button } from '../../ui/button';
import { Separator } from '../../ui/separator';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import logo from '../../../assets/logo.png';
import { format } from 'date-fns';
import { OfficeBranch } from '@/interfaces/user.interface';
import { IDocumentTransaction } from '@/api/queries/document-transaction.query';
import { RenderHeaderText } from '@/components/common/header';
import { DocumentTransactionType } from '@/api/mutations/document-transaction.mutation';

interface Props {
	data: IDocumentTransaction;
}

export default function DocumentTransactionPreview({ data }: Props) {
	const contentRef = useRef<HTMLDivElement | null>(null);
	const reactToPrintFn = useReactToPrint({ contentRef });
	const { firstName, lastName } = data.preparedBy;

	return (
		<div className="w-full bg-white border-[1px]">
			<div className='h-[50px] px-4 flex items-center justify-between'>
				<div>
					<h1 className='text-[12px] text-black italic'>Document Transaction preview</h1>
					<h1 className='text-[12px] text-black italic'>Prepared By: {firstName} {lastName}</h1>
				</div>
				<div className='flex flex-row items-center gap-x-2'>
					<Button
						onClick={() => reactToPrintFn()}
						size={'sm'}
						className='gap-1'
					>
						<Printer size={16} />
						<span>Print</span>
					</Button>
				</div>
			</div>
			<Separator />
			<div ref={contentRef} className="flex flex-col min-h-[100vh] space-y-4 justify-between p-4">
				<div className='flex flex-col px-20'>
					<div className='text-center text-black flex flex-col items-center'>
						<img src={logo} className='object-contain w-[220px] h-[150px] self-center' />
						{RenderHeaderText(data.client.officeBranch as OfficeBranch)}
					</div>
					<div className='text-black space-y-4 my-5 w-full'>
						<div className='w-full  flex flex-col justify-start items-start gap-1 text-[12px]'>
							<span className='text-[14px] font-semibold'>
								Document Transaction #{data.dtsNumber}
							</span>
						</div>
						<div className="space-y-2">
							<div className='w-full  flex items-end gap-1 text-[14px]'>
								<div className='flex-1 leading-[14px] font-medium'>
									<span>{data.type}</span>
								</div>
							</div>
							<Separator className='mt-4' />
							<div className='w-full  flex items-end gap-1 text-[12px]'>
								<span className='leading-[12px]'>Client:</span>
								<div className='flex-1 leading-[12px]'>
									<span>{data.client.name}</span>
								</div>
							</div>

							<div className='w-full  flex items-end gap-1 text-[12px]'>
								<span className='leading-[12px]'>Date:</span>
								<div className='flex-1 leading-[12px]'>
									<span>{format(new Date(data?.createdAt ?? new Date), 'MMMM d, yyyy')}</span>
								</div>
							</div>
						</div>
					</div>
					<div className='flex flex-col space-y-2 text-sm'>
						{data.documents.map((document, index) => (
							<div key={index} className='gap-x-2 flex flex-row border-b-[1px] justify-start'>
								<p className='mr-2'>{index + 1}.</p> {/* Add margin-right for spacing */}
								<p>{document}</p>
							</div>
						))}
					</div>
				</div>

				{data.type === DocumentTransactionType.RECIEVE &&
					<div className='flex items-end justify-evenly gap-4 text-muted-foreground mt-4 flex-3 pb-4'>
						<div className='w-full text-center max-w-[250px] text-[12px] text-muted-foreground'>
							<div className='flex-1 border-b leading-[16px]'>
								{data.preparedBy && (
									<div className='flex flex-col items-center'>
										{data.preparedBy.signature && (
											<img
												className='relative -bottom-2 h-[45px] object-contain'
												src={data.preparedBy.signature}
												alt="signature"
											/>
										)}
										<span className='text-[12px] font-semibold uppercase'>
											{`${data?.preparedBy?.firstName} ${data?.preparedBy?.lastName}`}
										</span>
									</div>
								)}
							</div>
							<span className='leading-[16px]'>
								Prepared/Received By
							</span>
						</div>
						<div className='w-full text-center max-w-[250px] text-[12px] text-muted-foreground'>
							<div className='flex-1 border-b leading-[16px]'>
								<span className='text-[12px] font-semibold uppercase'>
									{data?.recievedFromOutsider}
								</span>

							</div>
							<span className='leading-[16px]'>
								Recieved From
							</span>
						</div>
					</div>
				}

				{data.type === DocumentTransactionType.TRANSMITTAL &&
					<div className='flex items-end justify-evenly gap-4 text-muted-foreground mt-4 flex-3 pb-4'>
						<div className='w-full text-center max-w-[250px] text-[12px] text-muted-foreground'>
							<div className='flex-1 border-b leading-[16px]'>
								{data.preparedBy && (
									<div className='flex flex-col items-center'>
										{data.preparedBy.signature && (
											<img
												className='relative -bottom-2 h-[45px] object-contain'
												src={data.preparedBy.signature}
												alt="signature"
											/>
										)}
										<span className='text-[12px] font-semibold uppercase'>
											{`${data?.preparedBy?.firstName} ${data?.preparedBy?.lastName}`}
										</span>
									</div>
								)}
							</div>
							<span className='leading-[16px]'>
								Prepared by
							</span>
						</div>
						<div className='w-full text-center max-w-[250px] text-[12px] text-muted-foreground'>
							<div className='flex-1 border-b leading-[16px]'>
								<span className='text-[12px] font-semibold uppercase'>
									{data?.recievedByOutsider}
								</span>
							</div>
							<span className='leading-[16px]'>
								Recieved By
							</span>
						</div>

						<div className='w-full text-center max-w-[250px] text-[12px] text-muted-foreground'>
							<div className='flex-1 border-b leading-[16px]'>
								{data.transmittedBy && (
									<div className='flex flex-col items-center'>
										{data.transmittedBy.signature && (
											<img
												className='relative -bottom-2 h-[45px] object-contain'
												src={data.transmittedBy.signature}
												alt="signature"
											/>
										)}
										<span className='text-[12px] font-semibold uppercase'>
											{`${data?.transmittedBy?.firstName} ${data?.transmittedBy?.lastName}`}
										</span>
									</div>
								)}
							</div>
							<span className='leading-[16px]'>
								Transmitted by
							</span>
						</div>
					</div>
				}
				{data.type === DocumentTransactionType.RETURN &&
					<div className='flex items-end justify-evenly gap-4 text-muted-foreground mt-4 flex-3 pb-4'>
						<div className='w-full text-center max-w-[250px] text-[12px] text-muted-foreground'>
							<div className='flex-1 border-b leading-[16px]'>
								{data.preparedBy && (
									<div className='flex flex-col items-center'>
										{data.preparedBy.signature && (
											<img
												className='relative -bottom-2 h-[45px] object-contain'
												src={data.preparedBy.signature}
												alt="signature"
											/>
										)}
										<span className='text-[12px] font-semibold uppercase'>
											{`${data?.preparedBy?.firstName} ${data?.preparedBy?.lastName}`}
										</span>
									</div>
								)}
							</div>
							<span className='leading-[16px]'>
								Returned/Prepared by
							</span>
						</div>
						<div className='w-full text-center max-w-[250px] text-[12px] text-muted-foreground'>
							<div className='flex-1 border-b leading-[16px]'>
								<span className='text-[12px] font-semibold uppercase'>
									{data?.recievedByOutsider}
								</span>
							</div>
							<span className='leading-[16px]'>
								Recieved By
							</span>
						</div>
					</div>
				}
			</div>
		</div>
	);
}

