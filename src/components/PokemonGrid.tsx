import { useState, useMemo } from 'react';
import { Pokemon } from '../types';

interface PokemonGridProps {
  pokemon: Pokemon[];
  is3D: boolean;
  handlePokemonClick: (pokemon: Pokemon) => void;
  sortOrder: string;
}

const PokemonGrid = ({ pokemon, is3D, handlePokemonClick, sortOrder }: PokemonGridProps) => {
  const [animatedPokemon, setAnimatedPokemon] = useState<number | null>(null);

  const handleMouseEnter = (pokeId: number) => {
    setAnimatedPokemon(pokeId);
  };

  const handleMouseLeave = () => {
    setAnimatedPokemon(null);
  };

  const sortedPokemon = useMemo(() => {
    const pokemonCopy = [...pokemon];
    
    switch (sortOrder) {
      case 'name-asc':
        return pokemonCopy.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return pokemonCopy.sort((a, b) => b.name.localeCompare(a.name));
      case 'height-asc':
        return pokemonCopy.sort((a, b) => a.height - b.height);
      case 'height-desc':
        return pokemonCopy.sort((a, b) => b.height - a.height);
      case 'weight-asc':
        return pokemonCopy.sort((a, b) => a.weight - b.weight);
      case 'weight-desc':
        return pokemonCopy.sort((a, b) => b.weight - a.weight);
      default: // 'dex-number'
        return pokemonCopy.sort((a, b) => a.id - b.id);
    }
  }, [pokemon, sortOrder]);

  return (
    <div className="pokemon-grid">
      {sortedPokemon.map((poke) => (
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