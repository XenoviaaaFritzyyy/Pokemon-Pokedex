import { useState } from 'react';
import { PokemonDetails, MoveDetail } from '../types';

interface PokemonMovesProps {
  pokemon: PokemonDetails;
  moveDetails: { [key: string]: MoveDetail };
}

const PokemonMoves = ({ pokemon, moveDetails }: PokemonMovesProps) => {
  const [selectedMoveMethod, setSelectedMoveMethod] = useState('all');

  return (
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
          {pokemon.moves
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
  );
};

export default PokemonMoves; 