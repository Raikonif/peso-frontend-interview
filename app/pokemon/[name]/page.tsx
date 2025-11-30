"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePokemonDetail } from "@/hooks/usePokemonDetail";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { ErrorBanner } from "@/components/ErrorBanner";
import { ApiSimulatorControl } from "@/components/ApiSimulatorControl";

// Colores por tipo
const typeColors: Record<string, string> = {
  normal: "bg-gray-400",
  fire: "bg-orange-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400",
  grass: "bg-green-500",
  ice: "bg-cyan-400",
  fighting: "bg-red-700",
  poison: "bg-purple-500",
  ground: "bg-amber-600",
  flying: "bg-indigo-400",
  psychic: "bg-pink-500",
  bug: "bg-lime-500",
  rock: "bg-stone-500",
  ghost: "bg-purple-700",
  dragon: "bg-violet-600",
  dark: "bg-gray-700",
  steel: "bg-slate-400",
  fairy: "bg-pink-400",
};

const typeGradients: Record<string, string> = {
  normal: "from-gray-200 to-gray-300",
  fire: "from-orange-200 to-red-300",
  water: "from-blue-200 to-cyan-300",
  electric: "from-yellow-200 to-amber-300",
  grass: "from-green-200 to-emerald-300",
  ice: "from-cyan-200 to-blue-300",
  fighting: "from-red-200 to-orange-300",
  poison: "from-purple-200 to-pink-300",
  ground: "from-amber-200 to-yellow-300",
  flying: "from-indigo-200 to-blue-300",
  psychic: "from-pink-200 to-purple-300",
  bug: "from-lime-200 to-green-300",
  rock: "from-stone-200 to-gray-300",
  ghost: "from-purple-200 to-indigo-300",
  dragon: "from-violet-200 to-purple-300",
  dark: "from-gray-300 to-slate-400",
  steel: "from-slate-200 to-gray-300",
  fairy: "from-pink-200 to-rose-300",
};

// Nombres de stats en español
const statNames: Record<string, string> = {
  hp: "PS",
  attack: "Ataque",
  defense: "Defensa",
  "special-attack": "At. Esp.",
  "special-defense": "Def. Esp.",
  speed: "Velocidad",
};

// Colores de stats
const statColors: Record<string, string> = {
  hp: "bg-red-500",
  attack: "bg-orange-500",
  defense: "bg-yellow-500",
  "special-attack": "bg-blue-500",
  "special-defense": "bg-green-500",
  speed: "bg-pink-500",
};

interface PageProps {
  params: Promise<{ name: string }>;
}

