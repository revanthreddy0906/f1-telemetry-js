export interface F1Team {
  id: string;
  name: string;
  shortName: string;
  color: string;
  secondaryColor: string;
  country: string;
  principal: string;
  powerUnit: string;
  drivers: [string, string];
}

export interface F1Driver {
  code: string;
  number: number;
  firstName: string;
  lastName: string;
  fullName: string;
  teamId: string;
  nationality: string;
  dateOfBirth: string;
}

export const F1_TEAMS: readonly F1Team[] = [
  {
    id: "red_bull",
    name: "Oracle Red Bull Racing",
    shortName: "Red Bull",
    color: "#3671C6",
    secondaryColor: "#1B2A4A",
    country: "Austria",
    principal: "Christian Horner",
    powerUnit: "Honda RBPT",
    drivers: ["VER", "LAW"]
  },
  {
    id: "mclaren",
    name: "McLaren F1 Team",
    shortName: "McLaren",
    color: "#FF8000",
    secondaryColor: "#47352E",
    country: "United Kingdom",
    principal: "Andrea Stella",
    powerUnit: "Mercedes",
    drivers: ["NOR", "PIA"]
  },
  {
    id: "ferrari",
    name: "Scuderia Ferrari",
    shortName: "Ferrari",
    color: "#E8002D",
    secondaryColor: "#FFEB3B",
    country: "Italy",
    principal: "Frédéric Vasseur",
    powerUnit: "Ferrari",
    drivers: ["LEC", "HAM"]
  },
  {
    id: "mercedes",
    name: "Mercedes-AMG Petronas F1 Team",
    shortName: "Mercedes",
    color: "#27F4D2",
    secondaryColor: "#000000",
    country: "Germany",
    principal: "Toto Wolff",
    powerUnit: "Mercedes",
    drivers: ["RUS", "ANT"]
  },
  {
    id: "aston_martin",
    name: "Aston Martin Aramco F1 Team",
    shortName: "Aston Martin",
    color: "#229971",
    secondaryColor: "#04352D",
    country: "United Kingdom",
    principal: "Andy Cowell",
    powerUnit: "Mercedes",
    drivers: ["ALO", "STR"]
  },
  {
    id: "alpine",
    name: "BWT Alpine F1 Team",
    shortName: "Alpine",
    color: "#FF87BC",
    secondaryColor: "#0055A0",
    country: "France",
    principal: "Oliver Oakes",
    powerUnit: "Renault",
    drivers: ["GAS", "DOO"]
  },
  {
    id: "williams",
    name: "Williams Racing",
    shortName: "Williams",
    color: "#1868DB",
    secondaryColor: "#00275E",
    country: "United Kingdom",
    principal: "James Vowles",
    powerUnit: "Mercedes",
    drivers: ["SAI", "ALB"]
  },
  {
    id: "rb",
    name: "Visa Cash App Racing Bulls",
    shortName: "RB",
    color: "#6692FF",
    secondaryColor: "#1A2B4A",
    country: "Italy",
    principal: "Laurent Mekies",
    powerUnit: "Honda RBPT",
    drivers: ["TSU", "HAD"]
  },
  {
    id: "kick_sauber",
    name: "Stake F1 Team Kick Sauber",
    shortName: "Kick Sauber",
    color: "#52E252",
    secondaryColor: "#1B3D2F",
    country: "Switzerland",
    principal: "Mattia Binotto",
    powerUnit: "Ferrari",
    drivers: ["HUL", "BOR"]
  },
  {
    id: "haas",
    name: "MoneyGram Haas F1 Team",
    shortName: "Haas",
    color: "#B6BABD",
    secondaryColor: "#B40D14",
    country: "United States",
    principal: "Ayao Komatsu",
    powerUnit: "Ferrari",
    drivers: ["OCO", "BEA"]
  }
] as const;

export const TEAM_COLORS: Readonly<Record<string, string>> = {
  red_bull: "#3671C6",
  mclaren: "#FF8000",
  ferrari: "#E8002D",
  mercedes: "#27F4D2",
  aston_martin: "#229971",
  alpine: "#FF87BC",
  williams: "#1868DB",
  rb: "#6692FF",
  kick_sauber: "#52E252",
  haas: "#B6BABD"
} as const;

