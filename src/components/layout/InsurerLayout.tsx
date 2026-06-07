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

  // Branding variables (ideally these would be fetched once and passed down)
  const branding = (session?.user as any)?.branding || {
    primaryColor: '#4B56D2',
    secondaryColor: '#82C3EC'
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  const navItems = [
    { name: "Command Center", href: "/insurer/dashboard", icon: Squares2X2Icon },
    { name: "Manual Digitization", href: "/insurer/manual-entry", icon: DocumentPlusIcon },
    { name: "Finance & Payouts", href: "/insurer/payouts", icon: BanknotesIcon },
    { name: "Reporting Center", href: "/insurer/reports", icon: DocumentChartBarIcon },
    { name: "API Docs & Integration", href: "/insurer/api-integration", icon: CodeBracketIcon },
    { name: "Team Management", href: "/insurer/team", icon: UserGroupIcon },
    { name: "Workspace Settings", href: "/insurer/settings", icon: Cog6ToothIcon },
  ];

  return (
    <div 
      className="flex h-screen bg-background overflow-hidden"
      style={{ 
        '--color-primary': branding.primaryColor,
        '--color-secondary': branding.secondaryColor 
      } as React.CSSProperties}
    >
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col shrink-0">
        <div className="p-8">
          <Link href="/insurer/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <span className="text-white font-black text-xl italic">I</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 leading-none">InsurFlow</h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Enterprise B2B</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 overflow-y-auto space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/20 font-bold"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-primary'}`} />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-50">
          <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between group">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <span className="text-primary font-bold">{session?.user?.name?.charAt(0)}</span>
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-900 truncate">{session?.user?.name}</p>
                <p className="text-[10px] text-gray-400 font-medium capitalize truncate">{(session?.user as any)?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
              title="Sign Out"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
