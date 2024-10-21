import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';

interface Pokemon {
  id: string;
  name: string;
  power: number;
  life: number;
  image: string;
  type: { name: string };
}

const PokemonList: React.FC = () => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from<Pokemon>('pokemon')
        .select('id, name, power, life, image, type: pokemon_type(name)');

      if (error) {
        console.error('Error fetching pokemons:', error);
      } else {
        setPokemon(data || []);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-5">Pokemon List</h1>
      <div className="row">
        {pokemon.map((pokem) => (
          <div key={pokem.id} className="col-lg-4 col-md-6 mb-4">
            <div className="card pokemon-card">
              <img src={pokem.image} alt={pokem.name} className="card-img-top pokemon-img" />
              <div className="card-body">
                <h5 className="card-title">{pokem.name}</h5>
                <p className="card-text">Type: {pokem.type.name}</p>
                <p className="card-text">Power: {pokem.power} | Life: {pokem.life}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PokemonList;
