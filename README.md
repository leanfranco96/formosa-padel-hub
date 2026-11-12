# Formosa Pádel Hub — Plataforma de Gestión de Partidos y Ranking

Aplicación web **Mobile-First** diseñada para jugadores y clubes de pádel, que permite registrar resultados 2 vs 2 al instante desde el celular al finalizar el turno, gestionar perfiles con su equipamiento y actualizar automáticamente la tabla de clasificación.

---

## Stack Tecnológico

- **Framework:** Next.js 15 (App Router, Server Components & Server Actions)
- **Lenguaje:** TypeScript (Tipado estricto de extremo a extremo)
- **Estilos y UI:** Tailwind CSS (Diseño *Mobile-First*, tema oscuro con acentos flúor `#CCFF00`)
- **ORM y Base de Datos:** Prisma ORM + SQLite (fácilmente migrable a PostgreSQL / Supabase / Neon)
- **Iconografía:** Lucide React

---

## Decisiones Técnicas Destacadas

1. **Relaciones Múltiples Desambiguadas en Prisma (`2 vs 2`):**
   El modelo `Match` referencia cuatro veces al modelo `Player` (`teamA_player1_id`, `teamA_player2_id`, `teamB_player1_id`, `teamB_player2_id`) utilizando relaciones explícitas nombradas (`@relation("TeamAPlayer1")`, etc.) e índices compuestos para optimizar el cálculo del ranking.
2. **Actualización Atómica de Ranking (`prisma.$transaction`):**
   Al registrar un partido mediante Server Actions (`createMatchAction`), la creación del partido y el incremento de victorias (`+3 pts`) y derrotas (`+1 pt`) de los 4 jugadores se ejecutan dentro de una transacción atómica, garantizando consistencia de datos.
3. **UX Pensada para Cancha (Mobile-First):**
   - Prevención en tiempo real de jugadores duplicados en los selectores 2 vs 2.
   - Cálculo automático de sets ganados (`setsTeamA`, `setsTeamB`) y marcador exacto (`6-4, 4-6, 7-6`) con teclado numérico móvil (`inputMode="numeric"`).
   - *Quick-chips* para selección rápida de clubes.

---

## Estructura del Proyecto

```text
├── prisma/
│   ├── schema.prisma        # Modelos Player y Match con relaciones 2vs2
│   └── seed.ts              # Datos semilla (jugadores, palas y partidos de prueba)
├── src/
│   ├── actions/             # Server Actions (transacciones de partidos y alta de jugadores)
│   ├── app/                 # Rutas de Next.js App Router (Dashboard, Ranking, Partidos, Jugadores)
│   ├── components/          # Componentes de interfaz (NewMatchForm, NewPlayerForm, MobileNav)
│   └── lib/                 # Singleton de PrismaClient y constantes de dominio
├── .env.example             # Plantilla de variables de entorno
└── tailwind.config.ts       # Configuración de diseño y paleta de colores
```

---

## Instalación y Ejecución Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/TU_USUARIO/formosa-padel-hub.git
   cd formosa-padel-hub
   ```

2. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   ```

3. **Instalar dependencias:**
   ```bash
   npm install
   ```

4. **Sincronizar la base de datos y cargar datos de prueba:**
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abrir [http://localhost:3000](http://localhost:3000) en el navegador.
