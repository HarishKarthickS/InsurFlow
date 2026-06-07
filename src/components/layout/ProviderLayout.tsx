"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { 
  BuildingLibraryIcon,
  Squares2X2Icon,
  CloudArrowUpIcon,
  CreditCardIcon,
  ArrowRightOnRectangleIcon
} from "@heroicons/react/24/outline";

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const navItems = [
    { name: "My Claims", href: "/provider/dashboard", icon: Squares2X2Icon },
    { name: "Submit Claim", href: "/provider/submit", icon: CloudArrowUpIcon },
    { name: "Payout History", href: "/provider/payouts", icon: CreditCardIcon },
  ];

  return (
    <div className="flex h-screen bg-[#FDFDFD] overflow-hidden font-sans">
      {/* Provider Sidebar */}
      <aside className="w-64 bg-slate-900 flex flex-col shrink-0">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <BuildingLibraryIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-black tracking-tight text-lg">Hospital<span className="text-emerald-400 font-medium">Link</span></span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-400 font-bold"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-800">
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center gap-3 text-slate-500 hover:text-red-400 transition-colors w-full px-4"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span className="text-sm font-bold">Log Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-slate-50/30">
        <div className="max-w-6xl mx-auto p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
