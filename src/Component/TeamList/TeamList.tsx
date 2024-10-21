import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import TeamDetailsModal from '../TeamDetailModal/TeamDetailModal';

interface Team {
  id: string;
  name: string;
  total_power: number;
}

interface Pokemon {
  id: string;
  name: string;
  image: string;
}

const TeamList: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamPokemons, setTeamPokemons] = useState<Pokemon[]>([]);

  useEffect(() => {
    const fetchTeams = async () => {
      const { data, error } = await supabase
        .from<Team>('team')
        .select('*');
      if (error) {
        console.error('Error fetching teams:', error);
      } else {
        setTeams(data || []);
      }
    };

    fetchTeams();
  }, []);

  const handleTeamClick = async (team: Team) => {
    setSelectedTeam(team);
    const { data, error } = await supabase
      .from('team_pokemon')
      .select(`
        pokemon: pokemon_id (id, name, image)
      `)
      .eq('team_id', team.id);

    if (error) {
      console.error('Error fetching team pokemons:', error);
    } else {
      setTeamPokemons(data.map(item => item.pokemon));
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Pokemon Teams</h1>
      <div className="row">
        {teams.map((team) => (
          <div key={team.id} className="col-lg-4 col-md-6 mb-4">
            <div className="card" onClick={() => handleTeamClick(team)}>
              <div className="card-body">
                <h5 className="card-title">{team.name}</h5>
                <p className="card-text">Total Power: {team.total_power}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedTeam && teamPokemons.length > 0 && (
        <TeamDetailsModal
          teamName={selectedTeam.name}
          pokemons={teamPokemons}
          onClose={() => setSelectedTeam(null)}
        />
      )}
    </div>
  );
};

export default TeamList;
