import { fetchProfile } from "@/api/queries/user.query";
import UserAvatar from "@/components/section/profile/avatar";
import ChangePassword from "@/components/section/profile/change-password";
import ProfileInfo from "@/components/section/profile/info";
import MySignature from "@/components/section/profile/signature";
import TopBar from "@/components/section/topbar";
import { useQuery } from "@tanstack/react-query";

export default function Profile() {
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => await fetchProfile()
  });

  return (
    <div className="space-y-2">
      <TopBar
        LeftSideHeader={
          <p className="text-sm">
            Profile
          </p>
        }
        LeftSideSubHeader={
          <p className="text-primary text-xs">Manage your profile here.</p>
        }
      />
      <div className="space-y-4 bg-white p-4 pb-8 rounded-lg">
        {profile && (
          <div className="max-w-[800px] m-auto space-y-4 p-4">
            <UserAvatar data={profile} />
            <ProfileInfo data={profile} />
            <ChangePassword />
            <MySignature signature={profile.signature ?? null} />
          </div>
        )}
      </div>
    </div>
  )
}
