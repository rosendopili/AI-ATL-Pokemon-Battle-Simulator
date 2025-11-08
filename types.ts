
export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  stats: Stat[];
  types: {
    type: {
      name: string;
    };
  }[];
}

export interface Stat {
  base_stat: number;
  stat: {
    name: string;
  };
}

export enum GameState {
  SELECTION,
  BATTLE,
  VICTORY,
}
