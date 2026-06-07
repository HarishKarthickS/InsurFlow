import InsurerLayout from "@/components/layout/InsurerLayout";
import { getOrganizationSettings } from "@/lib/actions/teamActions";
import SettingsPage from "./SettingsPage";

export default async function SettingsPageWrapper() {
  const org = await getOrganizationSettings();

  return <SettingsPage org={org} />;
}
