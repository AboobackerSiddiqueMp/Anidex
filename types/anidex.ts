export type AnimalCategory =
  | "Mammal"
  | "Bird"
  | "Reptile"
  | "Amphibian"
  | "Fish"
  | "Invertebrate"
  | "Other";

export type ConservationCode =
  | "LC"
  | "NT"
  | "VU"
  | "EN"
  | "CR"
  | "EW"
  | "EX"
  | "DD";

export interface AnimalDexEntry {
  id: string;
  dexNumber: string;
  commonName: string;
  scientificName: string;
  category: AnimalCategory;
  elementalTypes: string[];
  confidence: number;
  conservationStatus: {
    code: ConservationCode;
    label: string;
    description: string;
  };
  habitat: {
    biome: string;
    geographicRange: string;
    microHabitat: string;
    climate: string;
  };
  physicalStats: {
    size: string;
    weight: string;
    lifespan: string;
    speed: string;
  };
  diet: {
    type: string;
    details: string;
  };
  behavior: string;
  outdoorEncounterTips: string;
  funFacts: string[];
  dexEntryText: string;
  handsFreeSpeechSummary: string;
  imageUrl: string;
  timestamp: number;
  isFavorite?: boolean;
  notes?: string;
  locationName?: string;
}

export interface AnalyzeAnimalResponse {
  success: boolean;
  isAnimal: boolean;
  message?: string;
  entry?: AnimalDexEntry;
  rawDetails?: string;
}
