import Link from "next/link";
import {
  Trophy,
  MapPin,
  Calendar,
  Plus,
  UserPlus,
  Swords,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatMatchDate(date: Date): string {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export default async function DashboardPage() {
  const [recentMatches, topPlayers, totalMatches, totalPlayers] =
    await Promise.all([
      prisma.match.findMany({
        take: 6,
        orderBy: { date: "desc" },
        include: {
          teamAPlayer1: true,
          teamAPlayer2: true,
          teamBPlayer1: true,
          teamBPlayer2: true,
        },
      }),
      prisma.player.findMany({
        take: 5,
        orderBy: [{ points: "desc" }, { wins: "desc" }, { losses: "asc" }],
      }),
      prisma.match.count(),
      prisma.player.count(),
    ]);

  return (
    <main className="space-y-7">
      {/* Header Principal */}
      <header className="flex items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#CCFF00]/30 bg-[#CCFF00]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#CCFF00]">
            <span className="h-2 w-2 rounded-full bg-[#CCFF00] animate-pulse" />
            Formosa Pádel Tour
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white">
            Panel de Resultados
          </h1>
          <p className="text-xs text-slate-400">
            {totalMatches} partidos jugados · {totalPlayers} jugadores activos
          </p>
        </div>

        <Link
          href="/players/new"
          className="flex h-11 items-center gap-1.5 rounded-2xl border border-slate-800 bg-[#111726] px-3.5 text-xs font-semibold text-slate-200 shadow-md transition hover:border-[#CCFF00]/50 hover:text-[#CCFF00]"
        >
          <UserPlus className="h-4 w-4 text-[#CCFF00]" />
          <span>Jugador</span>
        </Link>
      </header>

      {/* Banner Acción Rápida Post-Turno */}
      <section className="relative overflow-hidden rounded-3xl border border-[#CCFF00]/30 bg-gradient-to-br from-[#162033] via-[#111726] to-[#0B0F1A] p-5 shadow-xl shadow-black/40">
        <div className=" -right-6 -top-6 absolute h-28 w-28 rounded-full bg-[#CCFF00]/15 blur-2xl" />
        <div className="relative flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#CCFF00]">
              <Sparkles className="h-3.5 w-3.5" />
              ¿Recién salís de la cancha?
            </span>
            <h2 className="text-lg font-bold text-white leading-snug">
              Cargá tu partido 2 vs 2 en segundos
            </h2>
            <p className="text-xs text-slate-400">
              Actualiza el ranking y porcentaje de victorias al instante.
            </p>
          </div>
          <Link
            href="/matches/new"
            className="shrink-0 inline-flex items-center gap-1.5 rounded-2xl bg-[#CCFF00] px-4 py-3 text-xs font-extrabold uppercase tracking-wide text-slate-950 shadow-neon transition active:scale-95"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            Cargar
          </Link>
        </div>
      </section>

      {/* Top 5 del Ranking Actual */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-[#CCFF00]" />
            <h2 className="text-base font-bold text-white">Top 5 Ranking</h2>
          </div>
          <Link
            href="/ranking"
            className="inline-flex items-center gap-0.5 text-xs font-semibold text-[#CCFF00] hover:underline"
          >
            Ver tabla completa
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {topPlayers.length === 0 ? (
          <div className="rounded-2xl border border-slate-800/80 bg-[#111726] p-5 text-center text-sm text-slate-400">
            Aún no hay jugadores registrados.{" "}
            <Link
              href="/players/new"
              className="font-semibold text-[#CCFF00] underline"
            >
              Crear primer perfil
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/70 overflow-hidden rounded-3xl border border-slate-800/90 bg-[#111726] shadow-lg shadow-black/30">
            {topPlayers.map((player, index) => {
              const isLeader = index === 0;
              return (
                <div
                  key={player.id}
                  className="flex items-center justify-between gap-3 px-4 py-3.5 transition hover:bg-slate-800/30"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold ${
                        isLeader
                          ? "bg-[#CCFF00] text-slate-950 shadow-neon"
                          : "bg-slate-800/90 text-slate-300"
                      }`}
                    >
                      #{index + 1}
                    </span>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-bold text-white">
                          {player.name}
                        </p>
                        <span className="shrink-0 rounded-md border border-slate-700 bg-slate-800/80 px-1.5 py-0.5 text-[10px] font-semibold text-slate-300">
                          {player.category}
                        </span>
                      </div>
                      <p className="truncate text-[11px] text-slate-400">
                        {player.favoriteRacket}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-sm font-extrabold text-[#CCFF00]">
                      {player.points} pts
                    </p>
                    <p className="text-[11px] font-medium text-slate-400">
                      <span className="text-emerald-400">{player.wins}G</span>
                      {" - "}
                      <span className="text-rose-400">{player.losses}P</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Últimos Partidos Jugados */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swords className="h-5 w-5 text-[#CCFF00]" />
            <h2 className="text-base font-bold text-white">Últimos Partidos</h2>
          </div>
          <span className="text-xs text-slate-400">2 vs 2</span>
        </div>

        {recentMatches.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-800 bg-[#111726]/60 p-8 text-center space-y-3">
            <p className="text-sm text-slate-400">
              Todavía no se cargaron resultados de partidos.
            </p>
            <Link
              href="/matches/new"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#CCFF00] px-4 py-2.5 text-xs font-extrabold text-slate-950"
            >
              <Plus className="h-4 w-4" />
              Registrar primer partido
            </Link>
          </div>
        ) : (
          <div className="space-y-3.5">
            {recentMatches.map((match) => {
              const teamAWon = match.setsTeamA > match.setsTeamB;
              const setList = match.exactScore
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);

              return (
                <article
                  key={match.id}
                  className="rounded-3xl border border-slate-800/90 bg-[#111726] p-4 shadow-lg shadow-black/35 transition hover:border-slate-700"
                >
                  {/* Meta: Club y Fecha */}
                  <div className="mb-3 flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5 text-[11px] text-slate-400">
                    <span className="inline-flex items-center gap-1.5 truncate font-medium text-slate-300">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-[#CCFF00]" />
                      <span className="truncate">{match.location}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 shrink-0">
                      <Calendar className="h-3 w-3" />
                      {formatMatchDate(match.date)}
                    </span>
                  </div>

                  {/* Marcador Equipos */}
                  <div className="space-y-2.5">
                    {/* Equipo A */}
                    <div
                      className={`flex items-center justify-between rounded-2xl px-3 py-2.5 ${
                        teamAWon
                          ? "border border-[#CCFF00]/35 bg-[#CCFF00]/[0.07]"
                          : "bg-slate-900/60"
                      }`}
                    >
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Equipo A
                          </span>
                          {teamAWon && (
                            <span className="rounded-full bg-[#CCFF00] px-2 py-0.5 text-[9px] font-extrabold uppercase text-slate-950">
                              Ganador
                            </span>
                          )}
                        </div>
                        <p
                          className={`truncate text-sm font-semibold ${
                            teamAWon ? "text-white" : "text-slate-300"
                          }`}
                        >
                          {match.teamAPlayer1.name} · {match.teamAPlayer2.name}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-1">
                          {setList.map((setStr, idx) => {
                            const [scoreA] = setStr.split("-");
                            return (
                              <span
                                key={idx}
                                className="w-6 rounded-md bg-slate-950/70 py-1 text-center text-xs font-bold text-slate-300"
                              >
                                {scoreA ?? "-"}
                              </span>
                            );
                          })}
                        </div>
                        <span
                          className={`ml-1 flex h-8 w-8 items-center justify-center rounded-xl text-sm font-black ${
                            teamAWon
                              ? "bg-[#CCFF00] text-slate-950"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {match.setsTeamA}
                        </span>
                      </div>
                    </div>

                    {/* Equipo B */}
                    <div
                      className={`flex items-center justify-between rounded-2xl px-3 py-2.5 ${
                        !teamAWon
                          ? "border border-[#CCFF00]/35 bg-[#CCFF00]/[0.07]"
                          : "bg-slate-900/60"
                      }`}
                    >
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Equipo B
                          </span>
                          {!teamAWon && (
                            <span className="rounded-full bg-[#CCFF00] px-2 py-0.5 text-[9px] font-extrabold uppercase text-slate-950">
                              Ganador
                            </span>
                          )}
                        </div>
                        <p
                          className={`truncate text-sm font-semibold ${
                            !teamAWon ? "text-white" : "text-slate-300"
                          }`}
                        >
                          {match.teamBPlayer1.name} · {match.teamBPlayer2.name}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-1">
                          {setList.map((setStr, idx) => {
                            const [, scoreB] = setStr.split("-");
                            return (
                              <span
                                key={idx}
                                className="w-6 rounded-md bg-slate-950/70 py-1 text-center text-xs font-bold text-slate-300"
                              >
                                {scoreB ?? "-"}
                              </span>
                            );
                          })}
                        </div>
                        <span
                          className={`ml-1 flex h-8 w-8 items-center justify-center rounded-xl text-sm font-black ${
                            !teamAWon
                              ? "bg-[#CCFF00] text-slate-950"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {match.setsTeamB}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
