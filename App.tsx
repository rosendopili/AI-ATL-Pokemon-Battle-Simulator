
import React, { useState, useEffect, useCallback } from 'react';
import { fetchPokemonList, fetchPokemonDetails } from './services/pokeapi';
import { Pokemon, GameState } from './types';
import PokemonSelection from './components/PokemonSelection';
import BattleScreen from './components/BattleScreen';
import VictoryScreen from './components/VictoryScreen';
import { getBattleAnalysis } from './services/geminiService';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.SELECTION);
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon[]>([]);
  const [winner, setWinner] = useState<Pokemon | null>(null);
  const [loser, setLoser] = useState<Pokemon | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  useEffect(() => {
    const getPokemon = async () => {
      try {
        setLoading(true);
        const pokemonList = await fetchPokemonList(151); // Gen 1
        const pokemonDetailsPromises = pokemonList.map(p => fetchPokemonDetails(p.url));
        const pokemonDetails = await Promise.all(pokemonDetailsPromises);
        setAllPokemon(pokemonDetails);
      } catch (error) {
        console.error("Failed to fetch Pokémon:", error);
      } finally {
        setLoading(false);
      }
    };
    getPokemon();
  }, []);

  const handlePokemonSelect = (pokemon: Pokemon) => {
    if (selectedPokemon.length < 2 && !selectedPokemon.find(p => p.id === pokemon.id)) {
      setSelectedPokemon(prev => [...prev, pokemon]);
    } else {
      setSelectedPokemon(prev => prev.filter(p => p.id !== pokemon.id));
    }
  };

  const startBattle = () => {
    if (selectedPokemon.length === 2) {
      setGameState(GameState.BATTLE);
    }
  };

  const handleBattleEnd = useCallback(async (winnerPokemon: Pokemon, loserPokemon: Pokemon) => {
    setWinner(winnerPokemon);
    setLoser(loserPokemon);
    setGameState(GameState.VICTORY);
    try {
      setAnalysisLoading(true);
      const battleAnalysis = await getBattleAnalysis(winnerPokemon, loserPokemon);
      setAnalysis(battleAnalysis);
    } catch (error) {
      console.error("Failed to get battle analysis:", error);
      setAnalysis("Could not generate battle analysis. The victor's superior stats and tactics secured a decisive win!");
    } finally {
      setAnalysisLoading(false);
    }
  }, []);

  const resetGame = () => {
    setSelectedPokemon([]);
    setWinner(null);
    setLoser(null);
    setAnalysis('');
    setGameState(GameState.SELECTION);
  };

  const renderGameState = () => {
    switch (gameState) {
      case GameState.SELECTION:
        return (
          <PokemonSelection
            allPokemon={allPokemon}
            selectedPokemon={selectedPokemon}
            onPokemonSelect={handlePokemonSelect}
            onStartBattle={startBattle}
            loading={loading}
          />
        );
      case GameState.BATTLE:
        return (
          <BattleScreen
            player1={selectedPokemon[0]}
            player2={selectedPokemon[1]}
            onBattleEnd={handleBattleEnd}
          />
        );
      case GameState.VICTORY:
        return (
          <VictoryScreen
            winner={winner}
            analysis={analysis}
            onPlayAgain={resetGame}
            loading={analysisLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 md:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-press-start text-yellow-400 drop-shadow-[0_4px_6px_rgba(0,0,0,0.7)]">
          Pokémon Battle Simulator
        </h1>
      </header>
      <main>
        {renderGameState()}
      </main>
    </div>
  );
};

export default App;
