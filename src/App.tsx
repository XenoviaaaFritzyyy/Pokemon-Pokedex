import { useState, useEffect } from 'react'
import './App.css'

interface Pokemon {
  name: string;
  id: number;
  sprites: {
    front_default: string;
    front_shiny: string;
    other?: {
      home?: {
        front_default: string;
        front_shiny: string;
      };
    };
  };
  types: {
    type: {
      name: string;
    };
  }[];
  moves: {
    move: {
      name: string;
      url: string;
    };
    version_group_details: {
      level_learned_at: number;
      move_learn_method: {
        name: string;
      };
      version_group: {
        name: string;
      };
    }[];
  }[];
}

interface Generation {
  name: string;
  start: number;
  end: number;
}

interface PokemonForm {
  name: string;
  sprites: {
    front_default: string;
    front_shiny: string;
  };
  types: {
    type: {
      name: string;
    };
  }[];
  is_mega: boolean;
  is_gmax: boolean;
  form_name: string;
}

interface PokemonDetails extends Pokemon {
  species: {
    url: string;
  };
  height: number;
  weight: number;
  abilities: {
    ability: {
      name: string;
    };
    is_hidden: boolean;
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  forms: {
    name: string;
    url: string;
  }[];
}

interface PokemonSpecies {
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
    };
    version: {
      name: string;
    };
  }[];
  evolution_chain: {
    url: string;
  };
}

interface MoveDetail {
  name: string;
  type: {
    name: string;
  };
  power: number | null;
  accuracy: number | null;
}

interface Evolution {
  id: number;
  name: string;
  sprite: string;
  evolution_details?: {
    min_level?: number;
    item?: string;
    trigger?: string;
    trade?: boolean;
    held_item?: string;
    min_happiness?: number;
    time_of_day?: string;
    location?: string;
    known_move?: string;
  };
}

interface EvolutionChain {
  base: Evolution;
  second_stage: Evolution[];
  final_stage: Evolution[];
}

interface TypeEffectiveness {
  [key: string]: {
    superEffective: string[];
    notVeryEffective: string[];
    noEffect: string[];
  };
}

const typeEffectiveness: TypeEffectiveness = {
  normal: {
    superEffective: [],
    notVeryEffective: ['rock', 'steel'],
    noEffect: ['ghost']
  },
  fire: {
    superEffective: ['grass', 'ice', 'bug', 'steel'],
    notVeryEffective: ['fire', 'water', 'rock', 'dragon'],
    noEffect: []
  },
  water: {
    superEffective: ['fire', 'ground', 'rock'],
    notVeryEffective: ['water', 'grass', 'dragon'],
    noEffect: []
  },
  electric: {
    superEffective: ['water', 'flying'],
    notVeryEffective: ['electric', 'grass', 'dragon'],
    noEffect: ['ground']
  },
  grass: {
    superEffective: ['water', 'ground', 'rock'],
    notVeryEffective: ['fire', 'grass', 'poison', 'flying', 'bug', 'dragon', 'steel'],
    noEffect: []
  },
  ice: {
    superEffective: ['grass', 'ground', 'flying', 'dragon'],
    notVeryEffective: ['fire', 'water', 'ice', 'steel'],
    noEffect: []
  },
  fighting: {
    superEffective: ['normal', 'ice', 'rock', 'dark', 'steel'],
    notVeryEffective: ['poison', 'flying', 'psychic', 'bug', 'fairy'],
    noEffect: ['ghost']
  },
  poison: {
    superEffective: ['grass', 'fairy'],
    notVeryEffective: ['poison', 'ground', 'rock', 'ghost'],
    noEffect: ['steel']
  },
  ground: {
    superEffective: ['fire', 'electric', 'poison', 'rock', 'steel'],
    notVeryEffective: ['grass', 'bug'],
    noEffect: ['flying']
  },
  flying: {
    superEffective: ['grass', 'fighting', 'bug'],
    notVeryEffective: ['electric', 'rock', 'steel'],
    noEffect: []
  },
  psychic: {
    superEffective: ['fighting', 'poison'],
    notVeryEffective: ['psychic', 'steel'],
    noEffect: ['dark']
  },
  bug: {
    superEffective: ['grass', 'psychic', 'dark'],
    notVeryEffective: ['fire', 'fighting', 'poison', 'flying', 'ghost', 'steel', 'fairy'],
    noEffect: []
  },
  rock: {
    superEffective: ['fire', 'ice', 'flying', 'bug'],
    notVeryEffective: ['fighting', 'ground', 'steel'],
    noEffect: []
  },
  ghost: {
    superEffective: ['psychic', 'ghost'],
    notVeryEffective: ['dark'],
    noEffect: ['normal']
  },
  dragon: {
    superEffective: ['dragon'],
    notVeryEffective: ['steel'],
    noEffect: ['fairy']
  },
  dark: {
    superEffective: ['psychic', 'ghost'],
    notVeryEffective: ['fighting', 'dark', 'fairy'],
    noEffect: []
  },
  steel: {
    superEffective: ['ice', 'rock', 'fairy'],
    notVeryEffective: ['fire', 'water', 'electric', 'steel'],
    noEffect: []
  },
  fairy: {
    superEffective: ['fighting', 'dragon', 'dark'],
    notVeryEffective: ['fire', 'poison', 'steel'],
    noEffect: []
  }
};

