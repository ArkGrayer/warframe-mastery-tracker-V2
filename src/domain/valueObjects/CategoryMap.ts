export const EXCLUDED_NAMES: string[] = [
  "Excalibur Prime",
  "Skana Prime",
  "Lato Prime",
  "Railjack",
  "Plexus",
  "Venari",
  "Venari Prime"
];

export const CATEGORY_MAP: Record<string, string> = {
  "Warframes": "Warframes",
  "Primary": "Primary",
  "Secondary": "Secondary",
  "Melee": "Melee",
  "Archwing": "Archwing",
  "Arch-Gun": "Archwing",
  "Arch-Melee": "Archwing",
  "Necramech": "Archwing",
  "K-Drive": "Archwing",
  "Sentinels": "Sentinels",
  "SentinelWeapons": "Sentinels",
  "MOA": "Sentinels",
  "Hound": "Sentinels",
  "Pets": "Pets",
  "Amps": "Amps"
};

export const SUB_CATEGORIES: Record<string, Array<{ id: string, label: string }>> = {
  "Archwing": [
    { id: "Archwing", label: "Archwings" },
    { id: "Arch-Gun", label: "Arch-Guns" },
    { id: "Arch-Melee", label: "Arch-Melee" },
    { id: "Necramech", label: "Necramechs" },
    { id: "K-Drive", label: "K-Drives" }
  ],
  "Sentinels": [
    { id: "Sentinels", label: "Sentinels" },
    { id: "SentinelWeapons", label: "Sentinel Weapons" },
    { id: "MOA", label: "MOAs" },
    { id: "Hound", label: "Hounds" }
  ],
  "Pets": [
    { id: "Kubrow", label: "Kubrows" },
    { id: "Kavat", label: "Kavats" },
    { id: "Predasite", label: "Predasites" },
    { id: "Vulpaphyla", label: "Vulpaphylas" },
    { id: "Hound", label: "Hounds" }
  ],
  "Amps": [
    { id: "Prism", label: "Prisms" }
  ]
};
