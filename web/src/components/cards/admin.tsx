import React from 'react';
import { FilePlus2, LucideIcon, SquarePen, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardTitle } from '../ui/card';
import CountUp from 'react-countup';
import { format } from 'date-fns';
import { RecentActivity } from '@/api/queries/transaction';
import { useNavigate } from 'react-router-dom';

interface DashboardCardProps {
	title: string;
	value: number;
	icon?: LucideIcon;
	shortLabel?: string;
	showRate?: boolean;
	rate?: number;
	calbayogCount?: number
	cebuCount?: number
}


export const DashboardCard: React.FC<DashboardCardProps> = ({
	title,
	value,
	icon: Icon,
	showRate,
	rate,
	shortLabel,
	cebuCount,
	calbayogCount
}) => {
	return (
		<Card className="bg-[#FFFFFF99] rounded-xl shadow-md px-4 py-4 flex flex-col justify-start items-start w-full sm:w-auto max-w-xs md:max-w-[220px] lg:max-w-[240px] xl:max-w-[260px]">
			<CardTitle>
				<div className="flex items-center mb-2">
					{Icon && <Icon className="text-xl mr-2" />}
					<h2 className="text-sm sm:text-base font-medium">{title}</h2>
				</div>
			</CardTitle>
			<CardContent className="flex flex-col items-center justify-center w-full space-y-2 flex-grow">
				<CountUp end={value} className="text-2xl sm:text-3xl font-semibold" />

				<div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full flex-wrap">
					<div className="flex items-center gap-x-2">
						<p className="text-xs font-medium text-primary">Cebu</p>
						<p className="text-sm font-medium text-primary">{cebuCount ?? 0}</p>
					</div>
					<div className="flex items-center gap-x-2">
						<p className="text-xs font-medium text-secondary">Calbayog</p>
						<p className="text-sm font-medium text-secondary">{calbayogCount ?? 0}</p>
					</div>
				</div>

				{showRate && (
					<div className="flex items-center justify-end gap-x-2 w-full mt-2">
						<TrendingUp size={16} className="text-primary" />
						<div className="text-primary text-xs font-semibold">{Math.round(rate ?? 0)}%</div>
						<p className="text-[10px] font-light">{shortLabel}</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
};
export const RecentActivityCard: React.FC<{ item: RecentActivity }> = ({ item }) => {
	const navigate = useNavigate();

	const handleNavigate = () => {
		switch (item.type) {
			case 'Transaction':
				navigate(`/admin/transactions/${item.id}/`);
				break;
			case 'Sales Agreement':
				navigate(`/admin/sales-agreement/${item.id}/`);
				break;
			case 'Purchase Request':
				navigate(`/admin/purchase-request/${item.id}/`);
				break;
			case 'Memorandum':
				navigate(`/admin/memorandum/${item.id}/`);
				break;
			default:
				break;
		}
	};

	return (
		<div
			onClick={handleNavigate}
			key={item.id}
			className={`border p-2 text-[10px] rounded-md mb-2 flex flex-row items-center justify-between hover:bg-primary-foreground bg-[#FFFFFF99] cursor-pointer`}
		>
			<div className="w-2/3">
				<p className="text-xs font-medium">{item.type} {item.status}</p>
				{item.creator && <p>by: {item.creator?.firstName} {item.creator?.lastName}</p>}
				{item?.preparedBy?.firstName && <p>by: {item.preparedBy?.firstName} {item.preparedBy?.lastName}</p>}
				<span>{format(new Date(item.createdAt ?? new Date()), 'MMMM d, h:mm a')}</span>
			</div>
			{item.status === 'Created' && <FilePlus2 size={20} color='#045C2B' />}
			{item.status === 'Updated' && <SquarePen size={20} color='#E76E50' />}
		</div>
	);
};
