
import React, { useState, useEffect, useRef } from 'react';
import { Pokemon } from '../types';

interface BattleScreenProps {
  player1: Pokemon;
  player2: Pokemon;
  onBattleEnd: (winner: Pokemon, loser: Pokemon) => void;
}

const getStat = (pokemon: Pokemon, statName: string) => 
  pokemon.stats.find(s => s.stat.name === statName)?.base_stat || 1;

const BattlePokemon: React.FC<{ pokemon: Pokemon; hp: number; maxHp: number; isAttacking: boolean; isPlayer1: boolean }> = ({ pokemon, hp, maxHp, isAttacking, isPlayer1 }) => {
    const hpPercentage = (hp / maxHp) * 100;

    return (
        <div className={`flex flex-col items-center transition-transform duration-300 ${isAttacking ? 'scale-110' : ''}`}>
            <img 
                src={pokemon.sprites.other['official-artwork'].front_default} 
                alt={pokemon.name} 
                className={`h-40 w-40 md:h-64 md:w-64 object-contain drop-shadow-lg ${isPlayer1 ? '' : 'transform -scale-x-100'}`}
            />
            <div className="w-48 md:w-64 bg-gray-700 rounded-full mt-2 border-2 border-gray-600 p-1">
                <div 
                    className="bg-green-500 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full transition-all duration-500" 
                    style={{ width: `${hpPercentage}%` }}>
                </div>
            </div>
            <h2 className="text-2xl font-bold capitalize mt-2">{pokemon.name}</h2>
            <p className="text-lg">{Math.ceil(hp)} / {maxHp}</p>
        </div>
    );
};


const BattleScreen: React.FC<BattleScreenProps> = ({ player1, player2, onBattleEnd }) => {
  const [p1Stats, setP1Stats] = useState({ hp: getStat(player1, 'hp') * 2, maxHp: getStat(player1, 'hp') * 2 });
  const [p2Stats, setP2Stats] = useState({ hp: getStat(player2, 'hp') * 2, maxHp: getStat(player2, 'hp') * 2 });
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [isP1Attacking, setIsP1Attacking] = useState(false);
  const [isP2Attacking, setIsP2Attacking] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  
  const p1Speed = getStat(player1, 'speed');
  const p2Speed = getStat(player2, 'speed');
  const firstAttacker = p1Speed >= p2Speed ? player1 : player2;
  const secondAttacker = p1Speed >= p2Speed ? player2 : player1;

  useEffect(() => {
    const battleTimeout = setTimeout(() => {
        battleLoop(p1Stats.hp, p2Stats.hp, 1);
    }, 1000);
    return () => clearTimeout(battleTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [battleLog]);

  const addLog = (message: string) => {
    setBattleLog(prev => [...prev, message]);
  };

  const calculateDamage = (attacker: Pokemon, defender: Pokemon) => {
    const attack = getStat(attacker, 'attack');
    const defense = getStat(defender, 'defense');
    const baseDamage = 15;
    const damage = Math.max(1, ((attack / defense) * baseDamage) * (Math.random() * 0.4 + 0.8)); // Add some randomness
    return Math.floor(damage);
  };
  
  const performAttack = (attacker: Pokemon, defender: Pokemon, defenderHp: number, setDefenderHp: React.Dispatch<React.SetStateAction<{hp: number; maxHp: number;}>>) => {
      return new Promise<number>(resolve => {
        const isP1 = attacker.id === player1.id;
        if(isP1) setIsP1Attacking(true); else setIsP2Attacking(true);
        addLog(`${attacker.name} attacks!`);
        
        setTimeout(() => {
            const damage = calculateDamage(attacker, defender);
            const newHp = Math.max(0, defenderHp - damage);
            setDefenderHp(prev => ({...prev, hp: newHp}));
            addLog(`${defender.name} takes ${damage} damage!`);
            if(isP1) setIsP1Attacking(false); else setIsP2Attacking(false);
            resolve(newHp);
        }, 800);
      });
  };

  const battleLoop = async (currentP1Hp: number, currentP2Hp: number, round: number) => {
    if (round > 20) { // Safety break to avoid infinite loops
        const winner = currentP1Hp > currentP2Hp ? player1 : player2;
        const loser = currentP1Hp > currentP2Hp ? player2 : player1;
        addLog("The battle is too long! It's a draw by timeout!");
        setTimeout(() => onBattleEnd(winner, loser), 2000);
        return;
    }
    
    addLog(`--- Round ${round} ---`);

    // First attacker's turn
    let newP1Hp = currentP1Hp, newP2Hp = currentP2Hp;

    if (firstAttacker.id === player1.id) {
      newP2Hp = await performAttack(player1, player2, currentP2Hp, setP2Stats);
    } else {
      newP1Hp = await performAttack(player2, player1, currentP1Hp, setP1Stats);
    }
    
    if (newP1Hp <= 0 || newP2Hp <= 0) {
      const winner = newP1Hp <= 0 ? player2 : player1;
      const loser = newP1Hp <= 0 ? player1 : player2;
      addLog(`${loser.name} has fainted!`);
      addLog(`${winner.name} is the winner!`);
      setTimeout(() => onBattleEnd(winner, loser), 2000);
      return;
    }

    // Second attacker's turn
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (secondAttacker.id === player1.id) {
      newP2Hp = await performAttack(player1, player2, newP2Hp, setP2Stats);
    } else {
      newP1Hp = await performAttack(player2, player1, newP1Hp, setP1Stats);
    }

    if (newP1Hp <= 0 || newP2Hp <= 0) {
      const winner = newP1Hp <= 0 ? player2 : player1;
      const loser = newP1Hp <= 0 ? player1 : player2;
      addLog(`${loser.name} has fainted!`);
      addLog(`${winner.name} is the winner!`);
      setTimeout(() => onBattleEnd(winner, loser), 2000);
      return;
    }
    
    setTimeout(() => battleLoop(newP1Hp, newP2Hp, round + 1), 1500);
  };


  return (
    <div className="flex flex-col items-center">
        <div className="w-full flex justify-around items-center mb-4">
            <BattlePokemon pokemon={player1} hp={p1Stats.hp} maxHp={p1Stats.maxHp} isAttacking={isP1Attacking} isPlayer1={true} />
            <span className="font-press-start text-yellow-400 text-4xl">VS</span>
            <BattlePokemon pokemon={player2} hp={p2Stats.hp} maxHp={p2Stats.maxHp} isAttacking={isP2Attacking} isPlayer1={false} />
        </div>
        <div ref={logRef} className="w-full max-w-2xl h-48 bg-gray-800 rounded-lg p-4 border-2 border-gray-600 overflow-y-auto font-mono">
            {battleLog.map((log, index) => (
                <p key={index} className="text-sm md:text-base animate-fadeIn">{log}</p>
            ))}
        </div>
    </div>
  );
};

export default BattleScreen;
