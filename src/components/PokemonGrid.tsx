import { useState } from 'react';
import { Pokemon } from '../types';

interface PokemonGridProps {
  pokemon: Pokemon[];
  is3D: boolean;
  handlePokemonClick: (pokemon: Pokemon) => void;
}

const PokemonGrid = ({ pokemon, is3D, handlePokemonClick }: PokemonGridProps) => {
  const [animatedPokemon, setAnimatedPokemon] = useState<number | null>(null);

  const handleMouseEnter = (pokeId: number) => {
    setAnimatedPokemon(pokeId);
  };

  const handleMouseLeave = () => {
    setAnimatedPokemon(null);
  };

  return (
    <div className="pokemon-grid">
      {pokemon.map((poke) => (
        <div 
          key={poke.id} 
          className="pokemon-card"
          onClick={() => handlePokemonClick(poke)}
          onMouseEnter={() => handleMouseEnter(poke.id)}
          onMouseLeave={handleMouseLeave}
        >
          <img 
            src={
              is3D 
                ? poke.sprites.other?.home?.front_default 
                  || poke.sprites.front_default
                : animatedPokemon === poke.id
                  ? poke.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default 
                    || poke.sprites.front_default
                  : poke.sprites.front_default
            } 
            alt={poke.name}
            className={animatedPokemon === poke.id ? 'animated' : ''}
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