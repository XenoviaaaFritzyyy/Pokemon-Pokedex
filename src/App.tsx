import { useState, useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import PokemonGrid from './components/PokemonGrid'
import PokemonDetail from './components/PokemonDetail'
import { Pokemon, Generation, PokemonDetails, PokemonSpecies, EvolutionChain, PokemonForm, AbilityDetail, MoveDetail, TCGCard } from './types'
import SpecialForms from './components/SpecialForms'
import Sidebar from './components/Sidebar'
import GameMaps from './components/GameMaps'
import Items from './components/Items'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

interface TypeEffectiveness {
  [key: string]: {
    superEffective: string[];
    notVeryEffective: string[];
    noEffect: string[];
  };
}

const generations: Generation[] = [
  { name: "All Gens", start: 1, end: 1025 },
  { name: "Gen 1", start: 1, end: 151 },
  { name: "Gen 2", start: 152, end: 251 },
  { name: "Gen 3", start: 252, end: 386 },
  { name: "Gen 4", start: 387, end: 493 },
  { name: "Gen 5", start: 494, end: 649 },
  { name: "Gen 6", start: 650, end: 721 },
  { name: "Gen 7", start: 722, end: 809 },
  { name: "Gen 8", start: 810, end: 905 },
  { name: "Gen 9", start: 906, end: 1025 },
];

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

function App() {
  useEffect(() => {
    document.title = 'PokéDex';
  }, []);

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
  // const [selectedMoveMethod, setSelectedMoveMethod] = useState('all');
  const [selectedVersion, setSelectedVersion] = useState('');
  const [pokemonForms, setPokemonForms] = useState<PokemonForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<string>('default');
  const [abilityDetails, setAbilityDetails] = useState<{ [key: string]: AbilityDetail }>({});
  const [tcgCards, setTcgCards] = useState<TCGCard[]>([]);
  const [loadingCards, setLoadingCards] = useState(false);
  const [is3D, setIs3D] = useState(false);
  const [showSpecialForms, setShowSpecialForms] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('pokedex');
  const [sortOrder, setSortOrder] = useState('dex-number');

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

  const fetchAbilityDetails = async (url: string, isHidden: boolean): Promise<AbilityDetail | null> => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      return {
        name: data.name,
        effect_entries: data.effect_entries,
        is_hidden: isHidden
      };
    } catch (error) {
      console.error('Error fetching ability details:', error);
      return null;
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

      // Fetch ability details
      const abilityPromises = pokemonData.abilities.map(ability => 
        fetchAbilityDetails(ability.ability.url, ability.is_hidden)
      );
      const abilityResults = await Promise.all(abilityPromises);
      const abilityDetailsMap: { [key: string]: AbilityDetail } = {};
      
      abilityResults.forEach((ability, index) => {
        if (ability) {
          abilityDetailsMap[pokemonData.abilities[index].ability.name] = ability;
        }
      });
      
      setAbilityDetails(abilityDetailsMap);

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
      if (selectedType !== 'all') {
        matchesSecondType = poke.types.some(type => 
          type.type.name === selectedSecondType && type.type.name !== selectedType
        );
      } else {
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

  const fetchTCGCards = async (pokemonName: string) => {
    setLoadingCards(true);
    try {
      const response = await fetch(
        `https://api.pokemontcg.io/v2/cards?q=name:"${pokemonName}"&orderBy=set.releaseDate`,
        {
          headers: {
            'X-Api-Key': '2638c6b7-86e7-4047-9bbd-6aa80cf26304'
          }
        }
      );
      const data = await response.json();
      setTcgCards(data.data || []);
    } catch (error) {
      console.error('Error fetching TCG cards:', error);
      setTcgCards([]);
    } finally {
      setLoadingCards(false);
    }
  };

  const handlePokemonClick = async (pokemon: { id: number }) => {
    setSelectedPokemon(null);
    setSelectedVersion('');
    setIsShiny(false);
    setTcgCards([]); // Reset TCG cards
    
    try {
      const details = await fetchPokemonDetails(pokemon.id);
      if (details) {
        setSelectedPokemon(details);
        // Fetch TCG cards after pokemon details are loaded
        await fetchTCGCards(details.name);
      }
    } catch (error) {
      console.error('Error fetching Pokemon details:', error);
    }
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          is3D={is3D}
          setIs3D={setIs3D}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedSecondType={selectedSecondType}
          setSelectedSecondType={setSelectedSecondType}
          selectedGen={selectedGen}
          handleGenSelect={handleGenSelect}
          pokemonTypes={pokemonTypes}
          generations={generations}
          showSpecialForms={showSpecialForms}
          setShowSpecialForms={setShowSpecialForms}
          setIsSidebarOpen={setIsSidebarOpen}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />

        <Sidebar 
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

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
          <Routes>
            <Route path="/" element={
              loading ? (
                <div className="loading">Loading {selectedGen.name} Pokémon...</div>
              ) : (
                <>
                  {showSpecialForms ? (
                    <SpecialForms 
                      is3D={is3D} 
                      handlePokemonClick={handlePokemonClick}
                      searchTerm={searchTerm}
                      selectedType={selectedType}
                      selectedSecondType={selectedSecondType}
                      sortOrder={sortOrder}
                    />
                  ) : (
                    <PokemonGrid
                      pokemon={filteredPokemon}
                      is3D={is3D}
                      handlePokemonClick={handlePokemonClick}
                      sortOrder={sortOrder}
                    />
                  )}

                  {selectedPokemon && pokemonSpecies && (
                    <PokemonDetail
                      pokemon={selectedPokemon}
                      species={pokemonSpecies}
                      evolutionChain={evolutionChain}
                      isShiny={isShiny}
                      is3D={is3D}
                      selectedForm={selectedForm}
                      pokemonForms={pokemonForms}
                      abilityDetails={abilityDetails}
                      moveDetails={moveDetails}
                      tcgCards={tcgCards}
                      loadingCards={loadingCards}
                      selectedVersion={selectedVersion}
                      setSelectedVersion={setSelectedVersion}
                      setIsShiny={setIsShiny}
                      closeDetails={closeDetails}
                      fetchPokemonDetails={fetchPokemonDetails}
                      getUniqueVersions={getUniqueVersions}
                      calculateTypeWeaknesses={calculateTypeWeaknesses}
                    />
                  )}
                </>
              )
            } />
            <Route path="/games-maps" element={<GameMaps />} />
            <Route path="/items" element={<Items />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="footer">
          <div className="footer-content">
            <p>Data provided by <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer">PokéAPI</a> and <a href="https://pokemontcg.io/" target="_blank" rel="noopener noreferrer">Pokémon TCG API</a></p>
            <p> 2024 Pokédex App - All Rights Reserved</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;