import { Generation } from '../types';

interface GenerationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGen: Generation;
  handleGenSelect: (gen: Generation) => void;
  generations: Generation[];
}

const GenerationDrawer = ({
  isOpen,
  onClose,
  selectedGen,
  handleGenSelect,
  generations
}: GenerationDrawerProps) => {
  return (
    <>
      <div 
        className={`generation-drawer-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />
      <div className={`generation-drawer ${isOpen ? 'open' : ''}`}>
        <div className="generation-drawer-header">
          <h3>Generation Filter</h3>
          <button className="close-drawer" onClick={onClose}>&times;</button>
        </div>
        <div className="generation-drawer-content">
          {generations.map((gen) => (
            <button
              key={gen.name}
              className={`gen-filter-button ${selectedGen.name === gen.name ? 'active' : ''}`}
              onClick={() => {
                handleGenSelect(gen);
              }}
            >
              {gen.name}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default GenerationDrawer; 