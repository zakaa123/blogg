"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AuthProvider, useAuthContext } from "@/lib/auth-context";
import { ToastProvider } from "@/components/ui/toast";
import {
  LayoutDashboard, FileText, FolderOpen, Image, MessageSquare, Users,
  Mail, Globe, BarChart3, Link2, TrendingUp, SearchIcon, Settings,
  ChevronDown, ChevronRight, Menu, X, Brain, Bell, LogOut,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
  {
    label: "Articles", icon: FileText, href: "/admin/articles",
    children: [
      { label: "All Articles", href: "/admin/articles" },
      { label: "New Article", href: "/admin/articles/new" },
    ],
  },
  { label: "Categories", icon: FolderOpen, href: "/admin/categories" },
  { label: "Media Library", icon: Image, href: "#" },
  { label: "Comments", icon: MessageSquare, href: "/admin/comments" },
  { label: "Users", icon: Users, href: "#" },
  { label: "Newsletter", icon: Mail, href: "#" },
  { label: "Pages", icon: Globe, href: "#" },
  { label: "Ads Management", icon: BarChart3, href: "#" },
  { label: "Affiliate Links", icon: Link2, href: "#" },
  { label: "Analytics", icon: TrendingUp, href: "#" },
  { label: "SEO Settings", icon: SearchIcon, href: "#" },
  { label: "Settings", icon: Settings, href: "/admin/settings" },
];

function AdminSidebar({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
}) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(["Articles"]);

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  return (
    <>
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-secondary-900 text-white flex flex-col transition-transform duration-300`}
      >
        <div className="p-5 border-b border-secondary-800">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold">AI TechHub</span>
              <p className="text-[10px] text-secondary-400 -mt-0.5">Admin Panel</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin/dashboard" && item.href !== "#" && pathname.startsWith(item.href));
            const isExpanded = expandedItems.includes(item.label);
            const hasChildren = item.children && item.children.length > 0;

            return (
              <div key={item.label}>
                {hasChildren ? (
                  <>
                    <button
                      onClick={() => toggleExpand(item.label)}
                      className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        isActive
                          ? "bg-primary-500/10 text-primary-400"
                          : "text-secondary-400 hover:text-white hover:bg-secondary-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-[18px] h-[18px]" />
                        <span>{item.label}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="ml-4 mt-0.5 space-y-0.5">
                        {item.children!.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                              pathname === child.href
                                ? "bg-primary-500/10 text-primary-400"
                                : "text-secondary-500 hover:text-white hover:bg-secondary-800"
                            }`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      isActive
                        ? "bg-primary-500/10 text-primary-400"
                        : "text-secondary-400 hover:text-white hover:bg-secondary-800"
                    }`}
                  >
                    <item.icon className="w-[18px] h-[18px]" />
                    <span>{item.label}</span>
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-secondary-800">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 text-secondary-400 hover:text-white text-sm transition-colors"
          >
            <Globe className="w-4 h-4" />
            View Site
          </Link>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}

function AdminTopBar({ sidebarOpen, setSidebarOpen }: { sidebarOpen: boolean; setSidebarOpen: (v: boolean) => void }) {
  const { user } = useAuthContext();

  return (
    <header className="bg-white border-b border-secondary-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 text-secondary-500 hover:bg-secondary-100 rounded-lg"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <h1 className="text-lg font-semibold text-secondary-900">Dashboard</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-56"
          />
        </div>
        <button className="relative p-2 text-secondary-400 hover:bg-secondary-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="flex items-center gap-2.5 pl-3 border-l border-secondary-200">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-white">
              {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || "S"}
            </span>
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-medium text-secondary-900">
              {user?.displayName || "Saikat Al Hasan"}
            </div>
            <div className="text-xs text-secondary-400">Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
}

function AdminInnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-secondary-50 overflow-hidden">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminTopBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <AdminInnerLayout>{children}</AdminInnerLayout>
      </ToastProvider>
    </AuthProvider>
  );
}
