"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trophy, Plus, Users } from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-slate-800/90 bg-[#090D16]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-md items-center justify-around px-3 py-2">
        <Link
          href="/"
          className={`flex flex-col items-center gap-1 px-3 py-1.5 text-xs font-medium transition-colors ${
            isActive("/")
              ? "text-[#CCFF00]"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Home className="h-5 w-5" />
          <span>Inicio</span>
        </Link>

        <Link
          href="/ranking"
          className={`flex flex-col items-center gap-1 px-3 py-1.5 text-xs font-medium transition-colors ${
            isActive("/ranking")
              ? "text-[#CCFF00]"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Trophy className="h-5 w-5" />
          <span>Ranking</span>
        </Link>

        <Link
          href="/matches/new"
          aria-label="Cargar nuevo partido"
          className="-mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#CCFF00] text-slate-950 shadow-neon transition-transform active:scale-95"
        >
          <Plus className="h-7 w-7 stroke-[2.75]" />
        </Link>

        <Link
          href="/players"
          className={`flex flex-col items-center gap-1 px-3 py-1.5 text-xs font-medium transition-colors ${
            pathname.startsWith("/players")
              ? "text-[#CCFF00]"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Users className="h-5 w-5" />
          <span>Jugadores</span>
        </Link>
      </div>
    </nav>
  );
}
