import { PokemonDetails } from '../types';

interface PokemonStatsProps {
  pokemon: PokemonDetails;
}

const PokemonStats = ({ pokemon }: PokemonStatsProps) => {
  return (
    <div className="stats-grid">
      <div className="stat-item">
        <span>Height</span>
        <span>{(pokemon.height / 10).toFixed(1)}m</span>
      </div>
      <div className="stat-item">
        <span>Weight</span>
        <span>{(pokemon.weight / 10).toFixed(1)}kg</span>
      </div>
      {pokemon.stats.map((stat) => (
        <div key={stat.stat.name} className="stat-item">
          <span>{stat.stat.name}</span>
          <span>{stat.base_stat}</span>
        </div>
      ))}
    </div>
  );
};

export default PokemonStats; 