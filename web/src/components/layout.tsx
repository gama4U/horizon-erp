import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../providers/auth-provider";
import SideBar from "./section/sidebar";
import logo from "../assets/logo.png"
import Constants from "@/constants";
import { OfficeBranch, UserType } from "@/interfaces/user.interface";

const Layout: React.FC = () => {
	const { session, loading, setBranch } = useAuth();
	const currentPath = location.pathname;
	const isAdmin = session.user?.userType === UserType.ADMIN

	if (loading) return null;

	useEffect(() => {
		if (session.user?.userType === UserType.EMPLOYEE) {
			setBranch(session.user.officeBranch as OfficeBranch)
		}
	}, [])

	if (!session || !session.user) {
		return <Navigate to="/auth/sign-in" />;
	}

	const redirectRoute = Constants.UserRedirectRoute[session.user.userType];
	if (redirectRoute && currentPath !== redirectRoute && !currentPath.startsWith(redirectRoute)) {
		return <Navigate to={redirectRoute} />;
	}

	return (
		<div className={`h-screen flex overflow-auto gap-x-2  p-2 ${isAdmin ? 'bg-white' : 'bg-'}`}>
			<SideBar />
			<div className="w-full rounded-xl  z-50">
				<Outlet />
			</div>
			<img src={logo} className="absolute z-0 bottom-4 right-5 w-[120px] h-[120px] object-contain" />
		</div>
	);
};

export default Layout;
