"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { createPlayerAction } from "@/actions/player.actions";
import { PADEL_CATEGORIES, POPULAR_RACKETS } from "@/lib/constants";

export function NewPlayerForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>("6ta");
  const [favoriteRacket, setFavoriteRacket] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const res = await createPlayerAction({
        name,
        category,
        favoriteRacket,
      });

      if (!res.success) {
        setError(res.error ?? "Error al guardar el jugador.");
        return;
      }

      router.push("/players");
      router.refresh();
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-3xl border border-slate-800 bg-[#111726] p-5 shadow-lg shadow-black/30"
    >
      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-200">
          Nombre y Apellido
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej. Matías Gómez"
          required
          className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-3.5 py-3 text-sm text-white outline-none focus:border-[#CCFF00]"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-200">
          Categoría
        </label>
        <div className="grid grid-cols-4 gap-2">
          {PADEL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`rounded-xl py-2.5 text-xs font-extrabold transition ${
                category === cat
                  ? "bg-[#CCFF00] text-slate-950 shadow-neon"
                  : "border border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-200">
          Pala / Equipamiento Favorito
        </label>
        <input
          type="text"
          value={favoriteRacket}
          onChange={(e) => setFavoriteRacket(e.target.value)}
          placeholder="Ej. Babolat Air Viper 2025"
          required
          className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-3.5 py-3 text-sm text-white outline-none focus:border-[#CCFF00]"
        />
        <div className="flex flex-wrap gap-1.5 pt-1">
          {POPULAR_RACKETS.map((racket) => (
            <button
              key={racket}
              type="button"
              onClick={() => setFavoriteRacket(racket)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
                favoriteRacket === racket
                  ? "bg-[#CCFF00] text-slate-950 font-bold"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {racket}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#CCFF00] py-3.5 text-sm font-extrabold uppercase tracking-wide text-slate-950 shadow-neon transition active:scale-[0.99] disabled:opacity-60"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Registrando...
          </>
        ) : (
          <>
            <CheckCircle2 className="h-4 w-4 stroke-[2.5]" />
            Guardar Perfil
          </>
        )}
      </button>
    </form>
  );
}
