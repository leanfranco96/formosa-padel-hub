import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NewPlayerForm } from "@/components/players/NewPlayerForm";

export default function NewPlayerPage() {
  return (
    <main className="space-y-5">
      <header className="flex items-center gap-3">
        <Link
          href="/players"
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-800 bg-[#111726] text-slate-300 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-extrabold text-white">Nuevo Jugador</h1>
          <p className="text-xs text-slate-400">
            Registra categoría y equipamiento oficial
          </p>
        </div>
      </header>

      <NewPlayerForm />
    </main>
  );
}
