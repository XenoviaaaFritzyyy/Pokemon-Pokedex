// import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Sidebar = ({ isOpen, setIsOpen, activeSection, setActiveSection }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    setActiveSection(path);
    setIsOpen(false);
  };

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(false)} />
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Menu</h3>
          <button className="close-sidebar" onClick={() => setIsOpen(false)}>×</button>
        </div>
        <div className="sidebar-content">
          <button 
            className={`sidebar-item ${location.pathname === '/' ? 'active' : ''}`}
            onClick={() => handleNavigation('/')}
          >
            Pokédex
          </button>
          <button 
            className={`sidebar-item ${location.pathname === '/games-maps' ? 'active' : ''}`}
            onClick={() => handleNavigation('/games-maps')}
          >
            Games & Maps
          </button>
          <button 
            className={`sidebar-item ${location.pathname === '/items' ? 'active' : ''}`}
            onClick={() => handleNavigation('/items')}
          >
            Items
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 