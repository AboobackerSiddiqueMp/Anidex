import { AnimalDexEntry } from "@/types/anidex";

const STORAGE_KEY = "anidex_field_journal_v1";

// Pre-seeded starter specimens for immediate exploration
export const STARTER_SPECIMENS: AnimalDexEntry[] = [
  {
    id: "dex_seed_038",
    dexNumber: "#038",
    commonName: "Red Fox",
    scientificName: "Vulpes vulpes",
    category: "Mammal",
    elementalTypes: ["Forest", "Nocturnal", "Canine"],
    confidence: 98,
    conservationStatus: {
      code: "LC",
      label: "Least Concern",
      description: "Extremely adaptable, widespread across northern hemisphere",
    },
    habitat: {
      biome: "Temperate Forests, Scrublands & Suburban Edges",
      geographicRange: "North America, Europe, Asia, North Africa, Australia",
      microHabitat: "Subterranean dens, hollow logs, brush piles",
      climate: "Temperate to Subarctic, highly resilient",
    },
    physicalStats: {
      size: "45 – 90 cm body length",
      weight: "3.5 – 14 kg",
      lifespan: "2 – 4 years in wild (up to 14 in protected care)",
      speed: "Up to 50 km/h in bursts",
    },
    diet: {
      type: "Omnivore",
      details: "Small rodents, rabbits, berries, beetles, amphibians, and fruits",
    },
    behavior: "Solitary hunter using magnetic navigation to calibrate pouncing angle on prey buried beneath snow.",
    outdoorEncounterTips: "Observe from at least 20 meters. Never feed; habituated foxes lose natural foraging skills. Watch for curious head tilting.",
    funFacts: [
      "Uses Earth's magnetic field like a directional targeting laser when leaping onto snow-covered prey.",
      "Has over 28 distinct vocal calls, ranging from high-pitched barks to eerie scream-like howls.",
      "The white tip on its tail acts as an optical beacon guide for kits to follow through twilight foliage."
    ],
    dexEntryText: "Red Fox, the Cunning Canine. It stalks through forest undergrowth with silent pawsteps. Its keen auditory senses can detect the rustle of a mouse beneath three feet of frozen snow.",
    handsFreeSpeechSummary: "AniDex Entry number 038: Red Fox, Vulpes vulpes. A master of forest margins and woodland trails. Known for exceptional hearing and acrobatic pouncing leaps. They navigate using Earth's magnetic field and are most active during dawn and dusk. Keep a quiet perimeter when observing their territory.",
    imageUrl: "https://images.unsplash.com/photo-1516934024742-b461fba47600?auto=format&fit=crop&w=800&q=80",
    timestamp: Date.now() - 86400000 * 3,
    isFavorite: true,
    locationName: "Whispering Pines Ridge",
  },
  {
    id: "dex_seed_065",
    dexNumber: "#065",
    commonName: "Barn Owl",
    scientificName: "Tyto alba",
    category: "Bird",
    elementalTypes: ["Aerial", "Nocturnal", "Silent Hunter"],
    confidence: 96,
    conservationStatus: {
      code: "LC",
      label: "Least Concern",
      description: "Globally distributed, vulnerable to intensive rodenticide use",
    },
    habitat: {
      biome: "Open Grasslands, Savannas & Agricultural Farmland",
      geographicRange: "Found on every continent except Antarctica",
      microHabitat: "Tree cavities, abandoned silos, barn rafters, cliff ledges",
      climate: "Temperate to Tropical",
    },
    physicalStats: {
      size: "33 – 39 cm (Wingspan: 80 – 95 cm)",
      weight: "430 – 620 g",
      lifespan: "4 years wild average",
      speed: "Silent glide up to 30 km/h",
    },
    diet: {
      type: "Carnivore",
      details: "Strict rodent specialist: voles, field mice, shrews, small rats",
    },
    behavior: "Flies with soundless feather fringes that eliminate acoustic turbulence, allowing it to pinpoint prey in total darkness.",
    outdoorEncounterTips: "Avoid spotlighting roosting owls with white flashlights; use dim red spectrum to prevent blinding their sensitive retinas.",
    funFacts: [
      "Its heart-shaped facial disc functions like an acoustic satellite dish, funneling sound directly into asymmetrical ears.",
      "Can swallow prey whole and regurgitates undigested bones and fur in compact pellets.",
      "A single wild barn owl family consumes upwards of 1,000 rodents per nesting season."
    ],
    dexEntryText: "Barn Owl, the Silent Specter. Its serrated wing feathers muffle the sound of flapping wings completely, making its nighttime ambush completely silent to prey.",
    handsFreeSpeechSummary: "AniDex Entry number 065: Barn Owl, Tyto alba. Renowned as nature's stealth flier. Its heart-shaped facial disc channels the faintest rustle of grassland rodents into asymmetrical ears. Capable of pinpointing prey in absolute darkness without needing line of sight.",
    imageUrl: "https://images.unsplash.com/photo-1543549790-8b5f4a028cfb?auto=format&fit=crop&w=800&q=80",
    timestamp: Date.now() - 86400000 * 2,
    isFavorite: true,
    locationName: "Silver Meadow Basin",
  },
  {
    id: "dex_seed_112",
    dexNumber: "#112",
    commonName: "Monarch Butterfly",
    scientificName: "Danaus plexippus",
    category: "Invertebrate",
    elementalTypes: ["Pollinator", "Migratory", "Aposematic"],
    confidence: 97,
    conservationStatus: {
      code: "VU",
      label: "Vulnerable",
      description: "Severe declines from milkweed loss and wintering forest disruption",
    },
    habitat: {
      biome: "Meadows, Prairies, Coastal Scrub, Mountain Oyamel Forests",
      geographicRange: "Transcontinental North American migration corridor (Canada to Central Mexico)",
      microHabitat: "Milkweed patches and sunny nectar-rich wildflowers",
      climate: "Sunny, frost-sensitive warm season",
    },
    physicalStats: {
      size: "8.9 – 10.2 cm wingspan",
      weight: "0.5 – 0.75 g",
      lifespan: "2 – 6 weeks (breeding gen), up to 9 months (migratory gen)",
      speed: "14 – 20 km/h gliding with thermal updrafts",
    },
    diet: {
      type: "Herbivore",
      details: "Larvae exclusively consume milkweed; adults sip wildflower nectar",
    },
    behavior: "Undertakes multi-generational transcontinental migrations spanning up to 4,800 kilometers.",
    outdoorEncounterTips: "Do not handle their fragile wing scales. Plant native milkweed (Asclepias) to bolster local waystations.",
    funFacts: [
      "Their bright orange pattern is a warning signal to birds that they contain cardenolide heart toxins from milkweed.",
      "Migrating monarchs navigate using a sun compass coupled to an internal circadian clock in their antennae.",
      "The 'super generation' born in late summer lives 8 times longer than standard summer monarchs."
    ],
    dexEntryText: "Monarch Butterfly, the Nomad Wing. Decorated in vivid warning pigments, this delicate explorer traverses thousands of miles guided by thermal winds and solar alignment.",
    handsFreeSpeechSummary: "AniDex Entry number 112: Monarch Butterfly, Danaus plexippus. A marvel of insect endurance. Each autumn, the migratory generation embarks on a 3,000-mile journey south to alpine fir forests in Mexico. Their vibrant orange wings signal toxic defenses to hungry predators.",
    imageUrl: "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&w=800&q=80",
    timestamp: Date.now() - 86400000,
    isFavorite: false,
    locationName: "Sunburst Wildflower Glade",
  },
  {
    id: "dex_seed_094",
    dexNumber: "#094",
    commonName: "Green Sea Turtle",
    scientificName: "Chelonia mydas",
    category: "Reptile",
    elementalTypes: ["Marine", "Deep Ocean", "Ancient Navigator"],
    confidence: 95,
    conservationStatus: {
      code: "EN",
      label: "Endangered",
      description: "Threatened by plastic ingestion, marine bycatch, and nesting beach light pollution",
    },
    habitat: {
      biome: "Tropical & Subtropical Coral Reefs & Coastal Seagrass Meadows",
      geographicRange: "Warm coastal oceans globally",
      microHabitat: "Shallow lagoons, seagrass pastures, offshore ocean trenches",
      climate: "Tropical to Warm Temperate Waters",
    },
    physicalStats: {
      size: "100 – 120 cm carapace length",
      weight: "110 – 190 kg",
      lifespan: "70 – 80+ years",
      speed: "Up to 35 km/h underwater propulsion",
    },
    diet: {
      type: "Herbivore",
      details: "Unique among sea turtles: almost entirely seagrasses and algae as adults",
    },
    behavior: "Returns to the exact beach where it was hatched decades earlier to lay eggs, guided by geomagnetic imprinting.",
    outdoorEncounterTips: "Stay at least 3 meters away in water. Never touch carapace or disrupt surfacing for air. Shield beach flashlights during nesting seasons.",
    funFacts: [
      "Can hold their breath for up to five hours underwater during resting dives by slowing heart rate.",
      "Named 'Green' turtle not for its shell, but for the emerald tint of its internal cartilage resulting from a seagrass diet.",
      "Salt glands behind their eyes excrete excess ocean salt, appearing as though they are 'crying' on beaches."
    ],
    dexEntryText: "Green Sea Turtle, the Ancient Voyager. Gliding effortlessly through oceanic currents, it navigates global seas and returns unerringly to its natal nesting shores.",
    handsFreeSpeechSummary: "AniDex Entry number 094: Green Sea Turtle, Chelonia mydas. An ocean wanderer with roots reaching prehistoric eras. Adult green sea turtles act as vital caretakers of marine ecosystems by grazing seagrass beds like aquatic lawnmowers. Maintain respectful distance during coastal dives.",
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    timestamp: Date.now() - 3600000 * 12,
    isFavorite: false,
    locationName: "Emerald Cove Atoll",
  },
];

