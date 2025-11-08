
import { GoogleGenAI } from "@google/genai";
import { Pokemon } from "../types";

const getStat = (pokemon: Pokemon, statName: string): number => {
    return pokemon.stats.find(s => s.stat.name === statName)?.base_stat || 0;
};

export const getBattleAnalysis = async (winner: Pokemon, loser: Pokemon): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key not found. The winning Pokémon's superior strategy and power led to victory!";
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const winnerStats = `HP: ${getStat(winner, 'hp')}, Attack: ${getStat(winner, 'attack')}, Defense: ${getStat(winner, 'defense')}, Speed: ${getStat(winner, 'speed')}`;
  const loserStats = `HP: ${getStat(loser, 'hp')}, Attack: ${getStat(loser, 'attack')}, Defense: ${getStat(loser, 'defense')}, Speed: ${getStat(loser, 'speed')}`;

  const prompt = `
    In a Pokémon battle, ${winner.name} defeated ${loser.name}.
    Winner's stats: ${winnerStats}.
    Loser's stats: ${loserStats}.
    
    Provide a brief, exciting, one-paragraph analysis of why ${winner.name} won. Highlight the most influential skill or strength, such as a much higher attack or speed stat. Be concise and dramatic.
    `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to generate battle analysis from Gemini API.");
  }
};
