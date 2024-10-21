import React from 'react';
import PokemonList from './Component/PokemonList/PokemonList';
import TeamList from './Component/TeamList/TeamList';
import PokemonSelector from './Component/CreateTeam/PokemonSelector';
import BattleSimulation from './Component/BattleSimulation/BattleSimulation';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

const App: React.FC = () => {
  return (
    <div>
      <h1>Pokémon Battle Application</h1>
      <PokemonList />
      <TeamList />
      <PokemonSelector />
      <BattleSimulation />
    </div>
  );
};

export default App;
