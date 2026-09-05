"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { 
  Squares2X2Icon, 
  DocumentPlusIcon, 
  CodeBracketIcon, 
  UserGroupIcon, 
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  BanknotesIcon,
  DocumentChartBarIcon
} from "@heroicons/react/24/outline";

export default function InsurerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const branding = (session?.user as any)?.branding || {
    primaryColor: '#1F6A72',
    secondaryColor: '#5A7A86'
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  const navItems = [
    { name: "Queue", href: "/insurer/dashboard", icon: Squares2X2Icon },
    { name: "Digitize", href: "/insurer/manual-entry", icon: DocumentPlusIcon },
    { name: "Settlements", href: "/insurer/payouts", icon: BanknotesIcon },
    { name: "Extracts", href: "/insurer/reports", icon: DocumentChartBarIcon },
    { name: "Ingest API", href: "/insurer/api-integration", icon: CodeBracketIcon },
    { name: "Adjusters", href: "/insurer/team", icon: UserGroupIcon },
    { name: "Desk rules", href: "/insurer/settings", icon: Cog6ToothIcon },
  ];

  return (
    <div 
      className="flex h-screen overflow-hidden"
      style={{ 
        '--color-primary': branding.primaryColor,
        '--color-secondary': branding.secondaryColor 
      } as React.CSSProperties}
    >
      <aside className="w-[15.5rem] bg-rail flex flex-col shrink-0 border-r-4 border-[#1a2a31]">
        <div className="px-4 pt-6 pb-4 border-b border-white/10">
          <Link href="/insurer/dashboard" className="block">
            <p className="font-display text-[11px] tracking-[0.22em] text-[#8fa0ab] uppercase">Medical file desk</p>
            <h1 className="font-display text-2xl text-folder leading-none mt-1">InsurFlow</h1>
          </Link>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto space-y-1 pr-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-tab ${isActive ? "nav-tab-active" : ""}`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          <div className="flex items-center justify-between gap-2 bg-[#1a2a31] px-3 py-2">
            <div className="overflow-hidden">
              <p className="text-sm text-folder truncate">{session?.user?.name}</p>
              <p className="file-id text-[#8fa0ab] capitalize">{(session?.user as any)?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-[#8fa0ab] hover:text-danger"
              title="Sign Out"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1280px] mx-auto p-5 lg:p-7">
          {children}
        </div>
      </main>
    </div>
  );
}
