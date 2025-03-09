import { PokemonDetails, AbilityDetail } from '../types';

interface PokemonAbilitiesProps {
  pokemon: PokemonDetails;
  abilityDetails: { [key: string]: AbilityDetail };
}

const PokemonAbilities = ({ pokemon, abilityDetails }: PokemonAbilitiesProps) => {
  return (
    <div className="abilities-section">
      <h3>Abilities</h3>
      <div className="abilities-grid">
        {pokemon.abilities.map((abilityData, index) => {
          const ability = abilityDetails[abilityData.ability.name];
          if (!ability) return null;
          
          const englishEffect = ability.effect_entries.find(entry => entry.language.name === 'en');
          
          return (
            <div key={index} className={`ability-card ${abilityData.is_hidden ? 'hidden-ability' : ''}`}>
              <div className="ability-header">
                <h4>{abilityData.ability.name.replace('-', ' ')}</h4>
                {abilityData.is_hidden && (
                  <span className="hidden-badge">Hidden Ability</span>
                )}
              </div>
              {englishEffect && (
                <p className="ability-description">
                  {englishEffect.short_effect}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PokemonAbilities; 