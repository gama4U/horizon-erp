import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import AnimatedDiv from "../animated/Div";
import BackButton from "../buttons/back";

interface TopBarProps {
	LeftSideHeader?: React.ReactNode;
	LeftSideSubHeader?: React.ReactNode;
	RightSideComponent?: React.ReactNode;
	showBackButton?: boolean
}

const TopBar = ({ LeftSideHeader, LeftSideSubHeader, RightSideComponent, showBackButton }: TopBarProps) => {
	const location = useLocation();
	const [key, setKey] = useState(0);

	useEffect(() => {
		setKey((prevKey) => prevKey + 1);
	}, [location.pathname]);

	return (
		<AnimatedDiv key={key} className="z-0" delay={0} animationType="SlideInFromUp" duration={0.3} slideEntrancePoint={-20} >
			<div className="bg-[#FFFFFF] px-4 rounded-lg w-full items-center h-[59px] flex flex-row justify-between sticky shadow-sm top-0 z-10">
				<div className="flex flex-row gap-x-2 items-center">
					{showBackButton &&
						<BackButton />}
					<div className="flex flex-col">
						<p className="flex-1 font-normal text-sm">
							{LeftSideHeader}
						</p>
						<p className="flex-1 font-normal text-xs text-green-800">
							{LeftSideSubHeader}
						</p>
					</div>
				</div>
				<div className="flex-1">{RightSideComponent}</div>
			</div>
		</AnimatedDiv>
	);
};

export default TopBar;
