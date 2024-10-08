import React, { useState } from 'react';
import supabase from '../../services/supabaseClient';
import { Pokemon } from '../../services/types';

interface TeamListProps {
  pokemons: Pokemon[]; 
}

const TeamList: React.FC<TeamListProps> = ({ pokemons }) => {
  const [selectedPokemons, setSelectedPokemons] = useState<number[]>([]); 
  const [teamName, setTeamName] = useState<string>(''); 

  // Handle selecting and deselecting Pokémon
  const handleSelectPokemon = (id: number) => {
    if (selectedPokemons.includes(id)) {
      setSelectedPokemons(selectedPokemons.filter(pokemonId => pokemonId !== id));
    } else if (selectedPokemons.length < 6) {
      setSelectedPokemons([...selectedPokemons, id]);
    }
  };

  // Handle saving the team to the database
  const handleSaveTeam = async () => {
    if (selectedPokemons.length === 6 && teamName) {
      const { error } = await supabase.rpc('insert_team', {
        team_name: teamName,
        pokemon_ids: selectedPokemons
      });
      if (error) {
        console.error('Error saving team:', error);
      } else {
        alert('Team saved successfully!');
        setSelectedPokemons([]); 
        setTeamName(''); 
      }
    } else {
      alert('Please select 6 Pokémon and enter a team name.');
    }
  };

  return (
    <div>
      <h2>Create Your Team</h2>
      <input
        type="text"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        placeholder="Enter team name"
      />
      <ul>
        {pokemons.map((pokemon) => (
          <li key={pokemon.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedPokemons.includes(pokemon.id)}
                onChange={() => handleSelectPokemon(pokemon.id)}
              />
              {pokemon.name} - Power: {pokemon.power} - Life: {pokemon.life}
            </label>
          </li>
        ))}
      </ul>
      <button onClick={handleSaveTeam}>Save Team</button>
    </div>
  );
};

export default TeamList;
