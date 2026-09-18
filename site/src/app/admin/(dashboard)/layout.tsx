import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";

export const dynamic = "force-dynamic";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
            <Link href="/admin" className="text-slate-900">
              Dashboard
            </Link>
            <Link href="/admin/leads" className="hover:text-slate-900">
              Inquiries
            </Link>
            <Link href="/admin/settings" className="hover:text-slate-900">
              Settings
            </Link>
            <Link href="/" className="hover:text-slate-900" target="_blank">
              View site
            </Link>
          </nav>
          <LogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
