export interface DRSZone {
  detectionPoint: number;
  activationPoint: number;
  endPoint: number;
}

export interface F1Track {
  id: string;
  name: string;
  shortName: string;
  country: string;
  city: string;
  lapLength: number;
  turns: number;
  drsZones: DRSZone[];
  sectorDistances: [number, number];
  lat: number;
  lng: number;
}

export const TRACKS: readonly F1Track[] = [
  {
    id: "albert_park",
    name: "Albert Park Circuit",
    shortName: "Melbourne",
    country: "Australia",
    city: "Melbourne",
    lapLength: 5278,
    turns: 14,
    drsZones: [
      { detectionPoint: 450, activationPoint: 640, endPoint: 1170 },
      { detectionPoint: 2720, activationPoint: 2900, endPoint: 3380 }
    ],
    sectorDistances: [1860, 3780],
    lat: -37.8497,
    lng: 144.968
  },
  {
    id: "shanghai",
    name: "Shanghai International Circuit",
    shortName: "Shanghai",
    country: "China",
    city: "Shanghai",
    lapLength: 5451,
    turns: 16,
    drsZones: [
      { detectionPoint: 440, activationPoint: 610, endPoint: 1130 },
      { detectionPoint: 4670, activationPoint: 4860, endPoint: 5350 }
    ],
    sectorDistances: [1847, 3910],
    lat: 31.3389,
    lng: 121.2197
  },
  {
    id: "suzuka",
    name: "Suzuka International Racing Course",
    shortName: "Suzuka",
    country: "Japan",
    city: "Suzuka",
    lapLength: 5807,
    turns: 18,
    drsZones: [{ detectionPoint: 5100, activationPoint: 5350, endPoint: 5700 }],
    sectorDistances: [2027, 4385],
    lat: 34.8431,
    lng: 136.5407
  },
  {
    id: "bahrain",
    name: "Bahrain International Circuit",
    shortName: "Bahrain",
    country: "Bahrain",
    city: "Sakhir",
    lapLength: 5412,
    turns: 15,
    drsZones: [
      { detectionPoint: 340, activationPoint: 490, endPoint: 1010 },
      { detectionPoint: 4680, activationPoint: 4890, endPoint: 5260 }
    ],
    sectorDistances: [1811, 3621],
    lat: 26.0325,
    lng: 50.5106
  },
  {
    id: "jeddah",
    name: "Jeddah Corniche Circuit",
    shortName: "Jeddah",
    country: "Saudi Arabia",
    city: "Jeddah",
    lapLength: 6174,
    turns: 27,
    drsZones: [
      { detectionPoint: 1580, activationPoint: 1780, endPoint: 2340 },
      { detectionPoint: 5120, activationPoint: 5380, endPoint: 5980 }
    ],
    sectorDistances: [2060, 4340],
    lat: 21.6319,
    lng: 39.1044
  },
  {
    id: "miami",
    name: "Miami International Autodrome",
    shortName: "Miami",
    country: "United States",
    city: "Miami Gardens",
    lapLength: 5412,
    turns: 19,
    drsZones: [
      { detectionPoint: 560, activationPoint: 740, endPoint: 1280 },
      { detectionPoint: 3600, activationPoint: 3790, endPoint: 4280 }
    ],
    sectorDistances: [1780, 3720],
    lat: 25.9581,
    lng: -80.2389
  },
  {
    id: "imola",
    name: "Autodromo Enzo e Dino Ferrari",
    shortName: "Imola",
    country: "Italy",
    city: "Imola",
    lapLength: 4909,
    turns: 19,
    drsZones: [{ detectionPoint: 4100, activationPoint: 4350, endPoint: 4780 }],
    sectorDistances: [1697, 3487],
    lat: 44.3439,
    lng: 11.7167
  },
  {
    id: "monaco",
    name: "Circuit de Monaco",
    shortName: "Monaco",
    country: "Monaco",
    city: "Monte Carlo",
    lapLength: 3337,
    turns: 19,
    drsZones: [{ detectionPoint: 2780, activationPoint: 2920, endPoint: 3210 }],
    sectorDistances: [1145, 2329],
    lat: 43.7347,
    lng: 7.4206
  },
  {
    id: "barcelona",
    name: "Circuit de Barcelona-Catalunya",
    shortName: "Barcelona",
    country: "Spain",
    city: "Montmeló",
    lapLength: 4657,
    turns: 16,
    drsZones: [
      { detectionPoint: 580, activationPoint: 770, endPoint: 1260 },
      { detectionPoint: 3700, activationPoint: 3930, endPoint: 4450 }
    ],
    sectorDistances: [1580, 3340],
    lat: 41.57,
    lng: 2.2611
  },
  {
    id: "montreal",
    name: "Circuit Gilles Villeneuve",
    shortName: "Montreal",
    country: "Canada",
    city: "Montreal",
    lapLength: 4361,
    turns: 14,
    drsZones: [
      { detectionPoint: 80, activationPoint: 260, endPoint: 1180 },
      { detectionPoint: 3550, activationPoint: 3720, endPoint: 4240 }
    ],
    sectorDistances: [1460, 3050],
    lat: 45.5,
    lng: -73.5228
  },
  {
    id: "red_bull_ring",
    name: "Red Bull Ring",
    shortName: "Austria",
    country: "Austria",
    city: "Spielberg",
    lapLength: 4318,
    turns: 10,
    drsZones: [
      { detectionPoint: 1020, activationPoint: 1200, endPoint: 1880 },
      { detectionPoint: 3320, activationPoint: 3490, endPoint: 4190 }
    ],
    sectorDistances: [1510, 3040],
    lat: 47.2197,
    lng: 14.7647
  },
  {
    id: "silverstone",
    name: "Silverstone Circuit",
    shortName: "Silverstone",
    country: "United Kingdom",
    city: "Silverstone",
    lapLength: 5891,
    turns: 18,
    drsZones: [
      { detectionPoint: 1620, activationPoint: 1820, endPoint: 2370 },
      { detectionPoint: 5080, activationPoint: 5320, endPoint: 5780 }
    ],
    sectorDistances: [1983, 4236],
    lat: 52.0786,
    lng: -1.0169
  },
  {
    id: "spa",
    name: "Circuit de Spa-Francorchamps",
    shortName: "Spa",
    country: "Belgium",
    city: "Stavelot",
    lapLength: 7004,
    turns: 19,
    drsZones: [
      { detectionPoint: 340, activationPoint: 520, endPoint: 1080 },
      { detectionPoint: 5840, activationPoint: 6120, endPoint: 6850 }
    ],
    sectorDistances: [2364, 5196],
    lat: 50.4372,
    lng: 5.9714
  },
  {
    id: "hungaroring",
    name: "Hungaroring",
    shortName: "Hungary",
    country: "Hungary",
    city: "Mogyoród",
    lapLength: 4381,
    turns: 14,
    drsZones: [{ detectionPoint: 3600, activationPoint: 3820, endPoint: 4300 }],
    sectorDistances: [1585, 3015],
    lat: 47.5789,
    lng: 19.2486
  },
  {
    id: "zandvoort",
    name: "Circuit Zandvoort",
    shortName: "Zandvoort",
    country: "Netherlands",
    city: "Zandvoort",
    lapLength: 4259,
    turns: 14,
    drsZones: [
      { detectionPoint: 970, activationPoint: 1140, endPoint: 1510 },
      { detectionPoint: 3600, activationPoint: 3770, endPoint: 4160 }
    ],
    sectorDistances: [1490, 3005],
    lat: 52.3888,
    lng: 4.5409
  },
  {
    id: "monza",
    name: "Autodromo Nazionale di Monza",
    shortName: "Monza",
    country: "Italy",
    city: "Monza",
    lapLength: 5793,
    turns: 11,
    drsZones: [
      { detectionPoint: 700, activationPoint: 890, endPoint: 1540 },
      { detectionPoint: 4768, activationPoint: 4980, endPoint: 5680 }
    ],
    sectorDistances: [1950, 4200],
    lat: 45.6156,
    lng: 9.2811
  },
  {
    id: "baku",
    name: "Baku City Circuit",
    shortName: "Baku",
    country: "Azerbaijan",
    city: "Baku",
    lapLength: 6003,
    turns: 20,
    drsZones: [
      { detectionPoint: 390, activationPoint: 560, endPoint: 1380 },
      { detectionPoint: 5320, activationPoint: 5520, endPoint: 5970 }
    ],
    sectorDistances: [2020, 4120],
    lat: 40.3725,
    lng: 49.8533
  },
  {
    id: "singapore",
    name: "Marina Bay Street Circuit",
    shortName: "Singapore",
    country: "Singapore",
    city: "Singapore",
    lapLength: 4940,
    turns: 19,
    drsZones: [
      { detectionPoint: 340, activationPoint: 510, endPoint: 960 },
      { detectionPoint: 4100, activationPoint: 4300, endPoint: 4820 }
    ],
    sectorDistances: [1760, 3590],
    lat: 1.2914,
    lng: 103.864
  },
  {
    id: "cota",
    name: "Circuit of the Americas",
    shortName: "COTA",
    country: "United States",
    city: "Austin",
    lapLength: 5513,
    turns: 20,
    drsZones: [
      { detectionPoint: 550, activationPoint: 730, endPoint: 1290 },
      { detectionPoint: 4780, activationPoint: 4990, endPoint: 5400 }
    ],
    sectorDistances: [1870, 3960],
    lat: 30.1328,
    lng: -97.6411
  },
  {
    id: "mexico_city",
    name: "Autódromo Hermanos Rodríguez",
    shortName: "Mexico City",
    country: "Mexico",
    city: "Mexico City",
    lapLength: 4304,
    turns: 17,
    drsZones: [
      { detectionPoint: 960, activationPoint: 1140, endPoint: 1740 },
      { detectionPoint: 3260, activationPoint: 3420, endPoint: 4120 }
    ],
    sectorDistances: [1460, 2950],
    lat: 19.4042,
    lng: -99.0907
  },
  {
    id: "interlagos",
    name: "Autódromo José Carlos Pace",
    shortName: "Interlagos",
    country: "Brazil",
    city: "São Paulo",
    lapLength: 4309,
    turns: 15,
    drsZones: [
      { detectionPoint: 690, activationPoint: 870, endPoint: 1400 },
      { detectionPoint: 3500, activationPoint: 3690, endPoint: 4190 }
    ],
    sectorDistances: [1471, 3192],
    lat: -23.7036,
    lng: -46.6997
  },
  {
    id: "las_vegas",
    name: "Las Vegas Strip Circuit",
    shortName: "Las Vegas",
    country: "United States",
    city: "Las Vegas",
    lapLength: 6201,
    turns: 17,
    drsZones: [
      { detectionPoint: 850, activationPoint: 1020, endPoint: 1620 },
      { detectionPoint: 5340, activationPoint: 5540, endPoint: 6080 }
    ],
    sectorDistances: [2100, 4400],
    lat: 36.1147,
    lng: -115.1728
  },
  {
    id: "lusail",
    name: "Lusail International Circuit",
    shortName: "Lusail",
    country: "Qatar",
    city: "Lusail",
    lapLength: 5419,
    turns: 16,
    drsZones: [{ detectionPoint: 4600, activationPoint: 4820, endPoint: 5300 }],
    sectorDistances: [1877, 3930],
    lat: 25.49,
    lng: 51.4542
  },
  {
    id: "yas_marina",
    name: "Yas Marina Circuit",
    shortName: "Abu Dhabi",
    country: "United Arab Emirates",
    city: "Abu Dhabi",
    lapLength: 5281,
    turns: 16,
    drsZones: [
      { detectionPoint: 560, activationPoint: 740, endPoint: 1280 },
      { detectionPoint: 4440, activationPoint: 4640, endPoint: 5140 }
    ],
    sectorDistances: [1765, 3760],
    lat: 24.4672,
    lng: 54.6031
  }
] as const;

export const getTrack = (trackId: string): F1Track | undefined =>
  TRACKS.find((track) => track.id === trackId);

export const getTrackIds = (): string[] => TRACKS.map((track) => track.id);
