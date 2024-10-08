import React, { useEffect, useState } from 'react';
import supabase from '../../services/supabaseClient';
import { Pokemon } from '../../services/types';

const PokemonList: React.FC = () => {
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
    <div>
      <h1>Pokémon List</h1>
      <ul>
        {pokemons.map((pokemon) => (
          <li key={pokemon.id}>
            {pokemon.name} - Power: {pokemon.power} - Life: {pokemon.life}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PokemonList;
