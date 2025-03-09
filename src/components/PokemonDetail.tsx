import { PokemonDetails, PokemonSpecies, EvolutionChain, PokemonForm, AbilityDetail, MoveDetail, TCGCard } from '../types';
import PokemonStats from './PokemonStats';
import PokemonAbilities from './PokemonAbilities';
import PokemonEvolutions from './PokemonEvolutions';
import PokemonMoves from './PokemonMoves';
import TCGCards from './TCGCards';

interface PokemonDetailProps {
  pokemon: PokemonDetails;
  species: PokemonSpecies;
  evolutionChain: EvolutionChain | null;
  isShiny: boolean;
  is3D: boolean;
  selectedForm: string;
  pokemonForms: PokemonForm[];
  abilityDetails: { [key: string]: AbilityDetail };
  moveDetails: { [key: string]: MoveDetail };
  tcgCards: TCGCard[];
  loadingCards: boolean;
  selectedVersion: string;
  setSelectedVersion: (version: string) => void;
  setIsShiny: (isShiny: boolean) => void;
  closeDetails: () => void;
  fetchPokemonDetails: (id: number) => void;
  getUniqueVersions: (entries: PokemonSpecies['flavor_text_entries']) => string[];
  calculateTypeWeaknesses: (types: { type: { name: string } }[]) => {
    weaknesses: string[];
    resistances: string[];
    immunities: string[];
  };
}

const PokemonDetail = ({
  pokemon,
  species,
  evolutionChain,
  isShiny,
  is3D,
  selectedForm,
  pokemonForms,
  abilityDetails,
  moveDetails,
  tcgCards,
  loadingCards,
  selectedVersion,
  setSelectedVersion,
  setIsShiny,
  closeDetails,
  fetchPokemonDetails,
  getUniqueVersions,
  calculateTypeWeaknesses
}: PokemonDetailProps) => {
  return (
    <div className="pokemon-detail-overlay" onClick={closeDetails}>
      <div className="pokemon-detail-modal" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={closeDetails}>&times;</button>
        
        {/* Pokemon Header */}
        <div className="detail-header">
          <div className="sprite-container">
            <img 
              src={
                selectedForm === 'default'
                  ? (is3D
                      ? (isShiny 
                          ? pokemon.sprites.other?.home?.front_shiny 
                          : pokemon.sprites.other?.home?.front_default)
                      || (isShiny ? pokemon.sprites.front_shiny : pokemon.sprites.front_default)
                      : (isShiny ? pokemon.sprites.front_shiny : pokemon.sprites.front_default))
                  : (isShiny 
                      ? pokemonForms.find(f => f.name === selectedForm)?.sprites.front_shiny 
                      : pokemonForms.find(f => f.name === selectedForm)?.sprites.front_default)
              } 
              alt={pokemon.name} 
              className="detail-image"
            />
            <div className="form-controls">
              <button 
                className="shiny-toggle"
                onClick={() => setIsShiny(!isShiny)}
              >
                {isShiny ? 'Show Normal' : 'Show Shiny'}
              </button>
            </div>
          </div>
          <h2>
            #{pokemon.id.toString().padStart(3, '0')} {pokemon.name}
          </h2>
          <div className="types">
            {pokemon.types.map((type, index) => (
              <span key={index} className={`type ${type.type.name}`}>
                {type.type.name}
              </span>
            ))}
          </div>
        </div>

        <div className="detail-info">
          {/* Pokedex Entry */}
          <div className="pokedex-entry-section">
            <div className="version-selector">
              <select
                value={selectedVersion}
                onChange={(e) => setSelectedVersion(e.target.value)}
                className="version-select"
              >
                {getUniqueVersions(species.flavor_text_entries).map((version) => (
                  <option key={version} value={version}>
                    {version.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </option>
                ))}
              </select>
            </div>
            <p className="pokedex-entry">
              {species.flavor_text_entries
                .find(entry => 
                  entry.version.name === selectedVersion && 
                  entry.language.name === 'en'
                )?.flavor_text.replace(/\f/g, ' ') ||
                species.flavor_text_entries
                  .find(entry => entry.language.name === 'en')
                  ?.flavor_text.replace(/\f/g, ' ')}
            </p>
          </div>

          {/* Type Effectiveness */}
          <div className="type-effectiveness">
            {(() => {
              const { weaknesses, resistances, immunities } = calculateTypeWeaknesses(pokemon.types);
              return (
                <>
                  {weaknesses.length > 0 && (
                    <div className="type-category">
                      <h4>Weak against:</h4>
                      <div className="type-list">
                        {weaknesses.map(type => (
                          <span key={type} className={`type ${type}`}>
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {resistances.length > 0 && (
                    <div className="type-category">
                      <h4>Resistant to:</h4>
                      <div className="type-list">
                        {resistances.map(type => (
                          <span key={type} className={`type ${type}`}>
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {immunities.length > 0 && (
                    <div className="type-category">
                      <h4>Immune to:</h4>
                      <div className="type-list">
                        {immunities.map(type => (
                          <span key={type} className={`type ${type}`}>
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>

          <PokemonStats pokemon={pokemon} />
          <PokemonAbilities pokemon={pokemon} abilityDetails={abilityDetails} />
          <PokemonEvolutions 
            evolutionChain={evolutionChain} 
            fetchPokemonDetails={fetchPokemonDetails} 
          />
          <PokemonMoves pokemon={pokemon} moveDetails={moveDetails} />
          <TCGCards cards={tcgCards} loading={loadingCards} />
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail; 