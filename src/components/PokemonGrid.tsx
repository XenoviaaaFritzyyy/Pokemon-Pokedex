import { Pokemon } from '../types';

interface PokemonGridProps {
  pokemon: Pokemon[];
  is3D: boolean;
  isShiny: boolean;
  handlePokemonClick: (pokemon: Pokemon) => void;
}

const PokemonGrid = ({ pokemon, is3D, isShiny, handlePokemonClick }: PokemonGridProps) => {
  return (
    <div className="pokemon-grid">
      {pokemon.map((poke) => (
        <div 
          key={poke.id} 
          className="pokemon-card"
          onClick={() => handlePokemonClick(poke)}
        >
          <img 
            src={
              is3D 
                ? (isShiny 
                    ? poke.sprites.other?.home?.front_shiny 
                    : poke.sprites.other?.home?.front_default) 
                || (isShiny ? poke.sprites.front_shiny : poke.sprites.front_default)
                : (isShiny ? poke.sprites.front_shiny : poke.sprites.front_default)
            } 
            alt={poke.name} 
          />
          <h3>#{poke.id.toString().padStart(3, '0')} {poke.name}</h3>
          <div className="types">
            {poke.types.map((type, index) => (
              <span key={index} className={`type ${type.type.name}`}>
                {type.type.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PokemonGrid; 