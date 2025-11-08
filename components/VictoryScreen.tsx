
import React from 'react';
import { Pokemon } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface VictoryScreenProps {
  winner: Pokemon | null;
  analysis: string;
  onPlayAgain: () => void;
  loading: boolean;
}

const VictoryScreen: React.FC<VictoryScreenProps> = ({ winner, analysis, onPlayAgain, loading }) => {
  if (!winner) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold">Something went wrong.</h2>
        <button
          onClick={onPlayAgain}
          className="mt-8 font-press-start bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-lg shadow-lg"
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center animate-fadeIn p-4">
      <h2 className="text-5xl font-press-start text-yellow-400 drop-shadow-lg mb-4">WINNER!</h2>
      <div className="relative">
        <img
          src={winner.sprites.other['official-artwork'].front_default}
          alt={winner.name}
          className="h-64 w-64 object-contain animate-pulse drop-shadow-2xl"
        />
      </div>
      <h3 className="text-4xl font-bold capitalize mt-4">{winner.name}</h3>

      <div className="mt-8 max-w-2xl bg-gray-800 p-6 rounded-lg border-2 border-yellow-400 shadow-xl">
        <h4 className="text-2xl font-press-start text-yellow-400 mb-4">Battle Analysis</h4>
        {loading ? (
          <LoadingSpinner text="Analyzing Battle..." />
        ) : (
          <p className="text-lg text-left leading-relaxed">{analysis}</p>
        )}
      </div>

      <button
        onClick={onPlayAgain}
        className="mt-12 font-press-start text-lg bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg transform transition-transform hover:scale-105"
      >
        Play Again
      </button>
    </div>
  );
};

export default VictoryScreen;
