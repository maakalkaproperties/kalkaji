'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Building,
  PlusCircle,
  Users,
  MapPin,
  BookOpen,
  Search,
  ExternalLink,
  LogOut,
  Layers,
  Image as ImageIcon,
  Sliders,
  Menu,
  X,
  ChevronRight,
  UserCog,
  HelpCircle,
} from 'lucide-react';

export default function AdminNav({ user }: { user?: { name: string; role: string } | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const navLinks = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Properties', href: '/admin/properties', icon: Building },
    { name: 'Add Listing', href: '/admin/properties/new', icon: PlusCircle },
    { name: 'Banners & Sliders', href: '/admin/banners', icon: Sliders },
    { name: 'Categories', href: '/admin/categories', icon: Layers },
    { name: 'Locations & Sectors', href: '/admin/locations', icon: MapPin },
    { name: 'Media & Images', href: '/admin/images', icon: ImageIcon },
    { name: 'Lead Pipeline', href: '/admin/leads', icon: Users },
    { name: 'Homepage FAQs', href: '/admin/faqs', icon: HelpCircle },
    { name: 'Admin Users & IDs', href: '/admin/users', icon: UserCog },
    { name: 'Blogs & Guides', href: '/admin/blogs', icon: BookOpen },
    { name: 'SEO Panel', href: '/admin/seo', icon: Search },
  ];

  return (
    <>
      {/* 1. MOBILE TOP STICKY BAR (Visible on < lg screens) */}
      <div className="lg:hidden sticky top-0 z-40 bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between shadow-md">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white p-0.5 flex items-center justify-center shrink-0">
            <img
              src="/logo.png"
              alt="Maa Kalkaji Properties"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="text-xs font-bold text-white tracking-tight leading-none">
              Maa Kalkaji CRM
            </div>
            <div className="text-[9px] text-red-400 font-semibold uppercase mt-0.5">
              Admin Portal
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800"
            title="View Live Site"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center justify-center"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 2. MOBILE SLIDE-DOWN DRAWER & BACKDROP (Visible when open) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-xs top-[53px]">
          <div className="bg-slate-900 border-b border-slate-800 max-h-[calc(100vh-53px)] overflow-y-auto p-4 space-y-4 shadow-2xl">
            {/* User Details */}
            {user && (
              <div className="p-3 bg-slate-800/80 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">{user.name}</div>
                  <div className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">
                    {user.role.replace(/_/g, ' ')}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-2.5 py-1 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white text-[11px] font-bold rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            )}

            {/* Nav links */}
            <nav className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive =
                  pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/90'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{link.name}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                  </Link>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-1.5 hover:text-white"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Visit Live Website</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. DESKTOP PERMANENT SIDEBAR (Visible on >= lg screens) */}
      <aside className="hidden lg:flex w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex-col justify-between p-4 shrink-0 min-h-screen sticky top-0 h-screen">
        <div className="space-y-6">
          {/* Brand */}
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-lg bg-white p-0.5 flex items-center justify-center shadow-sm">
              <img
                src="/logo.png"
                alt="Maa Kalkaji Properties"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-tight leading-none">
                Maa Kalkaji CRM
              </div>
              <div className="text-[10px] text-red-400 font-semibold uppercase mt-0.5">
                Admin & Pipeline Desk
              </div>
            </div>
          </div>

          {/* Links */}
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Footer */}
        <div className="pt-6 border-t border-slate-800 space-y-3">
          {user && (
            <div className="px-2">
              <div className="text-xs font-bold text-white truncate">{user.name}</div>
              <div className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">
                {user.role.replace(/_/g, ' ')}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-2 px-1">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Live Site</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors p-1"
              title="Log Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
