import { ProfileContent } from "@/components/profile/ProfileContent";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { Layout } from "@/components/shared/Layout";

export const ProfilePage = () => {
  return (
    <Layout className="p-0 pb-14">
      <ProfileHeader />
      <ProfileContent />
    </Layout>
  );
};
