import { Generation } from '../types';
import { useScrollDirection } from '../hooks/useScrollDirection';
import { useLocation } from 'react-router-dom';
import GenerationDrawer from './GenerationDrawer';
import { useState } from 'react';

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
  setIsSidebarOpen: (isOpen: boolean) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
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
  setIsSidebarOpen,
  sortOrder,
  setSortOrder,
}: NavbarProps) => {
  const scrollDirection = useScrollDirection();
  const location = useLocation();
  const isPokedexView = location.pathname === '/' || location.pathname === '/pokedex';
  const [isGenDrawerOpen, setIsGenDrawerOpen] = useState(false);

  return (
    <>
      <nav className={`navbar ${scrollDirection === 'down' ? 'navbar-hidden' : ''}`}>
        <div className="nav-content">
          <div className="nav-left">
            <button 
              className="menu-button"
              onClick={() => setIsSidebarOpen(true)}
            >
              <div className="menu-icon">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
            <div className="nav-title-container">
              <div className="pokeball-logo"></div>
              <h1 className="nav-title">PokéDex</h1>
            </div>
          </div>
          {isPokedexView && (
            <>
              <div className="nav-center">
                <div className="search-container">
                  <input
                    type="text"
                    placeholder="Search Pokémon..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="sort-filter"
                  >
                    <option value="dex-number">Dex Number</option>
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    <option value="height-asc">Height (Smallest)</option>
                    <option value="height-desc">Height (Largest)</option>
                    <option value="weight-asc">Weight (Lightest)</option>
                    <option value="weight-desc">Weight (Heaviest)</option>
                  </select>
                  <div className="nav-buttons">
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
                  </div>
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
                <button
                  className="filter-button"
                  onClick={() => setIsGenDrawerOpen(true)}
                  title="Generation Filter"
                >
                  <span className="current-gen">{selectedGen.name}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18"></path>
                    <path d="M3 12h18"></path>
                    <path d="M3 18h18"></path>
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </nav>

      <GenerationDrawer
        isOpen={isGenDrawerOpen}
        onClose={() => setIsGenDrawerOpen(false)}
        selectedGen={selectedGen}
        handleGenSelect={(gen) => {
          handleGenSelect(gen);
          setIsGenDrawerOpen(false);
        }}
        generations={generations}
      />
    </>
  );
};

export default Navbar;