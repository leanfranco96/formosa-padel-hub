import Link from "next/link";
import { ArrowLeft, UserPlus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { NewMatchForm } from "@/components/matches/NewMatchForm";

export const dynamic = "force-dynamic";

export default async function NewMatchPage() {
  const players = await prisma.player.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      category: true,
      favoriteRacket: true,
    },
  });

  return (
    <main className="space-y-5">
      <header className="flex items-center gap-3">
        <Link
          href="/"
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-800 bg-[#111726] text-slate-300 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-extrabold text-white">Cargar Partido</h1>
          <p className="text-xs text-slate-400">
            Modalidad 2 vs 2 · Actualización inmediata de ranking
          </p>
        </div>
      </header>

      {players.length < 4 ? (
        <div className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6 text-center space-y-3">
          <p className="text-sm font-semibold text-amber-200">
            Necesitas al menos 4 jugadores registrados para cargar un partido 2
            vs 2 (actualmente hay {players.length}).
          </p>
          <Link
            href="/players/new"
            className="inline-flex items-center gap-2 rounded-2xl bg-[#CCFF00] px-4 py-2.5 text-xs font-extrabold text-slate-950"
          >
            <UserPlus className="h-4 w-4" />
            Registrar Jugadores
          </Link>
        </div>
      ) : (
        <NewMatchForm players={players} />
      )}
    </main>
  );
}
