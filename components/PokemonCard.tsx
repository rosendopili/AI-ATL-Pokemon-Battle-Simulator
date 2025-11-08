
import React from 'react';
import { Pokemon } from '../types';
import { TYPE_COLORS } from '../constants';

interface PokemonCardProps {
  pokemon: Pokemon;
  onSelect: (pokemon: Pokemon) => void;
  isSelected: boolean;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onSelect, isSelected }) => {
  const primaryType = pokemon.types[0]?.type.name || 'normal';
  const bgColor = TYPE_COLORS[primaryType] || 'bg-gray-500';

  return (
    <div
      className={`rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 cursor-pointer border-4 ${isSelected ? 'border-yellow-400 scale-105 shadow-yellow-400/50' : 'border-gray-700'}`}
      onClick={() => onSelect(pokemon)}
    >
      <div className={`${bgColor} p-4 flex justify-center items-center`}>
        <img
          src={pokemon.sprites.other['official-artwork'].front_default}
          alt={pokemon.name}
          className="h-32 w-32 object-contain"
        />
      </div>
      <div className="p-4 bg-gray-800">
        <h3 className="text-xl font-bold capitalize text-center text-white">{pokemon.name}</h3>
        <div className="flex justify-center gap-2 mt-2">
            {pokemon.types.map(({ type }) => (
                <span key={type.name} className={`${TYPE_COLORS[type.name] || 'bg-gray-500'} text-white text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize`}>
                    {type.name}
                </span>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
