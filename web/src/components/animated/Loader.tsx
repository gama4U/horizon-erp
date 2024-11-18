import Lottie from "lottie-react";
import authLoader from "../../assets/loaders/auth.json";
import skeletonLoader from "../../assets/loaders/skeleton.json"

interface LoaderProps {
	isLoading: boolean
	type?: 'auth' | 'skeleton'
	label?: string
}

const Loader = ({ isLoading, label, type }: LoaderProps) => {

	if (!isLoading) {
		return null
	}

	return (
		<div className={`fixed inset-0 z-50 flex 
		items-center justify-center 
		text-[#70309F] bg-[#0000002e]
		font-medium text-[50px] 
		sm:text-[78px]'} `}>
			<div className="flex flex-col items-center">
				<Lottie animationData={type === 'skeleton' ? skeletonLoader : authLoader} loop={true} className="w-[320px] h-[320px]" />
				<p className="text-white font-semibold text-[14px]">{label}</p>
			</div>
		</div>

	)
}

export default Loader