export const F1_DRIVERS: readonly F1Driver[] = [
  {
    code: "VER",
    number: 1,
    firstName: "Max",
    lastName: "Verstappen",
    fullName: "Max Verstappen",
    teamId: "red_bull",
    nationality: "Dutch",
    dateOfBirth: "1997-09-30"
  },
  {
    code: "LAW",
    number: 30,
    firstName: "Liam",
    lastName: "Lawson",
    fullName: "Liam Lawson",
    teamId: "red_bull",
    nationality: "New Zealander",
    dateOfBirth: "2002-02-11"
  },
  {
    code: "NOR",
    number: 4,
    firstName: "Lando",
    lastName: "Norris",
    fullName: "Lando Norris",
    teamId: "mclaren",
    nationality: "British",
    dateOfBirth: "1999-11-13"
  },
  {
    code: "PIA",
    number: 81,
    firstName: "Oscar",
    lastName: "Piastri",
    fullName: "Oscar Piastri",
    teamId: "mclaren",
    nationality: "Australian",
    dateOfBirth: "2001-04-06"
  },
  {
    code: "LEC",
    number: 16,
    firstName: "Charles",
    lastName: "Leclerc",
    fullName: "Charles Leclerc",
    teamId: "ferrari",
    nationality: "Monégasque",
    dateOfBirth: "1997-10-16"
  },
  {
    code: "HAM",
    number: 44,
    firstName: "Lewis",
    lastName: "Hamilton",
    fullName: "Lewis Hamilton",
    teamId: "ferrari",
    nationality: "British",
    dateOfBirth: "1985-01-07"
  },
  {
    code: "RUS",
    number: 63,
    firstName: "George",
    lastName: "Russell",
    fullName: "George Russell",
    teamId: "mercedes",
    nationality: "British",
    dateOfBirth: "1998-02-15"
  },
  {
    code: "ANT",
    number: 12,
    firstName: "Kimi",
    lastName: "Antonelli",
    fullName: "Kimi Antonelli",
    teamId: "mercedes",
    nationality: "Italian",
    dateOfBirth: "2006-08-25"
  },
  {
    code: "ALO",
    number: 14,
    firstName: "Fernando",
    lastName: "Alonso",
    fullName: "Fernando Alonso",
    teamId: "aston_martin",
    nationality: "Spanish",
    dateOfBirth: "1981-07-29"
  },
  {
    code: "STR",
    number: 18,
    firstName: "Lance",
    lastName: "Stroll",
    fullName: "Lance Stroll",
    teamId: "aston_martin",
    nationality: "Canadian",
    dateOfBirth: "1998-10-29"
  },
  {
    code: "GAS",
    number: 10,
    firstName: "Pierre",
    lastName: "Gasly",
    fullName: "Pierre Gasly",
    teamId: "alpine",
    nationality: "French",
    dateOfBirth: "1996-02-07"
  },
  {
    code: "DOO",
    number: 7,
    firstName: "Jack",
    lastName: "Doohan",
    fullName: "Jack Doohan",
    teamId: "alpine",
    nationality: "Australian",
    dateOfBirth: "2003-01-20"
  },
  {
    code: "ALB",
    number: 23,
    firstName: "Alexander",
    lastName: "Albon",
    fullName: "Alexander Albon",
    teamId: "williams",
    nationality: "Thai",
    dateOfBirth: "1996-03-23"
  },
  {
    code: "SAI",
    number: 55,
    firstName: "Carlos",
    lastName: "Sainz Jr.",
    fullName: "Carlos Sainz Jr.",
    teamId: "williams",
    nationality: "Spanish",
    dateOfBirth: "1994-09-01"
  },
  {
    code: "TSU",
    number: 22,
    firstName: "Yuki",
    lastName: "Tsunoda",
    fullName: "Yuki Tsunoda",
    teamId: "rb",
    nationality: "Japanese",
    dateOfBirth: "2000-05-11"
  },
  {
    code: "HAD",
    number: 6,
    firstName: "Isack",
    lastName: "Hadjar",
    fullName: "Isack Hadjar",
    teamId: "rb",
    nationality: "French",
    dateOfBirth: "2004-09-28"
  },
  {
    code: "HUL",
    number: 27,
    firstName: "Nico",
    lastName: "Hülkenberg",
    fullName: "Nico Hülkenberg",
    teamId: "kick_sauber",
    nationality: "German",
    dateOfBirth: "1987-08-19"
  },
  {
    code: "BOR",
    number: 5,
    firstName: "Gabriel",
    lastName: "Bortoleto",
    fullName: "Gabriel Bortoleto",
    teamId: "kick_sauber",
    nationality: "Brazilian",
    dateOfBirth: "2004-10-14"
  },
  {
    code: "OCO",
    number: 31,
    firstName: "Esteban",
    lastName: "Ocon",
    fullName: "Esteban Ocon",
    teamId: "haas",
    nationality: "French",
    dateOfBirth: "1996-09-17"
  },
  {
    code: "BEA",
    number: 87,
    firstName: "Oliver",
    lastName: "Bearman",
    fullName: "Oliver Bearman",
    teamId: "haas",
    nationality: "British",
    dateOfBirth: "2005-05-08"
  }
] as const;

export const getTeam = (teamId: string): F1Team | undefined =>
  F1_TEAMS.find((team) => team.id === teamId);

export const getDriver = (code: string): F1Driver | undefined =>
  F1_DRIVERS.find((driver) => driver.code === code.toUpperCase());

export const getDriverColor = (code: string): string | undefined => {
  const driver = getDriver(code);
  if (!driver) {
    return undefined;
  }
  return TEAM_COLORS[driver.teamId];
};

export const getTeamDrivers = (teamId: string): F1Driver[] =>
  F1_DRIVERS.filter((driver) => driver.teamId === teamId);
