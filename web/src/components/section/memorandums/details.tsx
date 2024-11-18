import { Loader2, Pencil, Printer, ThumbsUp } from 'lucide-react';
import { Button } from '../../ui/button';
import { Separator } from '../../ui/separator';
import { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { IMemorandum } from '@/api/queries/memorandums.query';
import UpdateMemorandumDialog from '@/components/dialogs/memorandum/edit';
import logo from '../../../assets/logo.png';
import stamp from '../../../assets/approved.png';
import draftToHtml from 'draftjs-to-html';
import { format } from 'date-fns';
import { OfficeBranch, UserType } from '@/interfaces/user.interface';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { approveMemorandum } from '@/api/mutations/memorandum.mutation';
import { useAuth } from '@/providers/auth-provider';
import { toast } from 'sonner';
import AnimatedDiv from '@/components/animated/Div';
import Constants from '@/constants';
import { RenderHeaderText } from '@/components/common/header';

interface Props {
	data: IMemorandum;
}

export default function MemorandumPreview({ data }: Props) {
	const contentRef = useRef<HTMLDivElement | null>(null);
	const reactToPrintFn = useReactToPrint({ contentRef });
	const [openEditMemo, setOpenEditMemo] = useState(false);
	const { firstName, lastName } = data.creator;
	const { session: { user } } = useAuth();
	const queryClient = useQueryClient();

	const renderContents = (content: string) => {
		if (!content) {
			console.error('Content is empty or null');
			return <div>No content available</div>;
		}

		let exampleData;
		try {
			exampleData = JSON.parse(content);
		} catch (error) {
			console.error('Invalid JSON:', error);
			return <div>Error parsing content</div>;
		}

		const contentAsHtml = draftToHtml({
			blocks: exampleData.blocks,
			entityMap: exampleData.entityMap,
		});

		return (
			<div style={{ all: 'unset' }}>
				<div className='reset-tw' dangerouslySetInnerHTML={{ __html: contentAsHtml }} />
			</div>
		);
	};

	const { mutate: approveMutate, isPending: approving } = useMutation({
		mutationFn: async (id: string) => await approveMemorandum(id),
		onSuccess: (data) => {
			queryClient.refetchQueries({ queryKey: ['memorandum-details'] });
			queryClient.refetchQueries({ queryKey: ['memorandums'] });
			toast.success(data.message, {
				position: 'top-center',
				className: 'text-primary'
			});
		},
		onError: (error) => {
			toast.error(error.message, {
				position: 'top-center',
				className: 'text-destructive'
			});
		},
	});

	const isCreatorAdmin = data.creator.userType === UserType.ADMIN;
	const isApproved = Boolean(data.approver);
	const { PermissionsCanEdit } = Constants;

	return (
		<div className="w-[750px] bg-white border-[1px]">
			<div className='h-[50px] px-4 flex items-center justify-between'>
				<div>
					<h1 className='text-[12px] text-black italic'>Memorandum preview</h1>
					<h1 className='text-[12px] text-black italic'>Prepared By: {firstName} {lastName}</h1>
				</div>
				<div className='flex flex-row items-center gap-x-2'>
					{!isApproved && !isCreatorAdmin && user?.userType === UserType.ADMIN && (
						<Button
							size={'sm'}
							onClick={() => approveMutate(data?.id)}
							className='gap-1'
							disabled={approving}
						>
							{(approving || queryClient.isFetching({ queryKey: ['transaction'] })) ? (
								<Loader2 size={16} className='animate-spin' />
							) : (
								<ThumbsUp size={16} />
							)}
							<span>Approve</span>
						</Button>
					)}

					{(user?.permission && PermissionsCanEdit.includes(user.permission)) && (
						<Button onClick={() => setOpenEditMemo(true)} size={'sm'} className='gap-1'>
							<Pencil size={16} />
							<span>Edit</span>
						</Button>
					)}

					{user?.userType === UserType.ADMIN && (
						<Button
							onClick={() => reactToPrintFn()}
							size={'sm'}
							className='gap-1'
							disabled={!isApproved && !isCreatorAdmin}
						>
							<Printer size={16} />
							<span>Print</span>
						</Button>
					)}
				</div>
			</div>
			<Separator />
			<div ref={contentRef} className='p-10 min-h-[900px] mb-4 relative'>
				{(data.approver || data.creator.userType === UserType.ADMIN) &&
					<AnimatedDiv
						animationType='Approve'
						className='absolute right-0 top-15'
					>
						<img src={stamp}
							className='object-contain w-[240px] h-[150px] rotate-90 approved-stamp'
						/>
					</AnimatedDiv>
				}
				<div className='text-center text-black flex flex-col items-center'>
					<img src={logo} className='object-contain w-[220px] h-[150px] self-center' />
					{RenderHeaderText(data.creator.officeBranch as OfficeBranch)}
				</div>

				<div className='text-black space-y-4 my-5 w-full'>
					<div className='flex flex-wrap items-center gap-4'>
						<div className='w-full lg:w-auto flex items-end gap-1 text-[12px]'>
							<span className='leading-[20px] text-[16px] font-semibold'>
								MEMORANDUM #{data.memorandumNumber}
							</span>
						</div>
					</div>
					<div className="space-y-2">
						<div className='w-full  flex items-end gap-1 text-[14px]'>
							<span className='leading-[14px]'>Date:</span>
							<div className='flex-1 leading-[14px]'>
								<span>{format(new Date(data?.createdAt ?? new Date), 'MMMM d, yyyy')}</span>
							</div>
						</div>
						<div className='w-full  flex items-end gap-1 text-[14px]'>
							<span className='leading-[14px]'>To:</span>
							<div className='flex-1 leading-[14px]'>
								<span>{data.to}</span>
							</div>
						</div>
						<div className='w-full  flex items-end gap-1 text-[14px]'>
							<span className='leading-[14px] '>From:</span>
							<div className='flex-1 leading-[14px]'>
								<span>Johann Estrada, Managing Director</span>
							</div>
						</div>
						<div className='w-full  flex items-end gap-1 text-[14px]'>
							<span className='leading-[14px] '>Subject:</span>
							<div className='flex-1 leading-[14px]'>
								<span>{data.subject}</span>
							</div>
						</div>
					</div>
				</div>

				{renderContents(data.contents)}

				<div className='flex items-end justify-start gap-4 text-black mt-12'>
					<div className='w-full text-left max-w-[250px] text-[14px]'>
						<div className='mt-4 text-[14px]'>
							{(isApproved || isCreatorAdmin) && (
								<div className='flex flex-col items-start'>
									<img
										className='relative -bottom-2 h-[45px] object-contain'
										src={isApproved ? data.approver.signature : data.creator.signature}
										alt="signature"
									/>
								</div>
							)}
							<span className='block'>Sincerely,</span>
							<span className='font-semibold'>Johann Estrada</span>
							<span className='block '>Managing Director</span>
							<span className='block '>Horizon Express Travel and Tours Inc.</span>
						</div>
					</div>
				</div>
			</div>
			<UpdateMemorandumDialog
				openDialog={openEditMemo}
				setOpenDialog={setOpenEditMemo}
				memorandumData={data}
			/>
		</div>
	);
}

