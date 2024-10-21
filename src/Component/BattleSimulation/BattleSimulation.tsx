import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import BattleArena from './BattleArena';

interface Team {
  id: string;
  name: string;
}

interface Pokemon {
  id: string;
  name: string;
  power: number;
  life: number;
  image: string;
  type: { name: string };
}

interface TeamPokemon {
  id: string;
  team_id: string;
  pokemon_id: string;
}

const BattleSimulation: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [team1, setTeam1] = useState<string>('');
  const [team2, setTeam2] = useState<string>('');
  const [battleResults, setBattleResults] = useState<any[]>([]);
  const [showBattle, setShowBattle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [teamPokemons, setTeamPokemon] = useState<TeamPokemon[]>([]);

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

  useEffect(() => {
    const fetchTeamDetails = async () => {
      const { data, error } = await supabase
        .from<TeamPokemon>('team_pokemon')
        .select('id, team_id, pokemon_id');

      if (error) {
        console.error('Error fetching pokemons:', error);
      } else {
        setTeamPokemon(data || []);
      }
    };

    fetchTeamDetails();
  }, []);

  useEffect(() => {
    const fetchTeams = async () => {
      const { data, error } = await supabase.from<Team>('team').select('id, name');
      if (error) {
        console.error('Error fetching teams:', error);
      } else {
        setTeams(data || []);
      }
    };

    fetchTeams();
  }, []);

  const handleBattle = async () => {
    if (!team1 || !team2) {
        alert("Please select both teams for the battle.");
        return;
    }
    setLoading(true);
    const { data, error } = await supabase.rpc('simulate_battle_v', { team1_id: team1, team2_id: team2 });
    if (error) {
        console.error('Error simulating battle:', error);
        alert('Failed to simulate the battle. Please try again.');
    } else {
        console.log("Battle data:", data);  // Log the raw battle data
        const detailedResults = data.map(result => {
            const team1PokemonDetails = pokemon.find(p => p.name === result.team1_pokemon);
            const team2PokemonDetails = pokemon.find(p => p.name === result.team2_pokemon);
            console.log("Matching Pokemon 1 Details:", team1PokemonDetails); // Check what is being found
            console.log("Matching Pokemon 2 Details:", team2PokemonDetails);
            return {
                ...result,
                team1_pokemon_image: team1PokemonDetails ? team1PokemonDetails.image : 'default1.png',
                team2_pokemon_image: team2PokemonDetails ? team2PokemonDetails.image : 'default2.png',
                team1_pokemon_life: result.team1_pokemon_life,
                team2_pokemon_life: result.team2_pokemon_life,
            };
        });
        setBattleResults(detailedResults);
        setShowBattle(true);
    }
    setLoading(false);
};

  const handleRestart = () => {
    setShowBattle(false);
    setTeam1('');
    setTeam2('');
    setBattleResults([]);
  };

  if (showBattle) {
    return <BattleArena results={battleResults} onRestart={handleRestart} />;
  }

  return (
    <div className="container">
      <h1 className="text-center">Battle Simulation</h1>
      <div className="row">
        <div className="col">
          <select value={team1} onChange={e => setTeam1(e.target.value)} className="form-control">
            <option value="">Select Team 1</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
        </div>
        <div className="col">
          <select value={team2} onChange={e => setTeam2(e.target.value)} className="form-control">
            <option value="">Select Team 2</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
        </div>
      </div>
      <button className="btn btn-primary mt-3" onClick={handleBattle} disabled={loading}>
        {loading ? 'Simulating...' : 'Start Battle'}
      </button>
    </div>
  );
};

export default BattleSimulation;
