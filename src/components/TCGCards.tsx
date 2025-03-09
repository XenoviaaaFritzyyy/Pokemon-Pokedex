import { TCGCard } from '../types';

interface TCGCardsProps {
  cards: TCGCard[];
  loading: boolean;
}

const TCGCards = ({ cards, loading }: TCGCardsProps) => {
  return (
    <div className="tcg-section">
      <h3>Trading Card Game Cards</h3>
      <div className="tcg-cards-container">
        {loading ? (
          <div className="loading">Loading TCG cards...</div>
        ) : cards.length > 0 ? (
          <div className="tcg-cards-grid">
            {cards.map((card) => (
              <div key={card.id} className="tcg-card">
                <img 
                  src={card.images.small} 
                  alt={card.name}
                  onClick={() => window.open(card.images.large, '_blank')}
                />
                <div className="tcg-card-info">
                  <span className="tcg-card-set">{card.set.name}</span>
                  <span className="tcg-card-rarity">{card.rarity}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-cards">No trading cards found for this Pokémon.</div>
        )}
      </div>
    </div>
  );
};

export default TCGCards; 