import React, { useEffect, useState } from 'react';
import PokemonList from './Component/PokemonList/PokemonList';
import TeamList from './Component/TeamList/TeamList';
import supabase from './services/supabaseClient';
import { Pokemon } from './services/types';

const App: React.FC = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  useEffect(() => {
    const fetchPokemon = async () => {
      const { data, error } = await supabase.from('pokemon').select('*');
      if (error) {
        console.error('Error fetching Pokémon:', error);
      } else {
        setPokemons(data || []);
      }
    };

    fetchPokemon();
  }, []);

  return (
    <div className="App">
      <h1>Pokémon App</h1>
      <PokemonList />
      {pokemons.length > 0 && <TeamList pokemons={pokemons} />} 
    </div>
  );
};

export default App;
