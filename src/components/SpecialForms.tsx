import { useState, useEffect } from 'react';

interface SpecialForm {
  name: string;
  sprites: {
    front_default: string;
    front_shiny?: string;
    other?: {
      home?: {
        front_default: string;
      };
    };
  };
  types: {
    type: {
      name: string;
    };
  }[];
}

interface SpecialFormsProps {
  is3D: boolean;
  handlePokemonClick: (pokemon: any) => void;
  searchTerm: string;
  selectedType: string;
  selectedSecondType: string;
}

const SpecialForms = ({ 
  is3D, 
  handlePokemonClick, 
  searchTerm,
  selectedType,
  selectedSecondType 
}: SpecialFormsProps) => {
  const [specialForms, setSpecialForms] = useState<SpecialForm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecialForms = async () => {
      try {
        const specialFormsList = [
          // Regional Forms
          // Alolan Forms
          'rattata-alola', 'raticate-alola', 'raichu-alola', 'sandshrew-alola', 'sandslash-alola',
          'vulpix-alola', 'ninetales-alola', 'diglett-alola', 'dugtrio-alola', 'meowth-alola',
          'persian-alola', 'geodude-alola', 'graveler-alola', 'golem-alola', 'grimer-alola',
          'muk-alola', 'exeggutor-alola', 'marowak-alola',
          // Galarian Forms
          'meowth-galar', 'ponyta-galar', 'rapidash-galar', 'slowpoke-galar', 'slowbro-galar',
          'farfetchd-galar', 'weezing-galar', 'mr-mime-galar', 'articuno-galar', 'zapdos-galar',
          'moltres-galar', 'slowking-galar', 'corsola-galar', 'zigzagoon-galar', 'linoone-galar',
          'darumaka-galar', 'darmanitan-galar', 'yamask-galar', 'stunfisk-galar',
          // Hisuian Forms
          'growlithe-hisui', 'arcanine-hisui', 'voltorb-hisui', 'electrode-hisui', 'typhlosion-hisui',
          'qwilfish-hisui', 'sneasel-hisui', 'samurott-hisui', 'lilligant-hisui', 'zorua-hisui',
          'zoroark-hisui', 'braviary-hisui', 'sliggoo-hisui', 'goodra-hisui', 'avalugg-hisui',
          'decidueye-hisui',
          // Special Forms
          'pikachu-rock-star', 'pikachu-belle', 'pikachu-pop-star', 'pikachu-phd', 'pikachu-libre',
          'pikachu-original-cap', 'pikachu-hoenn-cap', 'pikachu-sinnoh-cap', 'pikachu-unova-cap',
          'pikachu-kalos-cap', 'pikachu-alola-cap', 'pikachu-partner-cap', 'pikachu-world-cap',
          // Rotom Forms
          'rotom-heat', 'rotom-wash', 'rotom-frost', 'rotom-fan', 'rotom-mow',
          // Mega Evolutions
          'venusaur-mega', 'charizard-mega-x', 'charizard-mega-y', 'blastoise-mega', 'alakazam-mega',
          'gengar-mega', 'kangaskhan-mega', 'pinsir-mega', 'gyarados-mega', 'aerodactyl-mega',
          'mewtwo-mega-x', 'mewtwo-mega-y', 'ampharos-mega', 'steelix-mega', 'scizor-mega',
          'heracross-mega', 'houndoom-mega', 'tyranitar-mega', 'sceptile-mega', 'blaziken-mega',
          'swampert-mega', 'gardevoir-mega', 'sableye-mega', 'mawile-mega', 'aggron-mega',
          'medicham-mega', 'manectric-mega', 'sharpedo-mega', 'camerupt-mega', 'altaria-mega',
          'banette-mega', 'absol-mega', 'glalie-mega', 'salamence-mega', 'metagross-mega',
          'latias-mega', 'latios-mega', 'rayquaza-mega', 'lopunny-mega', 'garchomp-mega',
          'lucario-mega', 'abomasnow-mega', 'gallade-mega', 'audino-mega', 'diancie-mega',
          // Gigantamax Forms
          'charizard-gmax', 'butterfree-gmax', 'pikachu-gmax', 'meowth-gmax', 'machamp-gmax',
          'gengar-gmax', 'kingler-gmax', 'lapras-gmax', 'eevee-gmax', 'snorlax-gmax',
          'garbodor-gmax', 'melmetal-gmax', 'rillaboom-gmax', 'cinderace-gmax', 'inteleon-gmax',
          'corviknight-gmax', 'orbeetle-gmax', 'drednaw-gmax', 'coalossal-gmax', 'flapple-gmax',
          'appletun-gmax', 'sandaconda-gmax', 'toxtricity-amped-gmax', 'centiskorch-gmax',
          'hatterene-gmax', 'grimmsnarl-gmax', 'alcremie-gmax', 'copperajah-gmax', 'duraludon-gmax',
          'urshifu-single-strike-gmax', 'urshifu-rapid-strike-gmax'
        ];

        const promises = specialFormsList.map(form =>
          fetch(`https://pokeapi.co/api/v2/pokemon/${form}`)
            .then(res => {
              if (!res.ok) {
                throw new Error(`Failed to fetch ${form}`);
              }
              return res.json();
            })
            .catch(error => {
              console.warn(`Failed to fetch ${form}:`, error);
              return null;
            })
        );

        const results = (await Promise.all(promises)).filter(result => result !== null);
        setSpecialForms(results);
      } catch (error) {
        console.error('Error fetching special forms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialForms();
  }, []);

  // Filter the special forms based on search term and types
  const filteredForms = specialForms.filter(form => {
    // Filter by name
    const matchesSearch = form.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by primary type
    let matchesType = true;
    if (selectedType !== 'all') {
      matchesType = form.types.some(type => type.type.name === selectedType);
    }
    
    // Filter by secondary type
    let matchesSecondType = true;
    if (selectedSecondType !== 'none') {
      if (selectedType !== 'all') {
        matchesSecondType = form.types.some(type => 
          type.type.name === selectedSecondType && type.type.name !== selectedType
        );
      } else {
        matchesSecondType = form.types.some(type => type.type.name === selectedSecondType);
      }
    }

    return matchesSearch && matchesType && matchesSecondType;
  });

  if (loading) return <div className="loading">Loading special forms...</div>;

  return (
    <div className="special-forms-grid">
      {filteredForms.map((form, index) => (
        <div 
          key={index} 
          className="special-form-card"
          onClick={() => handlePokemonClick(form)}
        >
          <img 
            src={
              is3D 
                ? form.sprites.other?.home?.front_default || form.sprites.front_default
                : form.sprites.front_default
            } 
            alt={form.name} 
          />
          <h3>{form.name.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')}</h3>
          <div className="types">
            {form.types.map((type, idx) => (
              <span key={idx} className={`type ${type.type.name}`}>
                {type.type.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SpecialForms; 