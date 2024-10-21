import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';

interface Pokemon {
  id: string;
  name: string;
  image: string;
}

interface Notification {
  message: string;
  type: 'success' | 'error';
}

const PokemonSelector: React.FC = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [selectedPokemons, setSelectedPokemons] = useState<string[]>([]);
  const [teamName, setTeamName] = useState('');
  const [notification, setNotification] = useState<Notification | null>(null);

  useEffect(() => {
    const fetchPokemons = async () => {
      const { data, error } = await supabase.from<Pokemon>('pokemon').select('id, name, image');
      if (error) {
        console.error('Error fetching pokemons:', error);
        setNotification({ message: 'Failed to load pokemons.', type: 'error' });
      } else {
        setPokemons(data || []);
      }
    };

    fetchPokemons();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (notification) {
      timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [notification]);

  const handlePokemonSelect = (id: string) => {
    if (selectedPokemons.includes(id)) {
      setSelectedPokemons(selectedPokemons.filter(pokemonId => pokemonId !== id));
    } else if (selectedPokemons.length < 6) {
      setSelectedPokemons([...selectedPokemons, id]);
    }
  };

  const handleSubmit = async () => {
    if (!teamName.trim()) {
      setNotification({ message: 'Please enter a team name.', type: 'error' });
      return;
    }
    if (selectedPokemons.length !== 6) {
      setNotification({ message: 'Please select exactly 6 Pokémon.', type: 'error' });
      return;
    }

    const { data, error } = await supabase.rpc('insert_team', { team_name: teamName, pokemon_ids: selectedPokemons });
    if (error) {
      console.error('Error submitting team:', error);
      setNotification({ message: 'Failed to create the team. Please try again.', type: 'error' });
    } else {
      setNotification({ message: 'Team added successfully!', type: 'success' });
      setSelectedPokemons([]); 
      setTeamName(''); 
    }
  };

  return (
    <div className="container">
      <h1 className="text-center my-4">Select Your Team to Fight</h1>
      {notification && (
        <div className={`alert alert-${notification.type === 'success' ? 'success' : 'danger'}`}>
          {notification.message}
        </div>
      )}
              <div className="col-md-6">
      <input
        type="text"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        placeholder="Enter team name"
        className="form-control my-3"
      />
      </div>
      <div className="row">
        {pokemons.map((pokemon) => (
          <div key={pokemon.id} className="col-md-4 col-sm-6 mb-2">
            <div className={`card pokemon-selector-card ${selectedPokemons.includes(pokemon.id) ? 'selected' : ''}`} onClick={() => handlePokemonSelect(pokemon.id)}>
              <img src={pokemon.image} alt={pokemon.name} className="card-img-top" />
              <div className="card-body">
                <h5 className="card-title">{pokemon.name}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={handleSubmit} className="btn btn-success mt-3">Submit Team</button>
    </div>
  );
};

export default PokemonSelector;
