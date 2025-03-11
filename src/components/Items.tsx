import { useState, useEffect } from 'react';

interface Item {
  id: number;
  name: string;
  sprite: string;
  category: string;
  effect: string;
  cost: number;
  attributes: string[];
}

const ITEMS_PER_ROW = 4; // Assuming 4 items per row based on the grid
const INITIAL_ROWS = 3; // Show 3 rows initially

const Items = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('standard-balls');
  const [searchTerm, setSearchTerm] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_ROW * INITIAL_ROWS);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        // Add all categories including special ones
        const allCategories = [
          'all',
          'standard-balls',
          'special-balls',
          'medicine',
          'battle-items',
          'berries',
          'healing',
          'held-items',
          'key-items',
          'machines',
          'mail',
          'evolution',
          'spelunking',
          'miracle-shooter',
          'in-a-pinch',
          'picky-healing',
          'type-enhancement',
          'baking-only',
          'effort-drop',
          'other',
          'status-cures',
          'pp-recovery',
          'revival',
          'vitamins',
          'collectibles',
          'mega-stones',
          'z-crystals',
          'curry-ingredients',
          'dynamax-crystals',
          'treasures',
          'ingredients',
          'apricorn-balls',
          'plot-advancement',
          'scarlet-violet-picks',
          'catching-bonus',
          'exp-candy',
          'mints',
          'nature-changing',
          'stat-boost',
          'type-specific',
          'valuable-items',
          'mulch',
          'nectar',
          'memories',
          'rotom-powers'
        ];
        
        setCategories(allCategories);

        // Then fetch items for the selected category
        let itemsUrl = 'https://pokeapi.co/api/v2/item-category/' + selectedCategory;
        if (selectedCategory === 'all') {
          itemsUrl = 'https://pokeapi.co/api/v2/item?limit=20'; // Limit initial load for 'all'
        }

        const response = await fetch(itemsUrl);
        const data = await response.json();
        
        const itemUrls = selectedCategory === 'all' 
          ? data.results.map((item: any) => item.url)
          : data.items.map((item: any) => item.url);

        const itemDetails = await Promise.all(
          itemUrls.map(async (url: string) => {
            const itemResponse = await fetch(url);
            return itemResponse.json();
          })
        );

        const processedItems = itemDetails.map(item => ({
          id: item.id,
          name: item.name.replace(/-/g, ' '),
          sprite: item.sprites.default,
          category: item.category.name,
          effect: item.effect_entries.find((entry: any) => entry.language.name === 'en')?.effect || 'No effect description available',
          cost: item.cost,
          attributes: item.attributes.map((attr: any) => attr.name)
        }));

        setItems(processedItems);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching items:', error);
        setLoading(false);
      }
    };

    fetchItems();
  }, [selectedCategory]); // Only re-fetch when category changes

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategoryChange = (category: string) => {
    if (category === 'all') {
      setShowWarning(true);
    } else {
      setSelectedCategory(category);
      setVisibleItems(ITEMS_PER_ROW * INITIAL_ROWS); // Reset visible items when changing category
    }
  };

  const loadMoreItems = () => {
    setVisibleItems(prev => prev + ITEMS_PER_ROW * 2); // Load 2 more rows
  };

  const formatCategoryName = (category: string) => {
    return category
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="items-container">
      <div className="items-filters">
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="item-search"
        />
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="category-filter"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {formatCategoryName(category)}
            </option>
          ))}
        </select>
      </div>

      {showWarning && (
        <div className="warning-modal">
          <div className="warning-content">
            <h3>Performance Warning</h3>
            <p>Loading all items at once may cause performance issues. Please select a specific category for better performance.</p>
            <div className="warning-buttons">
              <button 
                className="warning-button confirm" 
                onClick={() => {
                  setSelectedCategory('all');
                  setShowWarning(false);
                }}
              >
                Show All Anyway
              </button>
              <button 
                className="warning-button cancel" 
                onClick={() => {
                  setShowWarning(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading items...</div>
      ) : (
        <>
          <div className="items-grid">
            {filteredItems.slice(0, visibleItems).map(item => (
              <div key={item.id} className="item-card">
                <img src={item.sprite} alt={item.name} className="item-sprite" />
                <h3>{item.name}</h3>
                <div className="item-details">
                  <span className="item-category">{formatCategoryName(item.category)}</span>
                  <span className="item-cost">{item.cost}₽</span>
                </div>
                <p className="item-effect">{item.effect}</p>
                {item.attributes.length > 0 && (
                  <div className="item-attributes">
                    {item.attributes.map(attr => (
                      <span key={attr} className="attribute-tag">
                        {formatCategoryName(attr)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          {filteredItems.length > visibleItems && (
            <div className="load-more-container">
              <button className="load-more-button" onClick={loadMoreItems}>
                Load More Items
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Items; 