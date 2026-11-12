"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  MapPin,
  Calendar,
  Plus,
  Trash2,
  Trophy,
  AlertCircle,
  Loader2,
  Users,
} from "lucide-react";
import { createMatchAction } from "@/actions/match.actions";
import { FORMOSA_CLUBS } from "@/lib/constants";

export interface PlayerOption {
  id: string;
  name: string;
  category: string;
  favoriteRacket: string;
}

interface SetScore {
  gamesA: string;
  gamesB: string;
}

interface NewMatchFormProps {
  players: PlayerOption[];
}

export function NewMatchForm({ players }: NewMatchFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Selección de los 4 jugadores (2 vs 2)
  const [teamAP1, setTeamAP1] = useState("");
  const [teamAP2, setTeamAP2] = useState("");
  const [teamBP1, setTeamBP1] = useState("");
  const [teamBP2, setTeamBP2] = useState("");

  // Sets dinámicos (por defecto 2 sets, con opción a 3er set / super tie-break)
  const [sets, setSets] = useState<SetScore[]>([
    { gamesA: "6", gamesB: "4" },
    { gamesA: "6", gamesB: "3" },
  ]);

  // Fecha actual por defecto (formato YYYY-MM-DDTHH:mm) y club en Formosa
  const [date, setDate] = useState(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  });
  const [location, setLocation] = useState<string>(FORMOSA_CLUBS[0]);
  const [error, setError] = useState<string | null>(null);

  const selectedIds = useMemo(
    () => [teamAP1, teamAP2, teamBP1, teamBP2].filter(Boolean),
    [teamAP1, teamAP2, teamBP1, teamBP2]
  );

  // Cálculo automático de sets ganados y string exactScore (ej. "6-4, 4-6, 7-6")
  const scoreSummary = useMemo(() => {
    let setsTeamA = 0;
    let setsTeamB = 0;
    const formattedSets: string[] = [];

    for (const s of sets) {
      const a = parseInt(s.gamesA, 10);
      const b = parseInt(s.gamesB, 10);
      if (!Number.isNaN(a) && !Number.isNaN(b)) {
        formattedSets.push(`${a}-${b}`);
        if (a > b) setsTeamA += 1;
        else if (b > a) setsTeamB += 1;
      }
    }

    return {
      setsTeamA,
      setsTeamB,
      exactScore: formattedSets.join(", "),
    };
  }, [sets]);

  const handleSetChange = (
    index: number,
    team: "gamesA" | "gamesB",
    value: string
  ) => {
    const sanitized = value.replace(/\D/g, "").slice(0, 2);
    setSets((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, [team]: sanitized } : item
      )
    );
  };

  const addThirdSet = () => {
    if (sets.length < 3) {
      setSets((prev) => [...prev, { gamesA: "7", gamesB: "6" }]);
    }
  };

  const removeThirdSet = () => {
    if (sets.length > 2) {
      setSets((prev) => prev.slice(0, 2));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (selectedIds.length < 4 || new Set(selectedIds).size !== 4) {
      setError("Debes elegir 4 jugadores distintos para el partido 2 vs 2.");
      return;
    }

    if (scoreSummary.setsTeamA === scoreSummary.setsTeamB) {
      setError(
        "El marcador en sets está empatado. Ajusta los sets o agrega el 3er set definitorio."
      );
      return;
    }

    startTransition(async () => {
      const result = await createMatchAction({
        teamA_player1_id: teamAP1,
        teamA_player2_id: teamAP2,
        teamB_player1_id: teamBP1,
        teamB_player2_id: teamBP2,
        setsTeamA: scoreSummary.setsTeamA,
        setsTeamB: scoreSummary.setsTeamB,
        exactScore: scoreSummary.exactScore,
        date,
        location,
      });

      if (!result.success) {
        setError(result.error ?? "No se pudo registrar el partido.");
        return;
      }

      router.push("/");
      router.refresh();
    });
  };

  const renderPlayerSelect = (
    label: string,
    value: string,
    onChange: (val: string) => void
  ) => (
    <div className="space-y-1">
      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="w-full rounded-2xl border border-slate-700/90 bg-slate-950/90 px-3.5 py-3 text-sm font-medium text-white outline-none transition focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]"
      >
        <option value="">Seleccionar jugador...</option>
        {players.map((p) => {
          const alreadyChosen = selectedIds.includes(p.id) && p.id !== value;
          return (
            <option key={p.id} value={p.id} disabled={alreadyChosen}>
              {p.name} ({p.category}){alreadyChosen ? " — Ya elegido" : ""}
            </option>
          );
        })}
      </select>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-3.5 text-xs font-medium text-rose-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Selección de Parejas 2 vs 2 */}
      <div className="space-y-4 rounded-3xl border border-slate-800 bg-[#111726] p-4 shadow-lg shadow-black/30">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Users className="h-4 w-4 text-[#CCFF00]" />
          <h2 className="text-sm font-bold text-white">Equipos (2 vs 2)</h2>
        </div>

        {/* Equipo A */}
        <div className="space-y-3 rounded-2xl border border-slate-800/90 bg-slate-900/50 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#CCFF00]">
              Equipo A
            </span>
            {scoreSummary.setsTeamA > scoreSummary.setsTeamB && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#CCFF00]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#CCFF00]">
                <Trophy className="h-3 w-3" /> Ganando
              </span>
            )}
          </div>
          {renderPlayerSelect("Jugador 1 (Drive / Revés)", teamAP1, setTeamAP1)}
          {renderPlayerSelect("Jugador 2 (Compañero)", teamAP2, setTeamAP2)}
        </div>

        <div className="flex items-center justify-center">
          <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-0.5 text-[11px] font-black tracking-widest text-slate-400">
            VS
          </span>
        </div>

        {/* Equipo B */}
        <div className="space-y-3 rounded-2xl border border-slate-800/90 bg-slate-900/50 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-sky-400">
              Equipo B
            </span>
            {scoreSummary.setsTeamB > scoreSummary.setsTeamA && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#CCFF00]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#CCFF00]">
                <Trophy className="h-3 w-3" /> Ganando
              </span>
            )}
          </div>
          {renderPlayerSelect("Jugador 1 (Drive / Revés)", teamBP1, setTeamBP1)}
          {renderPlayerSelect("Jugador 2 (Compañero)", teamBP2, setTeamBP2)}
        </div>
      </div>

      {/* Carga de Resultado por Sets */}
      <div className="space-y-4 rounded-3xl border border-slate-800 bg-[#111726] p-4 shadow-lg shadow-black/30">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-white">Resultado por Sets</h2>
          <span className="rounded-xl bg-[#CCFF00]/15 px-2.5 py-1 text-xs font-extrabold text-[#CCFF00]">
            Sets: {scoreSummary.setsTeamA} - {scoreSummary.setsTeamB}
          </span>
        </div>

        <div className="space-y-3">
          {sets.map((setItem, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-3 rounded-2xl bg-slate-900/70 px-3.5 py-2.5"
            >
              <span className="text-xs font-bold text-slate-300 w-16">
                Set {idx + 1}
              </span>

              <div className="flex items-center gap-2.5">
                <div className="text-center">
                  <span className="block text-[10px] text-slate-400 mb-1">
                    Eq. A
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={setItem.gamesA}
                    onChange={(e) =>
                      handleSetChange(idx, "gamesA", e.target.value)
                    }
                    className="h-11 w-14 rounded-xl border border-slate-700 bg-slate-950 text-center text-base font-extrabold text-white outline-none focus:border-[#CCFF00]"
                    required
                  />
                </div>

                <span className="mt-4 text-sm font-bold text-slate-500">-</span>

                <div className="text-center">
                  <span className="block text-[10px] text-slate-400 mb-1">
                    Eq. B
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={setItem.gamesB}
                    onChange={(e) =>
                      handleSetChange(idx, "gamesB", e.target.value)
                    }
                    className="h-11 w-14 rounded-xl border border-slate-700 bg-slate-950 text-center text-base font-extrabold text-white outline-none focus:border-[#CCFF00]"
                    required
                  />
                </div>
              </div>

              {idx === 2 ? (
                <button
                  type="button"
                  onClick={removeThirdSet}
                  className="mt-3 rounded-xl p-2 text-rose-400 hover:bg-rose-500/10"
                  aria-label="Quitar tercer set"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              ) : (
                <div className="w-8" />
              )}
            </div>
          ))}
        </div>

        {sets.length < 3 && (
          <button
            type="button"
            onClick={addThirdSet}
            className="flex w-full items-center justify-center gap-1.5 rounded-2xl border border-dashed border-slate-700 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-[#CCFF00] hover:text-[#CCFF00]"
          >
            <Plus className="h-4 w-4" />
            Agregar 3er Set / Super Tie-Break
          </button>
        )}

        <div className="rounded-xl bg-slate-950/70 px-3 py-2 text-center text-xs text-slate-400">
          Marcador exacto:{" "}
          <strong className="text-white">
            {scoreSummary.exactScore || "Sin definir"}
          </strong>
        </div>
      </div>

      {/* Fecha y Club en Formosa */}
      <div className="space-y-4 rounded-3xl border border-slate-800 bg-[#111726] p-4 shadow-lg shadow-black/30">
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-white">
            <MapPin className="h-4 w-4 text-[#CCFF00]" />
            Club / Cancha (Formosa)
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ej. La Ribera Pádel Club - Formosa"
            required
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-3.5 py-3 text-sm text-white outline-none focus:border-[#CCFF00]"
          />
          {/* Chips rápidos para selección con el pulgar */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {FORMOSA_CLUBS.map((club) => (
              <button
                key={club}
                type="button"
                onClick={() => setLocation(club)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
                  location === club
                    ? "bg-[#CCFF00] text-slate-950 font-bold"
                    : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {club.replace(" - Formosa", "")}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-white">
            <Calendar className="h-4 w-4 text-[#CCFF00]" />
            Fecha y Hora del Turno
          </label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-3.5 py-3 text-sm text-white outline-none focus:border-[#CCFF00]"
          />
        </div>
      </div>

      {/* Botón Principal Mobile-First */}
      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#CCFF00] py-4 text-sm font-extrabold uppercase tracking-wide text-slate-950 shadow-neon transition active:scale-[0.99] disabled:opacity-60"
      >
        {isPending ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Guardando Partido...
          </>
        ) : (
          <>
            <CheckCircle2 className="h-5 w-5 stroke-[2.5]" />
            Confirmar Resultado
          </>
        )}
      </button>
    </form>
  );
}