let cachedRaw: string | null = null;
let cachedEntries: AnimalDexEntry[] = STARTER_SPECIMENS;
const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch {}
  });
}

export function subscribeToEntries(callback: () => void) {
  listeners.add(callback);
  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cachedRaw = null;
      callback();
    }
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
  }
  return () => {
    listeners.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
    }
  };
}

export function getEntriesSnapshot(): AnimalDexEntry[] {
  if (typeof window === "undefined") return STARTER_SPECIMENS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) {
      return cachedEntries;
    }
    cachedRaw = raw;
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(STARTER_SPECIMENS));
      cachedEntries = STARTER_SPECIMENS;
      return cachedEntries;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      cachedEntries = parsed;
      return cachedEntries;
    }
    cachedEntries = STARTER_SPECIMENS;
    return cachedEntries;
  } catch (e) {
    console.warn("Error reading anidex storage:", e);
    return STARTER_SPECIMENS;
  }
}

export function getServerSnapshot(): AnimalDexEntry[] {
  return STARTER_SPECIMENS;
}

export function getStoredEntries(): AnimalDexEntry[] {
  return getEntriesSnapshot();
}

export function saveEntryToStorage(entry: AnimalDexEntry): AnimalDexEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const current = getEntriesSnapshot();
    // Remove duplicate by id if exists
    const filtered = current.filter((e) => e.id !== entry.id);
    const updated = [entry, ...filtered];
    const serialized = JSON.stringify(updated);
    localStorage.setItem(STORAGE_KEY, serialized);
    cachedRaw = serialized;
    cachedEntries = updated;
    emitChange();
    return updated;
  } catch (e) {
    console.error("Failed to save anidex entry:", e);
    return getEntriesSnapshot();
  }
}

export function deleteEntryFromStorage(id: string): AnimalDexEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const current = getEntriesSnapshot();
    const updated = current.filter((e) => e.id !== id);
    const serialized = JSON.stringify(updated);
    localStorage.setItem(STORAGE_KEY, serialized);
    cachedRaw = serialized;
    cachedEntries = updated;
    emitChange();
    return updated;
  } catch (e) {
    console.error("Failed to delete anidex entry:", e);
    return getEntriesSnapshot();
  }
}

export function toggleFavoriteInStorage(id: string): AnimalDexEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const current = getEntriesSnapshot();
    const updated = current.map((e) =>
      e.id === id ? { ...e, isFavorite: !e.isFavorite } : e
    );
    const serialized = JSON.stringify(updated);
    localStorage.setItem(STORAGE_KEY, serialized);
    cachedRaw = serialized;
    cachedEntries = updated;
    emitChange();
    return updated;
  } catch (e) {
    return getEntriesSnapshot();
  }
}
