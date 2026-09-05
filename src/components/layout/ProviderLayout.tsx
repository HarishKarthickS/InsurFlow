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
    { name: "Facility files", href: "/provider/dashboard", icon: Squares2X2Icon },
    { name: "Lodge claim", href: "/provider/submit", icon: CloudArrowUpIcon },
    { name: "Settlements", href: "/provider/payouts", icon: CreditCardIcon },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-60 bg-rail flex flex-col shrink-0 border-r-4 border-[#1a2a31]">
        <div className="px-4 pt-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2 text-folder">
            <BuildingLibraryIcon className="h-5 w-5 text-primary" />
            <div>
              <p className="font-display text-[11px] tracking-[0.18em] uppercase text-[#8fa0ab]">Hospital intake</p>
              <p className="font-display text-xl leading-none">Facility desk</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-4 space-y-1 pr-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-tab ${isActive ? "nav-tab-active" : ""}`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          <p className="px-3 mb-2 text-xs text-[#8fa0ab] truncate">{session?.user?.name}</p>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="nav-tab w-[calc(100%-10px)] text-[#8fa0ab]"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
