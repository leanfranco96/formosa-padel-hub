"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { POINTS_PER_LOSS, POINTS_PER_WIN } from "@/lib/constants";

export interface CreateMatchInput {
  teamA_player1_id: string;
  teamA_player2_id: string;
  teamB_player1_id: string;
  teamB_player2_id: string;
  setsTeamA: number;
  setsTeamB: number;
  exactScore: string;
  date: string;
  location: string;
}

export interface ActionResult {
  success: boolean;
  error?: string;
}

export async function createMatchAction(
  input: CreateMatchInput
): Promise<ActionResult> {
  try {
    const {
      teamA_player1_id,
      teamA_player2_id,
      teamB_player1_id,
      teamB_player2_id,
      setsTeamA,
      setsTeamB,
      exactScore,
      date,
      location,
    } = input;

    const playerIds = [
      teamA_player1_id,
      teamA_player2_id,
      teamB_player1_id,
      teamB_player2_id,
    ];

    if (playerIds.some((id) => !id || id.trim() === "")) {
      return {
        success: false,
        error: "Debes seleccionar los 4 jugadores del partido.",
      };
    }

    if (new Set(playerIds).size !== 4) {
      return {
        success: false,
        error: "Un mismo jugador no puede repetirse en el partido.",
      };
    }

    if (setsTeamA === setsTeamB) {
      return {
        success: false,
        error: "El partido debe tener un equipo ganador definido en sets.",
      };
    }

    if (!exactScore.trim()) {
      return {
        success: false,
        error: "Ingresa el resultado exacto de al menos los sets jugados.",
      };
    }

    if (!location.trim()) {
      return {
        success: false,
        error: "Indica el club o cancha donde se jugó el partido.",
      };
    }

    const parsedDate = date ? new Date(date) : new Date();
    if (Number.isNaN(parsedDate.getTime())) {
      return {
        success: false,
        error: "La fecha ingresada no es válida.",
      };
    }

    const teamAWon = setsTeamA > setsTeamB;
    const winnerIds = teamAWon
      ? [teamA_player1_id, teamA_player2_id]
      : [teamB_player1_id, teamB_player2_id];
    const loserIds = teamAWon
      ? [teamB_player1_id, teamB_player2_id]
      : [teamA_player1_id, teamA_player2_id];

    await prisma.$transaction([
      prisma.match.create({
        data: {
          teamA_player1_id,
          teamA_player2_id,
          teamB_player1_id,
          teamB_player2_id,
          setsTeamA,
          setsTeamB,
          exactScore: exactScore.trim(),
          date: parsedDate,
          location: location.trim(),
        },
      }),
      prisma.player.updateMany({
        where: { id: { in: winnerIds } },
        data: {
          wins: { increment: 1 },
          points: { increment: POINTS_PER_WIN },
        },
      }),
      prisma.player.updateMany({
        where: { id: { in: loserIds } },
        data: {
          losses: { increment: 1 },
          points: { increment: POINTS_PER_LOSS },
        },
      }),
    ]);

    revalidatePath("/");
    revalidatePath("/ranking");
    revalidatePath("/players");

    return { success: true };
  } catch (error) {
    console.error("Error al registrar partido:", error);
    return {
      success: false,
      error: "Ocurrió un error inesperado al guardar el partido.",
    };
  }
}
