import { IUser } from "@/interfaces/user.interface";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserDetailsProps {
	userData: IUser;
}

export default function UserDetails({ userData }: UserDetailsProps) {
	return (
		<div className="flex flex-row p-4 m-2 bg-white shadow-md gap-x-2 rounded-md max-w-md mx-auto items-center justify-between">
			<div className="flex flex-col items-center justify-center mb-3">
				<Avatar className="h-[80px] w-[80px] border-2 border-gray-200">
					<AvatarImage src={userData?.avatar} className="object-cover" />
					<AvatarFallback className="text-[24px]">
						{userData?.firstName[0]}
					</AvatarFallback>
				</Avatar>
				<h2 className="text-sm font-semibold text-gray-900 mt-2 text-center">
					{userData.firstName} {userData.lastName}
				</h2>
			</div>
			<div className="space-y-1 text-sm w-[70%]">
				<div className="grid grid-cols-3 gap-2">
					<div className="flex flex-col text-xs ">
						<p className=" font-medium text-gray-600">First Name</p>
						<p className="text-gray-800">{userData.firstName}</p>
					</div>
					<div className="flex flex-col text-xs ">
						<p className=" font-medium text-gray-600">Middle Name</p>
						<p className="text-gray-800">{userData.middleName || '-'}</p>
					</div>
					<div className="flex flex-col text-xs">
						<p className="font-medium text-gray-600">Last Name</p>
						<p className="text-gray-800">{userData.lastName}</p>
					</div>
				</div>
				<div className="grid grid-cols-3 gap-2">
					<div className="flex flex-col text-xs ">
						<p className=" font-medium text-gray-600">Branch</p>
						<p className="text-gray-800">{userData.officeBranch}</p>
					</div>
					<div className="flex flex-col text-xs ">
						<p className=" font-medium text-gray-600">User Permission</p>
						<p className="text-gray-800">{userData.userType}</p>
					</div>
				</div>
				<div className="grid grid-cols-3 gap-2">
					<div className="flex flex-col text-xs ">
						<p className=" font-medium text-gray-600">Email address:</p>
						<p className="text-gray-800">{userData.email}</p>
					</div>
				</div>

			</div>
		</div>
	);
}
