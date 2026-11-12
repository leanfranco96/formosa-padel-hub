"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export interface CreatePlayerInput {
  name: string;
  category: string;
  favoriteRacket: string;
}

export async function createPlayerAction(input: CreatePlayerInput) {
  try {
    const name = input.name.trim();
    const category = input.category.trim();
    const favoriteRacket = input.favoriteRacket.trim();

    if (!name || name.length < 2) {
      return {
        success: false,
        error: "Ingresa un nombre válido (mínimo 2 caracteres).",
      };
    }

    if (!category) {
      return {
        success: false,
        error: "Selecciona la categoría del jugador.",
      };
    }

    if (!favoriteRacket) {
      return {
        success: false,
        error: "Ingresa la pala o equipamiento del jugador.",
      };
    }

    await prisma.player.create({
      data: {
        name,
        category,
        favoriteRacket,
      },
    });

    revalidatePath("/");
    revalidatePath("/players");
    revalidatePath("/matches/new");
    revalidatePath("/ranking");

    return { success: true };
  } catch (error) {
    console.error("Error al crear jugador:", error);
    return {
      success: false,
      error: "No se pudo registrar el jugador.",
    };
  }
}
