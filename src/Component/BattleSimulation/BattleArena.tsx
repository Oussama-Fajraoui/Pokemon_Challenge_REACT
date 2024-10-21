import React from 'react';

interface BattleResult {
  round_no: number;
  team1_pokemon: string;
  team2_pokemon: string;
  team1_pokemon_image: string;  // Assume these fields are now filled
  team2_pokemon_image: string;
  team1_pokemon_life: number;
  team2_pokemon_life: number;
  winner_team: string;
}

interface BattleArenaProps {
  results: BattleResult[];
  onRestart: () => void;
}

const BattleArena: React.FC<BattleArenaProps> = ({ results, onRestart }) => {
  return (
    <div className="container mt-4">
      <h2>Results:</h2>
      {results.map((result, index) => (
        <div key={index} className="card mb-2">
          <div className="card-body">
            <h5 className="card-title">Round {result.round_no}: {result.winner_team} wins</h5>
            <div className="row align-items-center">
              <div className="col-md-6 text-center">
                <img src={result.team1_pokemon_image} alt={result.team1_pokemon} style={{ width: '100px' }} />
                <p><strong>{result.team1_pokemon}</strong></p>
                <div className="progress">
                  <div className="progress-bar" style={{ width: `${result.team1_pokemon_life}%` }}>{result.team1_pokemon_life}</div>
                </div>
              </div>
              <div className="col-md-6 text-center">
                <img src={result.team2_pokemon_image} alt={result.team2_pokemon} style={{ width: '100px' }} />
                <p><strong>{result.team2_pokemon}</strong></p>
                <div className="progress">
                  <div className="progress-bar" style={{ width: `${result.team2_pokemon_life}%` }}>{result.team2_pokemon_life}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <button className="btn btn-primary" onClick={onRestart}>Restart Battle</button>
    </div>
  );
};

export default BattleArena;
