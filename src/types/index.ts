export interface Pokemon {
  name: string;
  id: number;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
    front_shiny: string;
    other?: {
      home?: {
        front_default: string;
        front_shiny: string;
      };
    };
    versions?: {
      'generation-v'?: {
        'black-white'?: {
          animated?: {
            front_default: string;
          };
        };
      };
    };
  };
  types: {
    type: {
      name: string;
    };
  }[];
  moves: {
    move: {
      name: string;
      url: string;
    };
    version_group_details: {
      level_learned_at: number;
      move_learn_method: {
        name: string;
      };
      version_group: {
        name: string;
      };
    }[];
  }[];
  forms: {
    name: string;
    url: string;
  }[];
}

export interface Generation {
  name: string;
  start: number;
  end: number;
}

export interface PokemonForm {
  name: string;
  sprites: {
    front_default: string;
    front_shiny: string;
  };
  types: {
    type: {
      name: string;
    };
  }[];
  form_name: string;
}

export interface PokemonDetails extends Pokemon {
  species: {
    url: string;
  };
  height: number;
  weight: number;
  abilities: {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  forms: {
    name: string;
    url: string;
  }[];
}

export interface AbilityDetail {
  name: string;
  effect_entries: {
    effect: string;
    language: {
      name: string;
    };
    short_effect: string;
  }[];
  is_hidden: boolean;
}

export interface PokemonSpecies {
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
    };
    version: {
      name: string;
    };
  }[];
  evolution_chain: {
    url: string;
  };
}

export interface MoveDetail {
  name: string;
  type: {
    name: string;
  };
  power: number | null;
  accuracy: number | null;
}

export interface Evolution {
  id: number;
  name: string;
  sprite: string;
  evolution_details?: {
    min_level?: number;
    item?: string;
    trigger?: string;
    trade?: boolean;
    held_item?: string;
    min_happiness?: number;
    time_of_day?: string;
    location?: string;
    known_move?: string;
  };
}

export interface EvolutionChain {
  base: Evolution;
  second_stage: Evolution[];
  final_stage: Evolution[];
}

export interface TCGCard {
  id: string;
  name: string;
  images: {
    small: string;
    large: string;
  };
  rarity: string;
  set: {
    name: string;
    series: string;
  };
} 