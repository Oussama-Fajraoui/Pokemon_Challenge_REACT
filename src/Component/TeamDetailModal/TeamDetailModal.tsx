import React, { useEffect } from 'react';

interface Pokemon {
  id: string;
  name: string;
  image: string;
}

interface TeamDetailsModalProps {
  teamName: string;
  pokemons: Pokemon[];
  onClose: () => void;
}

const TeamDetailsModal: React.FC<TeamDetailsModalProps> = ({ teamName, pokemons, onClose }) => {
  // Handle clicking outside the modal content to close it
  const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if ((event.target as Element).classList.contains('modal')) {
      onClose();
    }
  };

  // Add event listener to close the modal on pressing the ESC key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div className="modal show" tabIndex={-1} style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={handleOutsideClick}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{teamName}</h5>
            <button type="button" className="close" onClick={onClose}>
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {pokemons.map(pokemon => (
              <div key={pokemon.id} className="d-flex align-items-center mb-2">
                <img src={pokemon.image} alt={pokemon.name} style={{ width: '50px', marginRight: '10px' }} />
                <p className="mb-0">{pokemon.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetailsModal;
