
import { Pokemon } from '../types';
import { POKEAPI_BASE_URL } from '../constants';

interface PokemonListItem {
  name: string;
  url: string;
}

export const fetchPokemonList = async (limit: number = 151): Promise<PokemonListItem[]> => {
  const response = await fetch(`${POKEAPI_BASE_URL}/pokemon?limit=${limit}`);
  if (!response.ok) {
    throw new Error('Failed to fetch Pokémon list');
  }
  const data = await response.json();
  return data.results;
};

export const fetchPokemonDetails = async (url: string): Promise<Pokemon> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokémon details from ${url}`);
  }
  const data = await response.json();
  return data;
};
