import React, { useState, useMemo } from 'react';
import { Pokemon } from '../types';
import PokemonCard from './PokemonCard';
import LoadingSpinner from './LoadingSpinner';
import { POKEMON_TYPES, TYPE_COLORS } from '../constants';

interface PokemonSelectionProps {
  allPokemon: Pokemon[];
  selectedPokemon: Pokemon[];
  onPokemonSelect: (pokemon: Pokemon) => void;
  onStartBattle: () => void;
  loading: boolean;
}

const PokemonSelection: React.FC<PokemonSelectionProps> = ({
  allPokemon,
  selectedPokemon,
  onPokemonSelect,
  onStartBattle,
  loading,
}) => {
  const [filterType, setFilterType] = useState<string>('all');

  const filteredPokemon = useMemo(() => {
    if (filterType === 'all') {
      return allPokemon;
    }
    return allPokemon.filter(p => p.types.some(({ type }) => type.name === filterType));
  }, [allPokemon, filterType]);

  if (loading) {
    return <LoadingSpinner text="Summoning fighters..." />;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 w-full max-w-lg">
        <label htmlFor="type-filter" className="block mb-2 text-sm font-medium text-gray-300">Sort by Type:</label>
        <select
          id="type-filter"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5 capitalize"
        >
          {POKEMON_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 w-full">
        {filteredPokemon.map(pokemon => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            onSelect={onPokemonSelect}
            isSelected={!!selectedPokemon.find(p => p.id === pokemon.id)}
          />
        ))}
      </div>
      
      {selectedPokemon.length === 2 && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm p-4 z-50">
          <div className="container mx-auto flex justify-center items-center gap-4">
              <div className="flex items-center gap-2">
                <img src={selectedPokemon[0].sprites.other['official-artwork'].front_default} alt={selectedPokemon[0].name} className="w-12 h-12"/>
                <span className="font-bold capitalize">{selectedPokemon[0].name}</span>
              </div>
              <span className="font-press-start text-yellow-400 text-2xl">VS</span>
              <div className="flex items-center gap-2">
                 <img src={selectedPokemon[1].sprites.other['official-artwork'].front_default} alt={selectedPokemon[1].name} className="w-12 h-12"/>
                <span className="font-bold capitalize">{selectedPokemon[1].name}</span>
              </div>
             <button
              onClick={onStartBattle}
              className="ml-8 font-press-start text-lg bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-transform hover:scale-105"
            >
              Start Battle!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonSelection;