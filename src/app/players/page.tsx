import Link from "next/link";
import { UserPlus, Award } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PlayersPage() {
  const players = await prisma.player.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  return (
    <main className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white">Jugadores</h1>
          <p className="text-xs text-slate-400">
            Perfiles, categorías y palas registradas
          </p>
        </div>
        <Link
          href="/players/new"
          className="inline-flex items-center gap-1.5 rounded-2xl bg-[#CCFF00] px-3.5 py-2.5 text-xs font-extrabold text-slate-950 shadow-neon"
        >
          <UserPlus className="h-4 w-4" />
          Nuevo
        </Link>
      </header>

      <div className="grid gap-3">
        {players.map((player) => (
          <div
            key={player.id}
            className="flex items-center justify-between rounded-3xl border border-slate-800 bg-[#111726] p-4 shadow-md"
          >
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-sm font-bold text-white">
                  {player.name}
                </h2>
                <span className="rounded-lg bg-[#CCFF00]/15 px-2 py-0.5 text-[10px] font-extrabold text-[#CCFF00]">
                  Cat. {player.category}
                </span>
              </div>
              <p className="flex items-center gap-1.5 truncate text-xs text-slate-400">
                <Award className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                {player.favoriteRacket}
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-sm font-extrabold text-white">
                {player.points} pts
              </span>
              <p className="text-[11px] text-slate-400">
                {player.wins}G · {player.losses}P
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
