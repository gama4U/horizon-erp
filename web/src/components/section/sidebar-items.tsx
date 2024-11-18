import {
	FileQuestion,
	LayoutGrid,
	Users,
	SquareMenu,
	SquarePower,
	StickyNote,
	NotepadText,
	Clipboard,
	CircleUser,
	UserCog,
	ContactRound,
	Layers3,
	Package,
} from "lucide-react"
import { Button } from "../ui/button"

type SidebarIconsType = {
	icon: string
	isSelected: boolean
	role?: string
}
type LogoutButtonType = {
	handleLogout: () => void
}

export const SidebarIcons = ({ icon, isSelected }: SidebarIconsType) => {

	const color = isSelected ? '#FFFFFF' : `#000000`;
	const size = 22;
	const className = "mr-4";

	switch (icon) {
		case "Dashboard":
			return <LayoutGrid size={size} className={className} color={color} />;
		case "Transactions":
			return <SquareMenu size={size} className={className} color={color} />;
		case "Users":
			return <Users size={size} className={className} color={color} />;
		case "Memorandum":
			return <StickyNote size={size} className={className} color={color} />;
		case "Purchase":
			return <NotepadText size={size} className={className} color={color} />;
		case "Sales":
			return <Clipboard size={size} className={className} color={color} />;
		case "Leads":
			return <CircleUser size={size} className={className} color={color} />;
		case "Profile":
			return <UserCog size={size} className={className} color={color} />;
		case "Suppliers":
			return <ContactRound size={size} className={className} color={color} />;
		case "Documents":
			return <Layers3 size={size} className={className} color={color} />;
		case "Packages":
			return <Package size={size} className={className} color={color} />;
		default:
			return <FileQuestion className="mr-2" size={size} />;
	}
};

export const LogoutButton = ({ handleLogout }: LogoutButtonType) => {
	return (
		<Button variant="ghost" size="icon" onClick={handleLogout}>
			<SquarePower className="h-5 w-5 " />
		</Button>
	)
}