export default function PokemonDetailPage({ params }: PageProps) {
  const { name } = use(params);
  const { pokemon, isLoading, isError, error, refetch, isFetching } =
    usePokemonDetail(name);

  const primaryType = pokemon?.types[0]?.type.name || "normal";
  const gradient = typeGradients[primaryType] || typeGradients.normal;

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Volver al listado
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* API Simulator */}
        <div className="mb-8">
          <ApiSimulatorControl />
        </div>

        {/* Loading */}
        {isLoading && <LoadingSkeleton type="detail" />}

        {/* Error */}
        {isError && (
          <div className="space-y-6">
            <ErrorBanner
              error={error}
              onRetry={() => refetch()}
              isRetrying={isFetching}
            />
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                <svg
                  className="w-10 h-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No se pudo cargar el Pokémon &quot;{name}&quot;
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Usa el botón &quot;Reintentar&quot; para volver a intentar
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Volver al inicio
              </Link>
            </div>
          </div>
        )}

        {/* Detalle */}
        {pokemon && !isLoading && !isError && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Header con imagen */}
              <div
                className={`relative bg-gradient-to-br ${gradient} p-8 pb-16`}
              >
                {/* Refresh indicator */}
                {isFetching && (
                  <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-white/80 rounded-full text-sm text-gray-600">
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Actualizando...
                  </div>
                )}

                {/* ID Badge */}
                <span className="absolute top-4 left-4 px-3 py-1 bg-black/10 rounded-full text-sm font-mono text-gray-700">
                  #{pokemon.id.toString().padStart(3, "0")}
                </span>

                {/* Pokemon Image */}
                <div className="flex justify-center">
                  {pokemon.sprites.other?.["official-artwork"]?.front_default ? (
                    <Image
                      src={pokemon.sprites.other["official-artwork"].front_default}
                      alt={pokemon.name}
                      width={280}
                      height={280}
                      className="drop-shadow-2xl"
                      priority
                    />
                  ) : (
                    <div className="w-64 h-64 bg-gray-200 rounded-full flex items-center justify-center">
                      <svg
                        className="w-32 h-32 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-8 -mt-8">
                {/* Name and Types */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                  <h1 className="text-4xl font-bold capitalize text-gray-800 mb-4">
                    {pokemon.name}
                  </h1>
                  <div className="flex gap-3 flex-wrap">
                    {pokemon.types.map((type) => (
                      <span
                        key={type.type.name}
                        className={`px-4 py-2 ${typeColors[type.type.name] || "bg-gray-400"} text-white font-medium rounded-full capitalize shadow-md`}
                      >
                        {type.type.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Info básica */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-gray-500 text-sm mb-1">Altura</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {(pokemon.height / 10).toFixed(1)}m
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-gray-500 text-sm mb-1">Peso</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {(pokemon.weight / 10).toFixed(1)}kg
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-gray-500 text-sm mb-1">Exp. Base</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {pokemon.base_experience || "N/A"}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-gray-500 text-sm mb-1">Habilidades</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {pokemon.abilities.length}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Estadísticas Base
                  </h2>
                  <div className="space-y-4">
                    {pokemon.stats.map((stat) => (
                      <div key={stat.stat.name}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 font-medium">
                            {statNames[stat.stat.name] || stat.stat.name}
                          </span>
                          <span className="font-bold text-gray-800">
                            {stat.base_stat}
                          </span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${statColors[stat.stat.name] || "bg-gray-500"} rounded-full transition-all duration-500`}
                            style={{
                              width: `${Math.min((stat.base_stat / 255) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-700">Total</span>
                      <span className="font-bold text-gray-800">
                        {pokemon.stats.reduce((acc, stat) => acc + stat.base_stat, 0)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Abilities */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Habilidades
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {pokemon.abilities.map((ability) => (
                      <span
                        key={ability.ability.name}
                        className={`px-4 py-2 rounded-lg font-medium capitalize ${
                          ability.is_hidden
                            ? "bg-purple-100 text-purple-700 border border-purple-200"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {ability.ability.name.replace("-", " ")}
                        {ability.is_hidden && (
                          <span className="ml-2 text-xs opacity-75">
                            (Oculta)
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sprites */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Sprites
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {pokemon.sprites.front_default && (
                      <div className="bg-white rounded-lg p-4 text-center">
                        <Image
                          src={pokemon.sprites.front_default}
                          alt="Front"
                          width={96}
                          height={96}
                          className="mx-auto"
                        />
                        <p className="text-xs text-gray-500 mt-2">Frontal</p>
                      </div>
                    )}
                    {pokemon.sprites.back_default && (
                      <div className="bg-white rounded-lg p-4 text-center">
                        <Image
                          src={pokemon.sprites.back_default}
                          alt="Back"
                          width={96}
                          height={96}
                          className="mx-auto"
                        />
                        <p className="text-xs text-gray-500 mt-2">Trasero</p>
                      </div>
                    )}
                    {pokemon.sprites.front_shiny && (
                      <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg p-4 text-center border border-yellow-200">
                        <Image
                          src={pokemon.sprites.front_shiny}
                          alt="Shiny"
                          width={96}
                          height={96}
                          className="mx-auto"
                        />
                        <p className="text-xs text-yellow-600 mt-2">✨ Shiny</p>
                      </div>
                    )}
                    {pokemon.sprites.back_shiny && (
                      <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg p-4 text-center border border-yellow-200">
                        <Image
                          src={pokemon.sprites.back_shiny}
                          alt="Shiny Back"
                          width={96}
                          height={96}
                          className="mx-auto"
                        />
                        <p className="text-xs text-yellow-600 mt-2">
                          ✨ Shiny Trasero
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
