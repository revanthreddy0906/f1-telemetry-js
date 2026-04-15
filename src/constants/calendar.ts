export interface RaceWeekend {
  round: number;
  raceName: string;
  trackId: string;
  country: string;
  dateStart: string;
  raceDate: string;
  isSprint: boolean;
}

export const RACE_CALENDAR_2025: readonly RaceWeekend[] = [
  {
    round: 1,
    raceName: "Australian Grand Prix",
    trackId: "albert_park",
    country: "Australia",
    dateStart: "2025-03-14",
    raceDate: "2025-03-16",
    isSprint: false
  },
  {
    round: 2,
    raceName: "Chinese Grand Prix",
    trackId: "shanghai",
    country: "China",
    dateStart: "2025-03-21",
    raceDate: "2025-03-23",
    isSprint: true
  },
  {
    round: 3,
    raceName: "Japanese Grand Prix",
    trackId: "suzuka",
    country: "Japan",
    dateStart: "2025-04-04",
    raceDate: "2025-04-06",
    isSprint: false
  },
  {
    round: 4,
    raceName: "Bahrain Grand Prix",
    trackId: "bahrain",
    country: "Bahrain",
    dateStart: "2025-04-11",
    raceDate: "2025-04-13",
    isSprint: false
  },
  {
    round: 5,
    raceName: "Saudi Arabian Grand Prix",
    trackId: "jeddah",
    country: "Saudi Arabia",
    dateStart: "2025-04-18",
    raceDate: "2025-04-20",
    isSprint: false
  },
  {
    round: 6,
    raceName: "Miami Grand Prix",
    trackId: "miami",
    country: "United States",
    dateStart: "2025-05-02",
    raceDate: "2025-05-04",
    isSprint: true
  },
  {
    round: 7,
    raceName: "Emilia Romagna Grand Prix",
    trackId: "imola",
    country: "Italy",
    dateStart: "2025-05-16",
    raceDate: "2025-05-18",
    isSprint: false
  },
  {
    round: 8,
    raceName: "Monaco Grand Prix",
    trackId: "monaco",
    country: "Monaco",
    dateStart: "2025-05-23",
    raceDate: "2025-05-25",
    isSprint: false
  },
  {
    round: 9,
    raceName: "Spanish Grand Prix",
    trackId: "barcelona",
    country: "Spain",
    dateStart: "2025-05-30",
    raceDate: "2025-06-01",
    isSprint: false
  },
  {
    round: 10,
    raceName: "Canadian Grand Prix",
    trackId: "montreal",
    country: "Canada",
    dateStart: "2025-06-13",
    raceDate: "2025-06-15",
    isSprint: false
  },
  {
    round: 11,
    raceName: "Austrian Grand Prix",
    trackId: "red_bull_ring",
    country: "Austria",
    dateStart: "2025-06-27",
    raceDate: "2025-06-29",
    isSprint: false
  },
  {
    round: 12,
    raceName: "British Grand Prix",
    trackId: "silverstone",
    country: "United Kingdom",
    dateStart: "2025-07-04",
    raceDate: "2025-07-06",
    isSprint: false
  },
  {
    round: 13,
    raceName: "Belgian Grand Prix",
    trackId: "spa",
    country: "Belgium",
    dateStart: "2025-07-25",
    raceDate: "2025-07-27",
    isSprint: true
  },
  {
    round: 14,
    raceName: "Hungarian Grand Prix",
    trackId: "hungaroring",
    country: "Hungary",
    dateStart: "2025-08-01",
    raceDate: "2025-08-03",
    isSprint: false
  },
  {
    round: 15,
    raceName: "Dutch Grand Prix",
    trackId: "zandvoort",
    country: "Netherlands",
    dateStart: "2025-08-29",
    raceDate: "2025-08-31",
    isSprint: false
  },
  {
    round: 16,
    raceName: "Italian Grand Prix",
    trackId: "monza",
    country: "Italy",
    dateStart: "2025-09-05",
    raceDate: "2025-09-07",
    isSprint: false
  },
  {
    round: 17,
    raceName: "Azerbaijan Grand Prix",
    trackId: "baku",
    country: "Azerbaijan",
    dateStart: "2025-09-19",
    raceDate: "2025-09-21",
    isSprint: false
  },
  {
    round: 18,
    raceName: "Singapore Grand Prix",
    trackId: "singapore",
    country: "Singapore",
    dateStart: "2025-10-03",
    raceDate: "2025-10-05",
    isSprint: false
  },
  {
    round: 19,
    raceName: "United States Grand Prix",
    trackId: "cota",
    country: "United States",
    dateStart: "2025-10-17",
    raceDate: "2025-10-19",
    isSprint: true
  },
  {
    round: 20,
    raceName: "Mexico City Grand Prix",
    trackId: "mexico_city",
    country: "Mexico",
    dateStart: "2025-10-24",
    raceDate: "2025-10-26",
    isSprint: false
  },
  {
    round: 21,
    raceName: "São Paulo Grand Prix",
    trackId: "interlagos",
    country: "Brazil",
    dateStart: "2025-11-07",
    raceDate: "2025-11-09",
    isSprint: true
  },
  {
    round: 22,
    raceName: "Las Vegas Grand Prix",
    trackId: "las_vegas",
    country: "United States",
    dateStart: "2025-11-20",
    raceDate: "2025-11-22",
    isSprint: false
  },
  {
    round: 23,
    raceName: "Qatar Grand Prix",
    trackId: "lusail",
    country: "Qatar",
    dateStart: "2025-11-28",
    raceDate: "2025-11-30",
    isSprint: true
  },
  {
    round: 24,
    raceName: "Abu Dhabi Grand Prix",
    trackId: "yas_marina",
    country: "United Arab Emirates",
    dateStart: "2025-12-05",
    raceDate: "2025-12-07",
    isSprint: false
  }
] as const;

export const getNextRace = (today = new Date()): RaceWeekend | undefined => {
  const now = today.getTime();
  return RACE_CALENDAR_2025.find((race) => Date.parse(race.raceDate) >= now);
};

export const getSprintWeekends = (): RaceWeekend[] =>
  RACE_CALENDAR_2025.filter((race) => race.isSprint);

export const getRaceByRound = (round: number): RaceWeekend | undefined =>
  RACE_CALENDAR_2025.find((race) => race.round === round);
