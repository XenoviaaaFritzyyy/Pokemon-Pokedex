import { EvolutionChain } from '../types';

interface PokemonEvolutionsProps {
  evolutionChain: EvolutionChain | null;
  fetchPokemonDetails: (id: number) => void;
}

const PokemonEvolutions = ({ evolutionChain, fetchPokemonDetails }: PokemonEvolutionsProps) => {
  if (!evolutionChain) return null;

  return (
    <div className="evolution-chain">
      <h3>Evolution Chain</h3>
      <div className="evolution-stages">
        <div className="evolution-stage">
          <div className="pokemon-evolution" onClick={() => fetchPokemonDetails(evolutionChain.base.id)}>
            <img src={evolutionChain.base.sprite} alt={evolutionChain.base.name} />
            <span>{evolutionChain.base.name}</span>
          </div>
        </div>
        
        {evolutionChain.second_stage.length > 0 && (
          <>
            <div className="evolution-arrow">→</div>
            <div className="evolution-stage">
              {evolutionChain.second_stage.map((pokemon, index) => (
                <div key={index} className="pokemon-evolution" onClick={() => fetchPokemonDetails(pokemon.id)}>
                  <img src={pokemon.sprite} alt={pokemon.name} />
                  <span>{pokemon.name}</span>
                  {pokemon.evolution_details && (
                    <small>
                      {pokemon.evolution_details.min_level && `Level ${pokemon.evolution_details.min_level}`}
                      {pokemon.evolution_details.item && `Use ${pokemon.evolution_details.item.replace('-', ' ')}`}
                      {pokemon.evolution_details.trade && 'Trade'}
                      {pokemon.evolution_details.held_item && `Hold ${pokemon.evolution_details.held_item.replace('-', ' ')}`}
                      {pokemon.evolution_details.min_happiness && 'High Friendship'}
                      {pokemon.evolution_details.time_of_day && `During ${pokemon.evolution_details.time_of_day}`}
                      {pokemon.evolution_details.location && `At ${pokemon.evolution_details.location.replace('-', ' ')}`}
                      {pokemon.evolution_details.known_move && `Knows ${pokemon.evolution_details.known_move.replace('-', ' ')}`}
                    </small>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
        
        {evolutionChain.final_stage.length > 0 && (
          <>
            <div className="evolution-arrow">→</div>
            <div className="evolution-stage">
              {evolutionChain.final_stage.map((pokemon, index) => (
                <div key={index} className="pokemon-evolution" onClick={() => fetchPokemonDetails(pokemon.id)}>
                  <img src={pokemon.sprite} alt={pokemon.name} />
                  <span>{pokemon.name}</span>
                  {pokemon.evolution_details && (
                    <small>
                      {pokemon.evolution_details.min_level && `Level ${pokemon.evolution_details.min_level}`}
                      {pokemon.evolution_details.item && `Use ${pokemon.evolution_details.item.replace('-', ' ')}`}
                      {pokemon.evolution_details.trade && 'Trade'}
                      {pokemon.evolution_details.held_item && `Hold ${pokemon.evolution_details.held_item.replace('-', ' ')}`}
                      {pokemon.evolution_details.min_happiness && 'High Friendship'}
                      {pokemon.evolution_details.time_of_day && `During ${pokemon.evolution_details.time_of_day}`}
                      {pokemon.evolution_details.location && `At ${pokemon.evolution_details.location.replace('-', ' ')}`}
                      {pokemon.evolution_details.known_move && `Knows ${pokemon.evolution_details.known_move.replace('-', ' ')}`}
                    </small>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PokemonEvolutions; 