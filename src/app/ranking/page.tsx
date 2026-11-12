import { Trophy } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function RankingPage() {
  const players = await prisma.player.findMany({
    orderBy: [{ points: "desc" }, { wins: "desc" }, { losses: "asc" }],
  });

  return (
    <main className="space-y-5">
      <header className="space-y-1">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-[#CCFF00]" />
          <h1 className="text-xl font-extrabold text-white">
            Ranking General
          </h1>
        </div>
        <p className="text-xs text-slate-400">
          +3 pts por victoria · +1 pt por partido disputado
        </p>
      </header>

      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-[#111726] shadow-lg shadow-black/35">
        <div className="grid grid-cols-12 border-b border-slate-800 bg-slate-900/70 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          <span className="col-span-1">#</span>
          <span className="col-span-6">Jugador</span>
          <span className="col-span-3 text-center">G / P (Efec.)</span>
          <span className="col-span-2 text-right">Pts</span>
        </div>

        <div className="divide-y divide-slate-800/70">
          {players.map((p, idx) => {
            const total = p.wins + p.losses;
            const winRate =
              total > 0 ? Math.round((p.wins / total) * 100) : 0;

            return (
              <div
                key={p.id}
                className="grid grid-cols-12 items-center px-4 py-3.5 text-xs"
              >
                <span
                  className={`col-span-1 font-extrabold ${
                    idx === 0 ? "text-[#CCFF00]" : "text-slate-400"
                  }`}
                >
                  {idx + 1}
                </span>

                <div className="col-span-6 min-w-0 pr-2">
                  <p className="truncate font-bold text-white">{p.name}</p>
                  <p className="truncate text-[10px] text-slate-400">
                    {p.category} · {p.favoriteRacket}
                  </p>
                </div>

                <div className="col-span-3 text-center">
                  <span className="font-semibold text-emerald-400">
                    {p.wins}
                  </span>
                  <span className="text-slate-500">/</span>
                  <span className="font-semibold text-rose-400">
                    {p.losses}
                  </span>
                  <span className="block text-[10px] text-slate-400">
                    {winRate}%
                  </span>
                </div>

                <span className="col-span-2 text-right text-sm font-black text-[#CCFF00]">
                  {p.points}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