const generations: Generation[] = [
  { name: "All Gens", start: 1, end: 1010 },
  { name: "Gen 1", start: 1, end: 151 },
  { name: "Gen 2", start: 152, end: 251 },
  { name: "Gen 3", start: 252, end: 386 },
  { name: "Gen 4", start: 387, end: 493 },
  { name: "Gen 5", start: 494, end: 649 },
  { name: "Gen 6", start: 650, end: 721 },
  { name: "Gen 7", start: 722, end: 809 },
  { name: "Gen 8", start: 810, end: 905 },
  { name: "Gen 9", start: 906, end: 1010 },
];

function App() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGen, setSelectedGen] = useState<Generation>(generations[1]);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetails | null>(null);
  const [pokemonSpecies, setPokemonSpecies] = useState<PokemonSpecies | null>(null);
  const [evolutionChain, setEvolutionChain] = useState<EvolutionChain | null>(null);
  const [isShiny, setIsShiny] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSecondType, setSelectedSecondType] = useState('none');
  const [showWarning, setShowWarning] = useState(false);
  const [moveDetails, setMoveDetails] = useState<{ [key: string]: MoveDetail }>({});
  const [selectedMoveMethod, setSelectedMoveMethod] = useState('all');
  const [selectedVersion, setSelectedVersion] = useState('');
  const [pokemonForms, setPokemonForms] = useState<PokemonForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<string>('default');

  const pokemonTypes = [
    'all', 'normal', 'fire', 'water', 'electric', 'grass', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
    'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
  ];

  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true);
      try {
        const promises = [];
        for (let i = selectedGen.start; i <= selectedGen.end; i++) {
          promises.push(
            fetch(`https://pokeapi.co/api/v2/pokemon/${i}`)
              .then(response => response.json())
          );
        }
        const results = await Promise.all(promises);
        setPokemon(results);
      } catch (error) {
        console.error('Error fetching Pokemon:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [selectedGen]);

  const fetchMoveDetails = async (url: string) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      return {
        name: data.name,
        type: data.type,
        power: data.power,
        accuracy: data.accuracy
      };
    } catch (error) {
      console.error('Error fetching move details:', error);
      return null;
    }
  };

  const fetchEvolutionChain = async (url: string) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      const chain = data.chain;
      const evolutionData: EvolutionChain = {
        base: {
          name: chain.species.name,
          id: parseInt(chain.species.url.split('/').slice(-2, -1)[0]),
          sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${parseInt(chain.species.url.split('/').slice(-2, -1)[0])}.png`,
        },
        second_stage: [],
        final_stage: []
      };

      // Get second stage evolutions
      if (chain.evolves_to?.length > 0) {
        evolutionData.second_stage = chain.evolves_to.map((evolution: any) => {
          const details = evolution.evolution_details[0];
          return {
            name: evolution.species.name,
            id: parseInt(evolution.species.url.split('/').slice(-2, -1)[0]),
            sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${parseInt(evolution.species.url.split('/').slice(-2, -1)[0])}.png`,
            evolution_details: {
              min_level: details?.min_level,
              item: details?.item?.name,
              trigger: details?.trigger?.name,
              trade: details?.trigger?.name === 'trade',
              held_item: details?.held_item?.name,
              min_happiness: details?.min_happiness,
              time_of_day: details?.time_of_day,
              location: details?.location?.name,
              known_move: details?.known_move?.name
            }
          };
        });

        // Get final stage evolutions
        chain.evolves_to.forEach((evolution: any) => {
          if (evolution.evolves_to?.length > 0) {
            const finalEvolutions = evolution.evolves_to.map((finalEvo: any) => {
              const details = finalEvo.evolution_details[0];
              return {
                name: finalEvo.species.name,
                id: parseInt(finalEvo.species.url.split('/').slice(-2, -1)[0]),
                sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${parseInt(finalEvo.species.url.split('/').slice(-2, -1)[0])}.png`,
                evolution_details: {
                  min_level: details?.min_level,
                  item: details?.item?.name,
                  trigger: details?.trigger?.name,
                  trade: details?.trigger?.name === 'trade',
                  held_item: details?.held_item?.name,
                  min_happiness: details?.min_happiness,
                  time_of_day: details?.time_of_day,
                  location: details?.location?.name,
                  known_move: details?.known_move?.name
                }
              };
            });
            evolutionData.final_stage.push(...finalEvolutions);
          }
        });
      }

      setEvolutionChain(evolutionData);
    } catch (error) {
      console.error('Error fetching evolution chain:', error);
    }
  };

  const fetchPokemonForms = async (forms: { name: string; url: string; }[]) => {
    try {
      const formPromises = forms.map(form => fetch(form.url).then(res => res.json()));
      const formResults = await Promise.all(formPromises);
      
      const processedForms = formResults.map(form => ({
        name: form.name,
        sprites: form.sprites,
        types: form.types,
        is_mega: false,
        is_gmax: false,
        form_name: form.form_name || form.name.split('-').slice(1).join(' ')
      }));

      // Filter out forms that don't have sprites
      const validForms = processedForms.filter(form => 
        form.sprites.front_default
      );

      setPokemonForms(validForms);
      setSelectedForm('default');
    } catch (error) {
      console.error('Error fetching Pokemon forms:', error);
    }
  };

  const fetchPokemonDetails = async (id: number): Promise<PokemonDetails | null> => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const pokemonData: PokemonDetails = await response.json();
      
      const speciesResponse = await fetch(pokemonData.species.url);
      const speciesData: PokemonSpecies = await speciesResponse.json();
      
      // Set initial version
      const englishEntries = speciesData.flavor_text_entries.filter(
        entry => entry.language.name === 'en'
      );
      if (englishEntries.length > 0) {
        setSelectedVersion(englishEntries[0].version.name);
      }
      
      // Fetch evolution chain
      if (speciesData.evolution_chain?.url) {
        await fetchEvolutionChain(speciesData.evolution_chain.url);
      }

      // Always fetch forms for the Pokemon
      await fetchPokemonForms(pokemonData.forms);

      const moveDetailsPromises = pokemonData.moves.map(move => 
        fetchMoveDetails(move.move.url)
      );
      const moveDetailsResults = await Promise.all(moveDetailsPromises);
      const moveDetailsMap: { [key: string]: MoveDetail } = {};
      pokemonData.moves.forEach((move, index) => {
        if (moveDetailsResults[index]) {
          moveDetailsMap[move.move.name] = moveDetailsResults[index];
        }
      });
      
      setMoveDetails(moveDetailsMap);
      setPokemonSpecies(speciesData);
      
      return pokemonData;
    } catch (error) {
      console.error('Error fetching Pokemon details:', error);
      return null;
    }
  };

  const closeDetails = () => {
    setSelectedPokemon(null);
    setPokemonSpecies(null);
    setEvolutionChain(null);
  };

  const filteredPokemon = pokemon.filter((poke) => {
    const matchesSearch = poke.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Handle type filtering
    let matchesType = true;
    if (selectedType !== 'all') {
      matchesType = poke.types.some(type => type.type.name === selectedType);
    }
    
    // Handle second type filtering
    let matchesSecondType = true;
    if (selectedSecondType !== 'none') {
      // For second type, we need to ensure it's different from the first type
      if (selectedType !== 'all') {
        // If first type is selected, find a different type that matches second type
        matchesSecondType = poke.types.some(type => 
          type.type.name === selectedSecondType && type.type.name !== selectedType
        );
      } else {
        // If first type is 'all', just check for second type
        matchesSecondType = poke.types.some(type => type.type.name === selectedSecondType);
      }
    }

    return matchesSearch && matchesType && matchesSecondType;
  });

  const handleGenSelect = (gen: Generation) => {
    if (gen.name === "All Gens") {
      setShowWarning(true);
    } else {
      setSelectedGen(gen);
      setShowWarning(false);
    }
  };

  const getUniqueVersions = (entries: PokemonSpecies['flavor_text_entries']) => {
    const uniqueVersions = new Set<string>();
    entries
      .filter(entry => entry.language.name === 'en')
      .forEach(entry => uniqueVersions.add(entry.version.name));
    return Array.from(uniqueVersions);
  };

  const calculateTypeWeaknesses = (types: { type: { name: string } }[]) => {
    const weaknesses = new Set<string>();
    const resistances = new Set<string>();
    const immunities = new Set<string>();

    types.forEach(typeObj => {
      const type = typeObj.type.name;
      
      // Add types that are super effective against this type
      Object.entries(typeEffectiveness).forEach(([attackingType, effectiveness]) => {
        if (effectiveness.superEffective.includes(type)) {
          weaknesses.add(attackingType);
        }
        if (effectiveness.notVeryEffective.includes(type)) {
          resistances.add(attackingType);
        }
        if (effectiveness.noEffect.includes(type)) {
          immunities.add(attackingType);
        }
      });
    });

    // Remove resistances from weaknesses
    Array.from(resistances).forEach(type => weaknesses.delete(type));
    // Remove immunities from both weaknesses and resistances
    Array.from(immunities).forEach(type => {
      weaknesses.delete(type);
      resistances.delete(type);
    });

    return {
      weaknesses: Array.from(weaknesses),
      resistances: Array.from(resistances),
      immunities: Array.from(immunities)
    };
  };

  const handlePokemonClick = async (pokemon: { id: number }) => {
    setSelectedPokemon(null);
    setSelectedVersion('');
    setIsShiny(false);
    
    try {
      const details = await fetchPokemonDetails(pokemon.id);
      if (details) {
        setSelectedPokemon(details);
      }
    } catch (error) {
      console.error('Error fetching Pokemon details:', error);
    }
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="nav-content">
          <div className="nav-left">
            <div className="nav-title-container">
              <div className="pokeball-logo"></div>
              <h1 className="nav-title">PokéDex</h1>
            </div>
          </div>
          <div className="nav-center">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search Pokémon..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <div className="type-filters">
                <select
                  value={selectedType}
                  onChange={(e) => {
                    setSelectedType(e.target.value);
                    // Reset second type if it matches the first type
                    if (e.target.value === selectedSecondType) {
                      setSelectedSecondType('none');
                    }
                  }}
                  className={`type-filter ${selectedType}`}
                >
                  <option value="all">All Types</option>
                  {pokemonTypes.filter(type => type !== 'all').map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedSecondType}
                  onChange={(e) => setSelectedSecondType(e.target.value)}
                  className={`type-filter ${selectedSecondType}`}
                  disabled={selectedType === 'all'}
                >
                  <option value="none">Secondary Type</option>
                  {pokemonTypes
                    .filter(type => type !== 'all' && type !== selectedType)
                    .map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="nav-right">
            <div className="gen-buttons">
              {generations.map((gen) => (
                <button
                  key={gen.name}
                  className={`gen-button ${selectedGen.name === gen.name ? 'active' : ''}`}
                  onClick={() => handleGenSelect(gen)}
                >
                  {gen.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {showWarning && (
        <div className="warning-modal">
          <div className="warning-content">
            <h3>Load All Pokémon?</h3>
            <p>Loading all generations (1010+ Pokémon) may take longer to load and could affect performance.</p>
            <div className="warning-buttons">
              <button 
                className="warning-button confirm"
                onClick={() => {
                  setSelectedGen(generations[0]);
                  setShowWarning(false);
                }}
              >
                Continue
              </button>
              <button 
                className="warning-button cancel"
                onClick={() => setShowWarning(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="pokedex-container">
        {loading ? (
          <div className="loading">Loading {selectedGen.name} Pokémon...</div>
        ) : (
          <>
            <div className="pokemon-grid">
              {filteredPokemon.map((poke) => (
                <div 
                  key={poke.id} 
                  className="pokemon-card"
                  onClick={() => handlePokemonClick(poke)}
                >
                  <img src={poke.sprites.front_default} alt={poke.name} />
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

            {selectedPokemon && pokemonSpecies && (
              <div className="pokemon-detail-overlay" onClick={closeDetails}>
                <div className="pokemon-detail-modal" onClick={e => e.stopPropagation()}>
                  <button className="close-button" onClick={closeDetails}>&times;</button>
                  <div className="detail-header">
                    <div className="sprite-container">
                      <img 
                        src={
                          selectedForm === 'default' 
                            ? (isShiny ? selectedPokemon.sprites.front_shiny : selectedPokemon.sprites.front_default)
                            : (isShiny 
                                ? pokemonForms.find(f => f.name === selectedForm)?.sprites.front_shiny 
                                : pokemonForms.find(f => f.name === selectedForm)?.sprites.front_default)
                        } 
                        alt={selectedPokemon.name} 
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
                      #{selectedPokemon.id.toString().padStart(3, '0')} {selectedPokemon.name}
                    </h2>
                    <div className="types">
                      {selectedPokemon.types.map((type, index) => (
                        <span key={index} className={`type ${type.type.name}`}>
                          {type.type.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="detail-info">
                    {pokemonSpecies && (
                      <div className="pokedex-entry-section">
                        <div className="version-selector">
                          <select
                            value={selectedVersion}
                            onChange={(e) => setSelectedVersion(e.target.value)}
                            className="version-select"
                          >
                            {getUniqueVersions(pokemonSpecies.flavor_text_entries).map((version) => (
                              <option key={version} value={version}>
                                {version.split('-').map(word => 
                                  word.charAt(0).toUpperCase() + word.slice(1)
                                ).join(' ')}
                              </option>
                            ))}
                          </select>
                        </div>
                        <p className="pokedex-entry">
                          {pokemonSpecies.flavor_text_entries
                            .find(entry => 
                              entry.version.name === selectedVersion && 
                              entry.language.name === 'en'
                            )?.flavor_text.replace(/\f/g, ' ') ||
                            pokemonSpecies.flavor_text_entries
                              .find(entry => entry.language.name === 'en')
                              ?.flavor_text.replace(/\f/g, ' ')}
                        </p>
                      </div>
                    )}
                    
                    <div className="type-effectiveness">
                      {(() => {
                        const { weaknesses, resistances, immunities } = calculateTypeWeaknesses(selectedPokemon.types);
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

                    <div className="stats-grid">
                      <div className="stat-item">
                        <span>Height</span>
                        <span>{(selectedPokemon.height / 10).toFixed(1)}m</span>
                      </div>
                      <div className="stat-item">
                        <span>Weight</span>
                        <span>{(selectedPokemon.weight / 10).toFixed(1)}kg</span>
                      </div>
                      {selectedPokemon.stats.map((stat) => (
                        <div key={stat.stat.name} className="stat-item">
                          <span>{stat.stat.name}</span>
                          <span>{stat.base_stat}</span>
                        </div>
                      ))}
                    </div>

                    <div className="abilities">
                      <h3>Abilities</h3>
                      <div className="abilities-list">
                        {selectedPokemon.abilities.map((ability, index) => (
                          <span key={index} className={ability.is_hidden ? 'hidden-ability' : ''}>
                            {ability.ability.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {evolutionChain && (
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
                    )}

                    <div className="moves-section">
                      <h3>Moves</h3>
                      <div className="moves-container">
                        <div className="moves-filters">
                          <select 
                            value={selectedMoveMethod}
                            onChange={(e) => setSelectedMoveMethod(e.target.value)}
                          >
                            <option value="all">All Methods</option>
                            <option value="level-up">Level Up</option>
                            <option value="machine">TM/TR</option>
                            <option value="egg">Egg Move</option>
                            <option value="tutor">Move Tutor</option>
                          </select>
                        </div>
                        <div className="moves-list">
                          {selectedPokemon.moves
                            .filter(move => {
                              if (selectedMoveMethod === 'all') return true;
                              return move.version_group_details.some(
                                detail => detail.move_learn_method.name === selectedMoveMethod
                              );
                            })
                            .sort((a, b) => {
                              const aLevel = a.version_group_details[0]?.level_learned_at || 0;
                              const bLevel = b.version_group_details[0]?.level_learned_at || 0;
                              return aLevel - bLevel;
                            })
                            .map((moveData, index) => {
                              const learnMethod = moveData.version_group_details[0]?.move_learn_method.name;
                              const levelLearned = moveData.version_group_details[0]?.level_learned_at;
                              const moveDetail = moveDetails[moveData.move.name];
                              
                              return (
                                <div key={index} className="move-item">
                                  <div className="move-info">
                                    <span className={`move-type ${moveDetail?.type.name || ''}`}>
                                      {moveDetail?.type.name || '???'}
                                    </span>
                                    <span className="move-name">
                                      {moveData.move.name.replace('-', ' ')}
                                    </span>
                                  </div>
                                  <div className="move-stats">
                                    {moveDetail?.power && (
                                      <span className="move-power">
                                        Power: {moveDetail.power}
                                      </span>
                                    )}
                                    {moveDetail?.accuracy && (
                                      <span className="move-accuracy">
                                        Acc: {moveDetail.accuracy}%
                                      </span>
                                    )}
                                    <span className="move-method">
                                      {learnMethod === 'level-up' ? `Lvl ${levelLearned}` : learnMethod}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p>Data provided by <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer">PokéAPI</a></p>
          <p>© 2024 Pokédex App - All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
}

export default App;