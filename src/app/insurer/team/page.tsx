import InsurerLayout from "@/components/layout/InsurerLayout";
import { getTeamMembers } from "@/lib/actions/teamActions";
import TeamManager from "@/components/insurer/TeamManager";

export default async function TeamPage() {
  const members = await getTeamMembers();

  return (
    <InsurerLayout>
      <TeamManager initialMembers={members} />
    </InsurerLayout>
  );
}
