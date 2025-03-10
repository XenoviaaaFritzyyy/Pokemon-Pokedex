import { Generation } from '../types';
import { useScrollDirection } from '../hooks/useScrollDirection';

interface NavbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  is3D: boolean;
  setIs3D: (is3D: boolean) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedSecondType: string;
  setSelectedSecondType: (type: string) => void;
  selectedGen: Generation;
  handleGenSelect: (gen: Generation) => void;
  pokemonTypes: string[];
  generations: Generation[];
  showSpecialForms: boolean;
  setShowSpecialForms: (show: boolean) => void;
}

const Navbar = ({
  searchTerm,
  setSearchTerm,
  is3D,
  setIs3D,
  selectedType,
  setSelectedType,
  selectedSecondType,
  setSelectedSecondType,
  selectedGen,
  handleGenSelect,
  pokemonTypes,
  generations,
  showSpecialForms,
  setShowSpecialForms,
}: NavbarProps) => {
  const scrollDirection = useScrollDirection();

  return (
    <nav className={`navbar ${scrollDirection === 'down' ? 'navbar-hidden' : ''}`}>
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
            <button 
              className="sprite-toggle"
              onClick={() => setIs3D(!is3D)}
            >
              {is3D ? 'Show 2D' : 'Show 3D'}
            </button>
            <button 
              className={`special-forms-toggle ${showSpecialForms ? 'active' : ''}`}
              onClick={() => setShowSpecialForms(!showSpecialForms)}
            >
              Special Forms
            </button>
            <div className="type-filters">
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
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
          {!showSpecialForms && (
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
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;