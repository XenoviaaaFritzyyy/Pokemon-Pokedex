import { useState, useEffect } from 'react';

interface Pokemon {
  name: string;
  sprite: string;
  catchRate: {
    day?: boolean;
    night?: boolean;
  };
}

interface Location {
  id: number;
  name: string;
  type: 'route' | 'city' | 'cave' | 'water';
  pokemon: Pokemon[];
}

const GameMaps = () => {
  const [selectedGame, setSelectedGame] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);

  const games = [
    { id: 'red-blue', name: 'Red & Blue', region: 'kanto' },
    { id: 'gold-silver', name: 'Gold & Silver', region: 'johto' },
    { id: 'ruby-sapphire', name: 'Ruby & Sapphire', region: 'hoenn' },
    { id: 'diamond-pearl', name: 'Diamond & Pearl', region: 'sinnoh' },
    { id: 'black-white', name: 'Black & White', region: 'unova' },
    { id: 'x-y', name: 'X & Y', region: 'kalos' },
    { id: 'sun-moon', name: 'Sun & Moon', region: 'alola' },
    { id: 'sword-shield', name: 'Sword & Shield', region: 'galar' },
    { id: 'scarlet-violet', name: 'Scarlet & Violet', region: 'paldea' }
  ];

  useEffect(() => {
    const fetchLocations = async () => {
      if (!selectedGame) return;

      setLoading(true);
      try {
        const selectedGameData = games.find(game => game.id === selectedGame);
        
        // Special handling for newer games
        let regionId;
        switch (selectedGameData?.region) {
          case 'galar':
            regionId = 8;
            break;
          case 'paldea':
            regionId = 9;
            break;
          default:
            regionId = selectedGameData?.region;
        }

        const response = await fetch(`https://pokeapi.co/api/v2/region/${regionId}`);
        const data = await response.json();

        const locationPromises = data.locations.map(async (loc: { name: string; url: string }) => {
          const locationResponse = await fetch(loc.url);
          const locationData = await locationResponse.json();

          const encounterPromises = locationData.areas.map(async (area: { url: string }) => {
            try {
              const areaResponse = await fetch(area.url);
              const areaData = await areaResponse.json();
              return areaData.pokemon_encounters;
            } catch (error) {
              console.error(`Error fetching area data: ${error}`);
              return [];
            }
          });

          const encounters = await Promise.all(encounterPromises);
          const flattenedEncounters = encounters.flat();

          const uniquePokemon = Array.from(new Set(flattenedEncounters.map((e: any) => e?.pokemon?.name)))
            .filter(Boolean)
            .map(name => {
              const encounter = flattenedEncounters.find((e: any) => e?.pokemon?.name === name);
              if (!encounter?.pokemon?.url) return null;
              
              return {
                name,
                sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${encounter.pokemon.url.split('/')[6]}.png`,
                catchRate: {
                  day: encounter.time_of_day?.includes('day') || !encounter.time_of_day,
                  night: encounter.time_of_day?.includes('night')
                }
              };
            })
            .filter(Boolean);

          return {
            id: locationData.id,
            name: locationData.name.replace(/-/g, ' '),
            type: determineLocationType(locationData.name),
            pokemon: uniquePokemon
          };
        });

        const locationDetails = await Promise.all(locationPromises);
        setLocations(locationDetails.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [selectedGame]);

  const determineLocationType = (name: string): Location['type'] => {
    if (name.includes('route')) return 'route';
    if (name.includes('cave') || name.includes('tunnel')) return 'cave';
    if (name.includes('sea') || name.includes('lake')) return 'water';
    return 'city';
  };

  return (
    <div className="game-maps">
      <div className="game-selector">
        <select 
          value={selectedGame} 
          onChange={(e) => {
            setSelectedGame(e.target.value);
            setSelectedLocation(null);
          }}
          className="game-select"
        >
          <option value="">Select a Game</option>
          {games.map(game => (
            <option key={game.id} value={game.id}>
              {game.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading locations...</div>
      ) : (
        <div className="locations-container">
          {selectedGame && locations.map(location => (
            <div key={location.id} className="location-row">
              <button
                className={`location-button ${location.type} ${selectedLocation?.id === location.id ? 'active' : ''}`}
                onClick={() => setSelectedLocation(
                  selectedLocation?.id === location.id ? null : location
                )}
              >
                {location.name}
              </button>
              {selectedLocation?.id === location.id && (
                <div className="location-pokemon">
                  <div className="pokemon-encounters">
                    {location.pokemon.map(pokemon => (
                      <div key={pokemon.name} className="encounter-pokemon">
                        <img src={pokemon.sprite} alt={pokemon.name} />
                        <span>{pokemon.name.replace(/-/g, ' ')}</span>
                        <div className="catch-time">
                          {pokemon.catchRate.day && <span className="day-icon">☀️</span>}
                          {pokemon.catchRate.night && <span className="night-icon">🌙</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GameMaps; 