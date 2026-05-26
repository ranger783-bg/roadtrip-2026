"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Compass, CalendarDays, Map, PlusCircle, LogOut } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { ProfileRow } from "@/lib/types";

const items = [
  { href: "/", label: "Ideas", icon: Compass, match: (p: string) => p === "/" || p.startsWith("/ideas") },
  { href: "/itinerary", label: "Itinerary", icon: CalendarDays, match: (p: string) => p.startsWith("/itinerary") },
  { href: "/route", label: "Route", icon: Map, match: (p: string) => p.startsWith("/route") },
  { href: "/add", label: "Add", icon: PlusCircle, match: (p: string) => p.startsWith("/add") },
];

export function Nav({ me }: { me: ProfileRow }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    const res = await fetch("/auth/logout", { method: "POST" });
    window.location.href = res.redirected ? res.url : "/login";
    router.refresh();
  }

  return (
    <>
      <header className="sticky top-0 z-30 bg-sand/90 backdrop-blur border-b border-edge">
        <div className="container-prose flex h-14 items-center justify-between">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="font-serif text-lg font-semibold tracking-tight text-canyon-dark">Summer &rsquo;26</span>
            <span className="hidden sm:inline text-xs text-ink-muted">Glacier · Yellowstone · Tetons</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {items.map((item) => {
              const Icon = item.icon;
              const active = item.match(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    active ? "bg-paper text-ink shadow-soft" : "text-ink-muted hover:text-ink hover:bg-sand-soft",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-canyon">
              <Avatar name={me.name} src={me.avatar_url} color={me.display_color} size="sm" />
              <span className="hidden sm:inline text-sm font-medium pr-1">{me.name}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-3 py-2 text-xs text-ink-muted">Signed in as <span className="font-medium text-ink">{me.name}</span></div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={logout}>
                <LogOut className="h-4 w-4" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-paper/95 backdrop-blur border-t border-edge pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-around">
          {items.map((item) => {
            const Icon = item.icon;
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn("flex flex-col items-center gap-0.5 py-2 px-3 flex-1 text-[11px] font-medium", active ? "text-canyon" : "text-ink-muted")}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
