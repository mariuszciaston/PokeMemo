import { useState, useEffect } from "react";
import Info from "./Info";
import { MainProps, Pokemon } from "./types";
import getPokemon from "./getPokemon";
import extractFirstFrame from "./extractFirstFrame";

const Main: React.FC<MainProps> = ({ handleClick, shuffledPokemonList }) => {
  const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);
  const [staticImages, setStaticImages] = useState<{ [key: string]: string }>(
    {},
  );
  const [hoveredPokemon, setHoveredPokemon] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAllPokemon() {
      const allPokemonData = await Promise.all(
        shuffledPokemonList.map((name) => getPokemon(name)),
      );

      const filteredPokemonData = allPokemonData.filter(
        (data): data is Pokemon => !!data,
      );
      setPokemonData(filteredPokemonData);

      const staticImagesMap: { [key: string]: string } = {};
      for (const pokemon of filteredPokemonData) {
        try {
          const staticImage = await extractFirstFrame(
            pokemon.sprites.versions["generation-v"]["black-white"].animated
              .front_default,
          );
          staticImagesMap[pokemon.name] = staticImage;
        } catch (error) {
          console.error(
            `Failed to extract static image for ${pokemon.name}`,
            error,
          );
        }
      }
      setStaticImages(staticImagesMap);
    }

    fetchAllPokemon();
  }, [shuffledPokemonList]);

  if (pokemonData.length === 0) {
    return (
      <main className="relative grid grid-cols-2 gap-4 px-4 sm:grid-cols-3 md:grid-cols-4 md:px-0">
        {shuffledPokemonList.map((name) => (
          <div
            key={name}
            className="flex cursor-pointer flex-col border-4 border-gray-500 bg-gray-300 hover:border-black"
          >
            <div className="aspect-square w-full"></div>
            <p className="flex flex-1 items-center justify-center pb-4 text-xs">
              &nbsp;
            </p>
          </div>
        ))}
        <Info />
      </main>
    );
  }

  return (
    <main className="relative grid grid-cols-2 gap-4 px-4 sm:grid-cols-3 md:grid-cols-4 md:px-0">
      {pokemonData.map((pokemon) => (
        <>
          <div
            key={pokemon.name}
            className={
              "flex cursor-pointer flex-col overflow-hidden border-4 border-gray-500 bg-gray-300 hover:border-black"
            }
            onClick={() => handleClick(pokemon.name)}
            onMouseEnter={() => {
              setHoveredPokemon(pokemon.name);
            }}
            onMouseLeave={() => setHoveredPokemon(null)}
          >
            <img
              src={
                hoveredPokemon === pokemon.name
                  ? pokemon.sprites.versions["generation-v"]["black-white"]
                      .animated.front_default
                  : staticImages[pokemon.name] || ""
              }
              alt={pokemon.name}
              className={`aspect-square scale-[175%] object-scale-down ${pokemon.name === "charmander" ? "translate-x-[0%] translate-y-[2%]" : ""} ${pokemon.name === "charmeleon" ? "translate-x-[8%] translate-y-[2%]" : ""} ${pokemon.name === "charizard" ? "translate-x-[5%] translate-y-[-5%]" : ""} ${pokemon.name === "bulbasaur" ? "translate-x-[-2%] translate-y-[-4%]" : ""} ${pokemon.name === "ivysaur" ? "translate-x-[0%] translate-y-[0%]" : ""} ${pokemon.name === "venusaur" ? "translate-x-[0%] translate-y-[0%]" : ""} ${pokemon.name === "squirtle" ? "translate-x-[0%] translate-y-[-1%]" : ""} ${pokemon.name === "wartortle" ? "translate-x-[2%] translate-y-[2%]" : ""} ${pokemon.name === "blastoise" ? "translate-x-[-1%] translate-y-[-2%]" : ""} ${pokemon.name === "pikachu" ? "translate-x-[3%] translate-y-[-2%]" : ""} ${pokemon.name === "jigglypuff" ? "translate-x-[0%] translate-y-[-7%]" : ""} ${pokemon.name === "chansey" ? "translate-x-[0%] translate-y-[0%]" : ""}`}
            />

            <p className="flex flex-1 items-center justify-center pb-4 text-xs">
              {pokemon.name}
            </p>
          </div>
        </>
      ))}
      <Info />
    </main>
  );
};

export default Main;
