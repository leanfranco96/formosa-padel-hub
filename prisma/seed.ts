import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const existingPlayers = await prisma.player.count();
  if (existingPlayers > 0) {
    console.log("La base de datos ya cuenta con datos iniciales.");
    return;
  }

  const playersData = [
    {
      name: "Matías Gómez",
      category: "5ta",
      favoriteRacket: "Babolat Air Viper 2025",
      points: 12,
      wins: 4,
      losses: 0,
    },
    {
      name: "Lucas Benítez",
      category: "5ta",
      favoriteRacket: "Adidas Metalbone 3.4",
      points: 10,
      wins: 3,
      losses: 1,
    },
    {
      name: "Franco Insfrán",
      category: "6ta",
      favoriteRacket: "Nox AT10 Genius 18K",
      points: 8,
      wins: 2,
      losses: 2,
    },
    {
      name: "Nicolás Ayala",
      category: "5ta",
      favoriteRacket: "Bullpadel Vertex 04",
      points: 8,
      wins: 2,
      losses: 2,
    },
    {
      name: "Santiago Vera",
      category: "6ta",
      favoriteRacket: "Head Extreme Pro",
      points: 6,
      wins: 1,
      losses: 3,
    },
    {
      name: "Joaquín Rojas",
      category: "6ta",
      favoriteRacket: "Siux Electra ST3",
      points: 4,
      wins: 0,
      losses: 4,
    },
  ];

  const createdPlayers = [];
  for (const p of playersData) {
    const player = await prisma.player.create({ data: p });
    createdPlayers.push(player);
  }

  const [p1, p2, p3, p4, p5, p6] = createdPlayers;

  await prisma.match.createMany({
    data: [
      {
        teamA_player1_id: p1.id,
        teamA_player2_id: p2.id,
        teamB_player1_id: p3.id,
        teamB_player2_id: p4.id,
        setsTeamA: 2,
        setsTeamB: 1,
        exactScore: "6-4, 4-6, 7-6",
        location: "La Ribera Pádel Club - Formosa",
        date: new Date(Date.now() - 1000 * 60 * 90),
      },
      {
        teamA_player1_id: p3.id,
        teamA_player2_id: p5.id,
        teamB_player1_id: p1.id,
        teamB_player2_id: p4.id,
        setsTeamA: 0,
        setsTeamB: 2,
        exactScore: "3-6, 5-7",
        location: "Formosa Pádel Center",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24),
      },
      {
        teamA_player1_id: p2.id,
        teamA_player2_id: p3.id,
        teamB_player1_id: p5.id,
        teamB_player2_id: p6.id,
        setsTeamA: 2,
        setsTeamB: 0,
        exactScore: "6-2, 6-4",
        location: "El Galpón Pádel - Formosa",
        date: new Date(Date.now() - 1000 * 60 * 60 * 48),
      },
    ],
  });

  console.log("Seed completado con éxito: 6 jugadores y 3 partidos en Formosa.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
